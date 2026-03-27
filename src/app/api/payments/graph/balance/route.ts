import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    // Mocking a balance response from Graph.finance
    // In a real app, this would fetch from an external service or a database
    return NextResponse.json({
        balance: 1850.75,
        currency: 'USD',
        status: 'active',
        lastSync: new Date().toISOString()
    });
}
