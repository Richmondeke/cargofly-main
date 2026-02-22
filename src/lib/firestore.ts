import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    query,
    where,
    orderBy,
    Timestamp,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// Types
export interface ShipmentAddress {
    name: string;
    company?: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
    email?: string;
}

export interface ShipmentPackage {
    weight: number;
    dimensions: {
        length: number;
        width: number;
        height: number;
    };
    description: string;
    declaredValue?: number;
    isFragile: boolean;
    requiresSignature: boolean;
}

export interface ShipmentPrice {
    base: number;
    fuel: number;
    insurance?: number;
    total: number;
    currency: string;
}

export type ShipmentStatus =
    | "pending"
    | "confirmed"
    | "picked_up"
    | "in_transit"
    | "at_hub"
    | "out_for_delivery"
    | "delivered"
    | "cancelled"
    | "returned";

export interface Shipment {
    id?: string;
    trackingNumber: string;
    userId: string;
    status: ShipmentStatus;
    currentLocation: string;
    progress: number;
    package: ShipmentPackage;
    sender: ShipmentAddress;
    recipient: ShipmentAddress;
    service: "express" | "standard" | "economy";
    estimatedDelivery: Timestamp;
    price: ShipmentPrice;
    paymentStatus: "pending" | "paid" | "failed" | "refunded";
    paymentMethod?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    pickedUpAt?: Timestamp;
    deliveredAt?: Timestamp;
}

export interface TrackingEvent {
    id?: string;
    shipmentId: string;
    status: ShipmentStatus;
    location: string;
    description: string;
    timestamp: Timestamp;
    createdBy?: string;
}

// Generate tracking number
export function generateTrackingNumber(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "CF-";
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Create a new shipment
export async function createShipment(
    shipmentData: Omit<Shipment, "id" | "trackingNumber" | "createdAt" | "updatedAt" | "status" | "progress" | "currentLocation">
): Promise<string> {
    const trackingNumber = generateTrackingNumber();

    const shipment: Omit<Shipment, "id"> = {
        ...shipmentData,
        trackingNumber,
        status: "pending",
        currentLocation: shipmentData.sender.city + ", " + shipmentData.sender.country,
        progress: 0,
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
    };

    const docRef = await addDoc(collection(db, "shipments"), shipment);

    // Create initial tracking event
    await addTrackingEvent(docRef.id, {
        shipmentId: docRef.id,
        status: "pending",
        location: shipment.currentLocation,
        description: "Shipment created and awaiting pickup",
        timestamp: serverTimestamp() as Timestamp,
    });

    return trackingNumber;
}

// Helper to get random item
export const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const MOCK_LOCATIONS = [
    { city: "Lagos", country: "Nigeria" },
    { city: "London", country: "United Kingdom" },
    { city: "New York", country: "USA" },
    { city: "Dubai", country: "UAE" }
];

// Generate Mock Shipment
function generateMockShipment(trackingNumber: string): Shipment {
    const origin = MOCK_LOCATIONS[0];
    const dest = MOCK_LOCATIONS[1];
    const now = new Date();
    const created = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days ago

    return {
        id: `mock_${trackingNumber}`,
        trackingNumber: trackingNumber.toUpperCase(),
        userId: "demo-user",
        status: "in_transit",
        currentLocation: "Frankfurt, Germany", // Transit hub
        progress: 50,
        package: {
            weight: 5.5,
            dimensions: { length: 30, width: 20, height: 15 },
            description: "General Cargo",
            isFragile: false,
            requiresSignature: true
        },
        sender: {
            name: "Sender Name",
            street: "123 Origin St",
            city: origin.city,
            state: "State",
            postalCode: "10001",
            country: origin.country,
            phone: "+1234567890"
        },
        recipient: {
            name: "Recipient Name",
            street: "456 Dest Rd",
            city: dest.city,
            state: "State",
            postalCode: "20002",
            country: dest.country,
            phone: "+0987654321"
        },
        service: "express",
        estimatedDelivery: Timestamp.now(), // Due today/tomorrow
        price: {
            base: 150,
            fuel: 20,
            total: 170,
            currency: "USD"
        },
        paymentStatus: "paid",
        createdAt: Timestamp.fromDate(created),
        updatedAt: Timestamp.now()
    };
}

// Get shipment by tracking number
export async function getShipmentByTracking(trackingNumber: string): Promise<Shipment | null> {
    try {
        const q = query(
            collection(db, "shipments"),
            where("trackingNumber", "==", trackingNumber.toUpperCase())
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            return { id: doc.id, ...doc.data() } as Shipment;
        }
    } catch (e) {
        console.warn("Firestore fetch failed, falling back to mock:", e);
    }

    // Fallback: Mock Data for specific formats or ALWAYS for demo if requested
    console.log("Generating mock data for:", trackingNumber);
    return generateMockShipment(trackingNumber);
}

// Get user's shipments
export async function getUserShipments(userId: string): Promise<Shipment[]> {
    const q = query(
        collection(db, "shipments"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Shipment);
}

// Add tracking event
export async function addTrackingEvent(
    shipmentId: string,
    event: Omit<TrackingEvent, "id">
): Promise<void> {
    if (shipmentId.startsWith("mock_")) return; // Don't write to DB for mock
    await addDoc(collection(db, "shipments", shipmentId, "tracking_events"), event);
}

// Get tracking events for a shipment
export async function getTrackingEvents(shipmentId: string): Promise<TrackingEvent[]> {
    // If it's a mock shipment, return mock events
    if (shipmentId.startsWith("mock_")) {
        const now = new Date();
        return [
            {
                id: "evt_3",
                shipmentId,
                status: "in_transit",
                location: "Frankfurt, Germany",
                description: "Arrived at transit hub",
                timestamp: Timestamp.now()
            },
            {
                id: "evt_2",
                shipmentId,
                status: "picked_up",
                location: "Lagos, Nigeria",
                description: "Picked up by courier",
                timestamp: Timestamp.fromDate(new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000))
            },
            {
                id: "evt_1",
                shipmentId,
                status: "pending",
                location: "Lagos, Nigeria",
                description: "Shipment created",
                timestamp: Timestamp.fromDate(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000))
            }
        ];
    }

    try {
        const q = query(
            collection(db, "shipments", shipmentId, "tracking_events"),
            orderBy("timestamp", "desc")
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as TrackingEvent);
    } catch (error) {
        console.error("Error fetching events, returning empty array", error);
        return [];
    }
}

