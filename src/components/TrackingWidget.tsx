"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Package, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrackingWidgetProps {
    variant?: "hero" | "page";
    onTrack?: (trackingNumber: string) => void;
}

export default function TrackingWidget({
    variant = "hero",
    onTrack,
}: TrackingWidgetProps) {
    const [trackingNumber, setTrackingNumber] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const validateTracking = (value: string): boolean => {
        // Basic validation - alphanumeric, 8-20 characters
        const pattern = /^[A-Za-z0-9-]{8,20}$/;
        return pattern.test(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const trimmed = trackingNumber.trim();
        if (!trimmed) {
            setError("Please enter a tracking number");
            return;
        }

        if (!validateTracking(trimmed)) {
            setError("Invalid tracking number format");
            return;
        }

        setIsLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        setIsLoading(false);

        if (onTrack) {
            onTrack(trimmed);
        } else {
            window.location.href = `/track?id=${encodeURIComponent(trimmed)}`;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div
                className={cn(
                    "relative",
                    variant === "page" && "max-w-2xl mx-auto"
                )}
            >
                <div className="relative flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Package
                            className={cn(
                                "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5",
                                error ? "text-red-400" : "text-gold-500/70"
                            )}
                        />
                        <input
                            type="text"
                            value={trackingNumber}
                            onChange={(e) => {
                                setTrackingNumber(e.target.value.toUpperCase());
                                if (error) setError("");
                            }}
                            placeholder="Enter tracking number (e.g., CF-2025-8473629)"
                            className={cn(
                                "w-full bg-white/5 border rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none transition-all font-body font-mono",
                                error
                                    ? "border-red-500/50 focus:border-red-500"
                                    : "border-white/10 focus:border-gold-500/50"
                            )}
                            maxLength={20}
                            aria-label="Tracking number"
                            aria-invalid={!!error}
                            aria-describedby={error ? "tracking-error" : undefined}
                        />
                    </div>

                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                            "px-8 py-4 rounded-xl bg-gold-500 text-navy-900 font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(202,138,4,0.3)]",
                            variant === "page" && "sm:w-auto w-full"
                        )}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Tracking...</span>
                            </>
                        ) : (
                            <>
                                <Search className="w-5 h-5" />
                                <span>Track</span>
                            </>
                        )}
                    </motion.button>
                </div>

                {/* Error Message */}
                {error && (
                    <motion.p
                        id="tracking-error"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-red-400 font-body"
                        role="alert"
                    >
                        {error}
                    </motion.p>
                )}

                {/* Help Text */}
                {variant === "page" && !error && (
                    <p className="mt-3 text-center text-sm text-white/40 font-body">
                        Track your shipment in real-time with GPS accuracy
                    </p>
                )}
            </div>
        </form>
    );
}
