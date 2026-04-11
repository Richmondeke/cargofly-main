import { NextResponse } from "next/server";
import { paymentManager } from "@/lib/payments/manager";
import { PaymentInitializationRequest } from "@/lib/payments/types";
import { serverDb as db } from "@/lib/firebase-server";
import { collection, query, where, getDocs, updateDoc, doc, serverTimestamp } from "firebase/firestore";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.amount || !body.customer?.email) {
            return NextResponse.json({
                status: false,
                message: "Missing required billing details"
            }, { status: 400 });
        }

        const paymentReq: PaymentInitializationRequest = {
            amount: body.amount,
            currency: body.currency || "NGN",
            customer: body.customer,
            reference: `KPY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            description: body.description || "Cargofly Logistics Service",
            metadata: body.metadata
        };

        const result = await paymentManager.initializePayment(paymentReq);

        // PERSIST REFERENCE: If initialization was successful and we have a tracking number, 
        // store the reference on the shipment so we can verify it later even if redirect fails.
        if (result.status && body.metadata?.trackingNumber && db) {
            try {
                const shipmentsRef = collection(db, "shipments");
                const q = query(shipmentsRef, where("trackingNumber", "==", body.metadata.trackingNumber));
                const querySnap = await getDocs(q);

                if (!querySnap.empty) {
                    await updateDoc(doc(db, "shipments", querySnap.docs[0].id), {
                        lastPaymentReference: paymentReq.reference,
                        updatedAt: serverTimestamp()
                    });
                    console.log(`Stored payment reference ${paymentReq.reference} for shipment ${body.metadata.trackingNumber}`);
                }
            } catch (fsError) {
                console.error("Failed to persist payment reference:", fsError);
                // We don't fail the whole request because initialization was successful
            }
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("Payment API Error:", error);
        return NextResponse.json({
            status: false,
            message: "Internal server error during payment initialization"
        }, { status: 500 });
    }
}
