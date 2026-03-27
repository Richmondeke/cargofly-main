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
        <div className="relative z-20 w-full max-w-3xl mx-auto px-4 sm:px-0">
            {/* Tabs Container - Floats above the main box */}
            <div className="flex bg-navy-900 rounded-2xl p-1 relative overflow-hidden w-fit mx-auto shadow-2xl border border-navy-700 mb-4">
                <button
                    onClick={() => setActiveTab('track')}
                    className={cn(
                        "relative px-8 py-2 text-sm font-bold tracking-wide transition-all duration-300 z-10 min-w-[140px] rounded-xl",
                        activeTab === 'track'
                            ? "text-[#003399] bg-white shadow-lg"
                            : "text-white/80 hover:text-white hover:bg-white/5"
                    )}
                >
                    Track
                </button>
                <button
                    onClick={() => setActiveTab('book')}
                    className={cn(
                        "relative px-8 py-2 text-sm font-bold tracking-wide transition-all duration-300 z-10 min-w-[140px] rounded-xl",
                        activeTab === 'book'
                            ? "text-[#003399] bg-white shadow-lg"
                            : "text-white/80 hover:text-white hover:bg-white/5"
                    )}
                >
                    Book
                </button>
            </div >

            {/* Main Widget Body - Glow Wrapper */}
            <div className="relative rounded-[26px] p-[2px] overflow-hidden group w-full">
                {/* Animated light effect */}
                <div className="absolute inset-0 bg-navy-900" />

                {/* Main Widget Body - Glass Box */}
                <motion.div
                    layout
                    className="bg-navy-900 rounded-[24px] shadow-2xl relative overflow-hidden border border-navy-700 p-2 lg:p-2 z-10 w-full"
                >
                    <div className="w-full">
                        <AnimatePresence mode="wait">
                            {activeTab === 'track' ? (
                                <motion.div
                                    key="track"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-center w-full"
                                >
                                    <div className="flex-1 flex items-center w-full">
                                        {/* Main input container */}
                                        <div className="relative z-10 flex items-center w-full bg-white rounded-[20px] shadow-inner pl-6 md:pl-8 pr-2 py-2">
                                            <input
                                                type="text"
                                                value={trackingNumber}
                                                onChange={(e) => setTrackingNumber(e.target.value)}
                                                placeholder="Enter Tracking ID (e.g. CF-12345)"
                                                className="w-full bg-transparent border-none px-0 py-3 md:py-4 text-slate-800 placeholder:text-slate-400 focus:ring-0 font-mono text-base md:text-lg focus:outline-none"
                                            />
                                            <button
                                                onClick={handleTrack}
                                                className="bg-[#FFCA00] text-black px-8 py-3 md:py-4 rounded-[14px] font-extrabold text-sm tracking-wide flex items-center gap-2 hover:bg-[#FFCA00]/90 transition-all shadow-md active:scale-95 flex-shrink-0"
                                            >
                                                <span className="hidden sm:inline">Track</span>
                                                <ArrowRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="book"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-center justify-between w-full bg-white rounded-[20px] overflow-hidden shadow-inner pl-6 md:pl-8 pr-2 py-2"
                                >
                                    <div className="flex-1">
                                        <p className="text-slate-700 font-semibold text-sm md:text-base hidden sm:block">
                                            Ready to move your cargo globally?
                                        </p>
                                        <p className="text-slate-700 font-semibold text-sm sm:hidden">
                                            Ship with Cargofly
                                        </p>
                                    </div>

                                    <Link href="/ship" className="flex-shrink-0">
                                        <button className="bg-[#FFCA00] text-black px-8 py-3 md:py-4 rounded-[14px] font-extrabold text-sm tracking-wide flex items-center gap-2 hover:bg-[#FFCA00]/90 transition-all shadow-md active:scale-95">
                                            <span className="hidden sm:inline">Get Quote</span>
                                            <span className="sm:hidden">Start</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div >
    );
}
