import { NextResponse } from "next/server";
import { paymentManager } from "@/lib/payments/manager";
import { PaymentInitializationRequest } from "@/lib/payments/types";

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

        return NextResponse.json(result);
    } catch (error) {
        console.error("Payment API Error:", error);
        return NextResponse.json({
            status: false,
            message: "Internal server error during payment initialization"
        }, { status: 500 });
    }
}
