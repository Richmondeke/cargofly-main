import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'default_secure_secret_for_local_dev_only_change_in_prod_12345!'
);

// Map of IP addresses to their request counts and reset times
interface RateLimitInfo {
    count: number;
    resetAt: number;
}
const rateLimits = new Map<string, RateLimitInfo>();

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Basic In-Memory Rate Limiting (Protects /api/* routes from abuse)
    if (pathname.startsWith('/api/')) {
        const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
        const now = Date.now();
        const windowMs = 60 * 1000; // 1 minute window
        const maxRequests = 60; // Max 60 requests per minute per IP

        const rateLimitInfo = rateLimits.get(ip);
        if (!rateLimitInfo || now > rateLimitInfo.resetAt) {
            // First request or window expired, reset
            rateLimits.set(ip, { count: 1, resetAt: now + windowMs });
        } else {
            rateLimitInfo.count += 1;
            if (rateLimitInfo.count > maxRequests) {
                // Rate limit exceeded
                return NextResponse.json(
                    { error: 'Too many requests, please try again later.' },
                    { status: 429 }
                );
            }
        }
    }

    // 2. Strict Server-Side Admin Route Protection (Protects /dashboard/admin)
    if (pathname.startsWith('/dashboard/admin')) {
        const sessionCookie = request.cookies.get('session')?.value;

        if (!sessionCookie) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            // Verify our lightweight session JWT
            const { payload } = await jwtVerify(sessionCookie, JWT_SECRET, {
                algorithms: ['HS256'],
            });

            // Strict RBAC Verification at the Edge
            if (payload.role !== 'admin') {
                // Not an admin, kick them back to their standard dashboard
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }

            // Valid admin
            return NextResponse.next();
        } catch (error) {
            // Invalid or expired token
            console.error('Session verification failed in middleware:', error);
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

// Config to run middleware only on relevant paths to keep edge overhead low
export const config = {
    matcher: [
        '/dashboard/admin/:path*',
        '/api/:path*'
    ],
};
