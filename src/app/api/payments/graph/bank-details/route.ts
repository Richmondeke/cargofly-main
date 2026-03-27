import { NextRequest, NextResponse } from 'next/server';

const GRAPH_API_URL = process.env.GRAPH_API_URL || 'https://api.usegraph.io/v1';
const GRAPH_API_KEY = process.env.GRAPH_API_KEY || '';

/**
 * GET /api/payments/graph/bank-details
 * Fetches virtual account / bank details from Graph.finance for the current user.
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const currency = searchParams.get('currency') || 'USD';

        if (!GRAPH_API_KEY) {
            // Return mock bank details when no API key is configured (dev/preview)
            return NextResponse.json({
                success: true,
                mock: true,
                data: getMockBankDetails(currency),
            });
        }

        // Fetch virtual account details from Graph.finance
        const res = await fetch(`${GRAPH_API_URL}/virtual-accounts?currency=${currency}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GRAPH_API_KEY}`,
            },
            next: { revalidate: 300 }, // Cache for 5 minutes
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({ message: 'Unknown error' }));
            // Fall back to mock on API error so the UI is never broken
            console.error('[Graph Bank Details Error]', err);
            return NextResponse.json({
                success: true,
                mock: true,
                data: getMockBankDetails(currency),
            });
        }

        const result = await res.json();
        // Graph.finance returns accounts array; pick the matching currency
        const accounts: GraphVirtualAccount[] = result?.data || result?.accounts || [];
        const account = accounts.find((a) => a.currency === currency) || accounts[0];

        if (!account) {
            return NextResponse.json({
                success: true,
                mock: true,
                data: getMockBankDetails(currency),
            });
        }

        return NextResponse.json({
            success: true,
            mock: false,
            data: mapGraphAccount(account),
        });
    } catch (error: any) {
        console.error('[Graph Bank Details]', error);
        return NextResponse.json({
            success: true,
            mock: true,
            data: getMockBankDetails('USD'),
        });
    }
}

// ─── Types ─────────────────────────────────────────────────────────────────

interface GraphVirtualAccount {
    id: string;
    currency: string;
    account_name?: string;
    bank_name?: string;
    account_number?: string;
    routing_number?: string;
    iban?: string;
    swift_code?: string;
    sort_code?: string;
    bank_address?: string;
    status?: string;
    reference?: string;
}

interface BankDetailsPayload {
    accountName: string;
    bankName: string;
    accountNumber: string;
    routingNumber?: string;
    iban?: string;
    swiftCode?: string;
    sortCode?: string;
    currency: string;
    bankAddress?: string;
    reference?: string;
    status: string;
}

function mapGraphAccount(a: GraphVirtualAccount): BankDetailsPayload {
    return {
        accountName: a.account_name || 'Cargofly / Caverton Cargo',
        bankName: a.bank_name || 'Graph Finance Bank',
        accountNumber: a.account_number || '—',
        routingNumber: a.routing_number,
        iban: a.iban,
        swiftCode: a.swift_code,
        sortCode: a.sort_code,
        bankAddress: a.bank_address,
        currency: a.currency,
        reference: a.reference,
        status: a.status || 'active',
    };
}

function getMockBankDetails(currency: string): BankDetailsPayload {
    if (currency === 'GBP') {
        return {
            accountName: 'Cargofly / Caverton Cargo Ltd',
            bankName: 'Barclays Bank UK',
            accountNumber: '12345678',
            sortCode: '20-00-00',
            iban: 'GB29BARC20000012345678',
            swiftCode: 'BARCGB22',
            currency: 'GBP',
            bankAddress: '1 Churchill Place, London E14 5HP, United Kingdom',
            status: 'active',
        };
    }
    return {
        accountName: 'Cargofly / Caverton Cargo Ltd',
        bankName: 'Wells Fargo Bank N.A.',
        accountNumber: '4020072456789',
        routingNumber: '121000248',
        swiftCode: 'WFBIUS6S',
        currency: 'USD',
        bankAddress: '420 Montgomery Street, San Francisco, CA 94104, USA',
        status: 'active',
    };
}
