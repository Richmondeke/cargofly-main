"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HeroWidget() {
    const [activeTab, setActiveTab] = useState<'book' | 'track'>('track');
    const [trackingNumber, setTrackingNumber] = useState("");

    const handleTrack = () => {
        if (trackingNumber.trim()) {
            window.location.href = `/track?id=${encodeURIComponent(trackingNumber)}`;
        }
    };

    return (
        <div className="relative z-20 w-[567px] h-[249px] mx-auto">
            {/* Tabs Container */}
            <div className="flex justify-center mb-[-1px] relative z-20">
                <div className="flex bg-[#001f5c]/40 backdrop-blur-md rounded-t-2xl p-1 gap-1 relative overflow-hidden">

                    {/* Book Shipment Tab */}
                    <button
                        onClick={() => setActiveTab('book')}
                        className={cn(
                            "relative px-6 py-3 text-sm font-semibold transition-all duration-300 z-10 min-w-[140px] rounded-t-xl",
                            activeTab === 'book' ? "text-[#003399] bg-white shadow-sm" : "text-white/80 hover:text-white hover:bg-white/10"
                        )}
                    >
                        <span className="relative z-20">Book Shipment</span>
                    </button>

                    {/* Track Shipment Tab */}
                    <button
                        onClick={() => setActiveTab('track')}
                        className={cn(
                            "relative px-6 py-3 text-sm font-semibold transition-all duration-300 z-10 min-w-[140px] rounded-t-xl",
                            activeTab === 'track' ? "text-[#003399] bg-white shadow-sm" : "text-white/80 hover:text-white hover:bg-white/10"
                        )}
                    >
                        <span className="relative z-20">Track Shipment</span>
                    </button>
                </div>
            </div>

            {/* Main Widget Body */}
            <motion.div
                layout
                className="bg-white rounded-3xl shadow-2xl relative h-full flex items-center justify-center overflow-hidden border border-white/20"
            >
                <div className="w-full px-spacing-07 py-spacing-06">
                    <AnimatePresence mode="wait">
                        {activeTab === 'track' ? (
                            <motion.div
                                key="track"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col items-center w-full"
                            >
                                <div className="w-full max-w-lg mb-spacing-06">
                                    <label className="block text-sm font-bold text-slate-700 mb-spacing-03 px-1">
                                        Enter Tracking ID
                                    </label>
                                    <div className="bg-slate-50 rounded-2xl p-spacing-02">
                                        <input
                                            type="text"
                                            value={trackingNumber}
                                            onChange={(e) => setTrackingNumber(e.target.value)}
                                            placeholder="CF-10222345555"
                                            className="w-full bg-transparent border-none px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:ring-0 font-mono text-base"
                                        />
                                    </div>
                                </div>

                                {/* Floating Action Button */}
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                                    <button
                                        onClick={handleTrack}
                                        className="bg-[#003399] text-white px-12 py-3.5 rounded-2xl font-semibold text-base flex items-center gap-3 hover:bg-[#00287a] hover:-translate-y-0.5 transition-all shadow-lg hover:shadow-xl"
                                    >
                                        Proceed
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="book"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col items-center w-full text-center"
                            >
                                <h3 className="text-2xl font-bold text-[#003399] mb-2">Ready to ship?</h3>
                                <p className="text-slate-500 mb-8 max-w-sm mx-auto text-sm">
                                    Get instant quotes, schedule pickups, and manage your shipments seamlessly.
                                </p>

                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                                    <Link href="/ship">
                                        <button className="bg-[#003399] text-white px-12 py-3.5 rounded-2xl font-semibold text-base flex items-center gap-3 hover:bg-[#00287a] hover:-translate-y-0.5 transition-all shadow-lg hover:shadow-xl">
                                            Start Booking
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Need Help Bubble - Removed per user request */}
            </motion.div>
        </div>
    );
}