// Update shipment status
export async function updateShipmentStatus(
    shipmentId: string,
    status: ShipmentStatus,
    location: string,
    description: string,
    updatedBy?: string
): Promise<void> {
    if (shipmentId.startsWith("mock_")) return; // Don't write for mock

    const shipmentRef = doc(db, "shipments", shipmentId);

    // Calculate progress based on status
    const progressMap: Record<ShipmentStatus, number> = {
        pending: 0,
        confirmed: 15,
        picked_up: 30,
        in_transit: 50,
        at_hub: 65,
        out_for_delivery: 85,
        delivered: 100,
        cancelled: 0,
        returned: 0,
    };

    await updateDoc(shipmentRef, {
        status,
        currentLocation: location,
        progress: progressMap[status],
        updatedAt: serverTimestamp(),
        ...(status === "delivered" && { deliveredAt: serverTimestamp() }),
        ...(status === "picked_up" && { pickedUpAt: serverTimestamp() }),
    });

    // Add tracking event
    await addTrackingEvent(shipmentId, {
        shipmentId,
        status,
        location,
        description,
        timestamp: serverTimestamp() as Timestamp,
        createdBy: updatedBy,
    });
}


// Format timestamp for display
export function formatTimestamp(timestamp: Timestamp): string {
    if (!timestamp || !timestamp.toDate) return "";
    return timestamp.toDate().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

// Get status display text
export function getStatusDisplay(status: ShipmentStatus): string {
    const displayMap: Record<ShipmentStatus, string> = {
        pending: "Pending",
        confirmed: "Confirmed",
        picked_up: "Picked Up",
        in_transit: "In Transit",
        at_hub: "At Sorting Hub",
        out_for_delivery: "Out for Delivery",
        delivered: "Delivered",
        cancelled: "Cancelled",
        returned: "Returned",
    };
    return displayMap[status];
}

// Wallet Types
export interface WalletTransaction {
    id: string;
    userId: string;
    type: "credit" | "debit";
    amount: number;
    description: string;
    reference?: string; // Shipment ID or Payment Ref
    status: "pending" | "success" | "failed";
    createdAt: Timestamp;
}

// Fund Wallet
export async function fundWallet(userId: string, amount: number, reference?: string): Promise<void> {
    const userRef = doc(db, "users", userId);

    // 1. Transaction record
    await addDoc(collection(db, "users", userId, "transactions"), {
        userId,
        type: "credit",
        amount,
        description: "Wallet Funding",
        reference: reference || `FUND-${Date.now()}`,
        status: "success",
        createdAt: serverTimestamp(),
    });

    // 2. Update balance
    // Note: For production, use runTransaction to ensure atomicity
    const userSnap = await getDoc(userRef);
    const currentBalance = userSnap.data()?.walletBalance || 0;

    await updateDoc(userRef, {
        walletBalance: currentBalance + amount,
        updatedAt: serverTimestamp(),
    });
}

// Pay with Wallet
export async function payWithWallet(userId: string, amount: number, shipmentId: string): Promise<void> {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const currentBalance = userSnap.data()?.walletBalance || 0;

    if (currentBalance < amount) {
        throw new Error("Insufficient wallet balance");
    }

    // 1. Transaction record
    await addDoc(collection(db, "users", userId, "transactions"), {
        userId,
        type: "debit",
        amount,
        description: `Payment for Shipment #${shipmentId}`,
        reference: shipmentId,
        status: "success",
        createdAt: serverTimestamp(),
    });

    // 2. Deduct balance
    await updateDoc(userRef, {
        walletBalance: currentBalance - amount,
        updatedAt: serverTimestamp(),
    });
}

// Get Wallet Transactions
export async function getWalletTransactions(userId: string): Promise<WalletTransaction[]> {
    const q = query(
        collection(db, "users", userId, "transactions"),
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as WalletTransaction);
}
