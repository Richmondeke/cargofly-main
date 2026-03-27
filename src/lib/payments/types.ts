export type PaymentCurrency = "NGN" | "USD" | "KES" | "GHS";

export interface PaymentCustomer {
    name: string;
    email: string;
}

export interface PaymentInitializationRequest {
    amount: number;
    currency: PaymentCurrency;
    customer: PaymentCustomer;
    reference: string;
    description?: string;
    metadata?: Record<string, any>;
}

export interface PaymentInitializationResponse {
    status: boolean;
    message: string;
    data: {
        checkout_url: string;
        reference: string;
        provider: string;
    };
}

export interface PaymentProvider {
    name: string;
    initialize(request: PaymentInitializationRequest): Promise<PaymentInitializationResponse>;
    verify(reference: string): Promise<any>;
}
