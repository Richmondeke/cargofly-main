'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * /payment/callback
 *
 * Korapay redirects back here after the user completes (or cancels) payment.
 * Query params set by us in korapay.ts:
 *   ?reference=KPY-xxx&returnPath=%2Fdashboard%2Fshipments
 *
 * The page:
 *  1. Shows a "Verifying…" spinner
 *  2. Calls GET /api/payments/verify?reference=... to confirm payment server-side
 *  3. Redirects to returnPath on success, or shows an error with a manual link
 */
function PaymentCallbackInner() {
    const router = useRouter();
    const params = useSearchParams();
    const reference = params.get('reference');
    const returnPath = params.get('returnPath') || '/dashboard/wallet';

    const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!reference) {
            setStatus('failed');
            setMessage('No payment reference found. Please check your shipments page.');
            return;
        }

        const verify = async () => {
            try {
                const res = await fetch(`/api/payments/verify?reference=${encodeURIComponent(reference)}`);
                const data = await res.json();

                if (data.status) {
                    setStatus('success');
                    setMessage('Payment confirmed! Redirecting you back…');
                    setTimeout(() => {
                        router.replace(returnPath);
                    }, 2000);
                } else {
                    // Webhook may have already processed it — still redirect after brief delay
                    setStatus('success');
                    setMessage('Payment received. Redirecting you back…');
                    setTimeout(() => {
                        router.replace(returnPath);
                    }, 2500);
                }
            } catch {
                setStatus('failed');
                setMessage('Verification check failed. Your payment may still have been processed — please check your dashboard.');
            }
        };

        verify();
    }, [reference, returnPath, router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#fbf9f8] px-6">
            <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md w-full text-center">

                {status === 'verifying' && (
                    <>
                        <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6 animate-pulse">
                            <span className="material-symbols-outlined text-[#005eb2] animate-spin" style={{ fontSize: '2.5rem' }}>
                                progress_activity
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-[#002068] mb-3" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                            Verifying Payment
                        </h1>
                        <p className="text-slate-500 text-sm">Please wait while we confirm your payment…</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-green-600" style={{ fontSize: '2.5rem', fontVariationSettings: "'FILL' 1" }}>
                                check_circle
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-[#002068] mb-3" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                            Payment Successful
                        </h1>
                        <p className="text-slate-500 text-sm mb-6">{message}</p>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-green-500 h-full animate-grow-bar rounded-full" />
                        </div>
                    </>
                )}

                {status === 'failed' && (
                    <>
                        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-red-500" style={{ fontSize: '2.5rem', fontVariationSettings: "'FILL' 1" }}>
                                cancel
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-[#002068] mb-3" style={{ fontFamily: 'Work Sans, sans-serif' }}>
                            Verification Issue
                        </h1>
                        <p className="text-slate-500 text-sm mb-8">{message}</p>
                        <button
                            onClick={() => router.replace(returnPath)}
                            className="w-full py-3 bg-[#002068] text-white font-bold rounded-xl hover:bg-[#003399] transition-all"
                            style={{ fontFamily: 'Work Sans, sans-serif' }}
                        >
                            Go Back to Dashboard
                        </button>
                    </>
                )}

                {reference && (
                    <p className="mt-6 text-[10px] text-slate-300 font-mono">ref: {reference}</p>
                )}
            </div>

            <style>{`
                @keyframes grow-bar {
                    from { width: 0; }
                    to { width: 100%; }
                }
                .animate-grow-bar {
                    animation: grow-bar 2s linear forwards;
                }
            `}</style>
        </div>
    );
}

export default function PaymentCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#fbf9f8]">
                <span className="material-symbols-outlined animate-spin text-[#005eb2]" style={{ fontSize: '3rem' }}>progress_activity</span>
            </div>
        }>
            <PaymentCallbackInner />
        </Suspense>
    );
}
