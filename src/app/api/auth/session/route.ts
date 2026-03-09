import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'default_secure_secret_for_local_dev_only_change_in_prod_12345!'
);

export async function POST(request: Request) {
    try {
        const { idToken } = await request.json();

        if (!idToken) {
            return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
        }

        // 1. Fetch user profile directly from Firestore REST API using the client's own idToken
        // This securely gets the role without needing firebase-admin or a service account,
        // because the user has permission to read their own document.
        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users`;

        // We need to decode the Google JWT first just to get the UID, 
        // or we can just fetch all users? No, we need the UID.
        // A quick lightweight decode (not verify, since we'll rely on Firestore to reject invalid tokens):
        const tokenParts = idToken.split('.');
        if (tokenParts.length !== 3) {
            return NextResponse.json({ error: 'Invalid token format' }, { status: 401 });
        }
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString('utf8'));
        const uid = payload.user_id || payload.sub;

        if (!uid) {
            return NextResponse.json({ error: 'Could not extract UID from token' }, { status: 401 });
        }

        const response = await fetch(`${firestoreUrl}/${uid}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
            // cache: 'no-store'
        });

        if (!response.ok) {
            console.error('Failed to fetch user from Firestore:', await response.text());
            return NextResponse.json({ error: 'Unauthorized or user not found' }, { status: 401 });
        }

        const data = await response.json();

        // Extract role from Firestore document format
        // e.g., data.fields.role.stringValue
        const role = data?.fields?.role?.stringValue || 'customer';

        // 2. Sign our own lightweight Edge-compatible JWT
        const jwt = await new SignJWT({ uid, role })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(JWT_SECRET);

        // 3. Set standard Next.js cookie
        const res = NextResponse.json({ success: true, role });
        res.cookies.set('session', jwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24, // 24 hours
        });

        return res;
    } catch (error) {
        console.error('Session endpoint error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE() {
    const res = NextResponse.json({ success: true });
    res.cookies.delete('session');
    return res;
}
