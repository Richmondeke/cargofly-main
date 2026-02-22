'use client';

import React from 'react';

/**
 * Animated loading screen with Cargofly logo
 * Beautiful liquid loading loop with smooth ease-in-out animation
 */
export default function LoadingAnimation() {
    return (
        <div className="fixed inset-0 bg-primary flex items-center justify-center z-50">
            {/* Animation Container */}
            <div className="relative flex flex-col items-center">

                {/* Logo with liquid animation */}
                <div className="logo-liquid">
                    <img
                        src="/logo-dark.png"
                        alt="Cargofly"
                        className="h-14 md:h-20 w-auto"
                    />
                </div>

                {/* Animated glow ring */}
                <div className="glow-ring" />

                {/* Loading dots */}
                <div className="flex gap-1.5 mt-8">
                    <div className="dot dot-1" />
                    <div className="dot dot-2" />
                    <div className="dot dot-3" />
                </div>
            </div>

            {/* CSS Animations */}
            <style jsx>{`
                /* Logo liquid breathing animation */
                .logo-liquid {
                    animation: liquidBreath 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                    filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
                }
                
                @keyframes liquidBreath {
                    0%, 100% {
                        transform: scale(1) translateY(0);
                        filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
                    }
                    25% {
                        transform: scale(1.03) translateY(-2px);
                        filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.5));
                    }
                    50% {
                        transform: scale(1.06) translateY(-4px);
                        filter: drop-shadow(0 0 40px rgba(255, 255, 255, 0.6));
                    }
                    75% {
                        transform: scale(1.03) translateY(-2px);
                        filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.5));
                    }
                }

                /* Expanding glow ring */
                .glow-ring {
                    position: absolute;
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    border: 2px solid rgba(255, 255, 255, 0.2);
                    animation: ringPulse 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }
                
                @keyframes ringPulse {
                    0% {
                        transform: scale(0.8);
                        opacity: 0.8;
                        border-color: rgba(255, 255, 255, 0.4);
                    }
                    50% {
                        transform: scale(1.5);
                        opacity: 0;
                        border-color: rgba(255, 255, 255, 0);
                    }
                    100% {
                        transform: scale(0.8);
                        opacity: 0;
                        border-color: rgba(255, 255, 255, 0);
                    }
                }

                /* Loading dots */
                .dot {
                    width: 8px;
                    height: 8px;
                    background: rgba(255, 255, 255, 0.7);
                    border-radius: 50%;
                    animation: dotPulse 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }
                
                .dot-1 { animation-delay: 0s; }
                .dot-2 { animation-delay: 0.15s; }
                .dot-3 { animation-delay: 0.3s; }
                
                @keyframes dotPulse {
                    0%, 80%, 100% {
                        transform: scale(0.6);
                        opacity: 0.4;
                    }
                    40% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
}
