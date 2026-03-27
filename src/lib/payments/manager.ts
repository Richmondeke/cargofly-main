import { KorapayProvider } from "./korapay";
import {
    PaymentInitializationRequest,
    PaymentInitializationResponse,
    PaymentProvider
} from "./types";

export class PaymentManager {
    private providers: PaymentProvider[] = [];

    constructor() {
        // Initialize with Korapay as primary
        if (process.env.KORAPAY_SECRET_KEY) {
            this.providers.push(new KorapayProvider(process.env.KORAPAY_SECRET_KEY));
        }

        // Future: Add Backup (Paystack) and Tertiary (Flutterwave)
        // if (process.env.PAYSTACK_SECRET_KEY) {
        //     this.providers.push(new PaystackProvider(process.env.PAYSTACK_SECRET_KEY));
        // }
    }

    async initializePayment(request: PaymentInitializationRequest): Promise<PaymentInitializationResponse> {
        let lastError = "No payment providers configured";

        for (const provider of this.providers) {
            console.log(`Attempting payment initialization with ${provider.name}...`);
            const response = await provider.initialize(request);

            if (response.status) {
                return response;
            }

            lastError = `[${provider.name}]: ${response.message}`;
            console.warn(`Payment provider ${provider.name} failed: ${response.message}`);
            // If primary fails, continue to next provider (Backup, then Tertiary)
        }

        return {
            status: false,
            message: `All payment providers failed. Last error: ${lastError}`,
            data: { checkout_url: "", reference: request.reference, provider: "none" }
        };
    }
}

// Singleton instance
export const paymentManager = new PaymentManager();
