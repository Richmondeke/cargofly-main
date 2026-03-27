import { NextRequest, NextResponse } from "next/server";
import { KorapayProvider } from "@/lib/payments/korapay";
import { serverDb as db } from "@/lib/firebase-server";
import { doc, updateDoc, serverTimestamp, getDocs, collection, query, where } from "firebase/firestore";

export async function GET(req: NextRequest) {
    if (!db) {
        return NextResponse.json({ status: false, message: "Firebase Database not initialized" }, { status: 500 });
    }
    try {
        const searchParams = req.nextUrl.searchParams;
        const reference = searchParams.get("reference");

        if (!reference) {
            return NextResponse.json({ status: false, message: "Reference is required" }, { status: 400 });
        }

        const provider = new KorapayProvider(process.env.KORAPAY_SECRET_KEY || "");
        const verificationData = await provider.verify(reference);

        if (verificationData) {
            // Get tracking number from metadata if available, otherwise assume reference is tracking number
            // Korapay returns metadata in verification data
            const trackingNumFromMeta = verificationData.metadata?.trackingNumber;
            const finalTrackingNumber = trackingNumFromMeta || reference;

            const shipmentsRef = collection(db, "shipments");
            const q = query(shipmentsRef, where("trackingNumber", "==", finalTrackingNumber));
            const querySnap = await getDocs(q);

            if (!querySnap.empty) {
                const shipmentDoc = querySnap.docs[0];
                await updateDoc(doc(db, "shipments", shipmentDoc.id), {
                    paymentStatus: "paid",
                    status: "confirmed",
                    updatedAt: serverTimestamp()
                });

                return NextResponse.json({
                    status: true,
                    message: "Payment verified successfully",
                    trackingNumber: finalTrackingNumber,
                    reference: reference
                });
            } else {
                console.warn(`Shipment not found for tracking number: ${finalTrackingNumber} (Ref: ${reference})`);
                return NextResponse.json({ status: false, message: `Shipment not found for ${finalTrackingNumber}` }, { status: 404 });
            }
        }

        return NextResponse.json({ status: false, message: "Payment not verified yet" });
    } catch (error) {
        console.error("Verification API Error:", error);
        return NextResponse.json({ status: false, message: "Verification failed" }, { status: 500 });
    }
}
