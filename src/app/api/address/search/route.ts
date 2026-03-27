import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const limit = searchParams.get('limit') || '5';

    if (!q) {
        return NextResponse.json({ features: [] });
    }

    try {
        const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=${limit}`, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Cargofly-Address-Proxy/1.0'
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error(`Photon API responded with ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Address search proxy error:', error);
        return NextResponse.json({ error: 'Failed to fetch address suggestions', features: [] }, { status: 500 });
    }
}
