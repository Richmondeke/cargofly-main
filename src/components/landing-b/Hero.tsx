"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, MapPin, Package, Plane } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Hero() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const router = useRouter();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'track' | 'book'>('track');

    // Form state
    const [trackingNumber, setTrackingNumber] = useState('');
    const [bookingData, setBookingData] = useState({
        origin: '',
        destination: '',
        cargoType: 'General Cargo'
    });

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.error("Autoplay was prevented:", error);
            });
        }
    }, []);

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        const cleanId = trackingNumber.trim();
        if (!cleanId) return;
        router.push(`/track?id=${encodeURIComponent(cleanId)}`);
    };

    const handleBook = (e: React.FormEvent) => {
        e.preventDefault();
        const query = new URLSearchParams({
            origin: bookingData.origin,
            destination: bookingData.destination,
            cargoType: bookingData.cargoType
        }).toString();

        const targetPath = `/dashboard/new-booking?${query}`;

        if (user) {
            router.push(targetPath);
        } else {
            router.push(`/login?redirect=${encodeURIComponent(targetPath)}`);
        }
    };

    return (
        <section className="relative min-h-screen flex flex-col bg-[#0a0a0a] text-white px-6 overflow-hidden">
            {/* Background Video */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="/images/illustrations/aircraft_hangar.jpg"
                    preload="auto"
                    className="absolute min-w-full min-h-full object-cover opacity-30"
                >
                    <source src="/cargofly-hero.mp4" type="video/mp4" />
                </video>
                {/* Overlay to ensure text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90 z-1" />
            </div>

            {/* Animated Dot Grid */}
            <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            <div className="flex-grow flex items-center justify-center pt-20">
                <div className="relative z-10 max-w-6xl mx-auto text-center">
                    <motion.h1
                        className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4 leading-[1.1]"
                        initial={{ opacity: 0, y: 60, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                            duration: 1.2,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        Global Logistics, <br className="hidden md:block" />
                        <span className="text-blue-600 relative inline-block">
                            Simplified.
                            <motion.span
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 1, duration: 0.8 }}
                                className="absolute -bottom-2 left-0 w-full h-1 bg-blue-600/30 origin-left rounded-full"
                            />
                        </span>
                    </motion.h1>

                    <motion.p
                        className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                    >
                        Track your shipments in real-time or book freight across oceans, skies, and roads with a single click.
                    </motion.p>

                    {/* Tracking & Booking Widget */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                        className="max-w-4xl mx-auto bg-black/40 backdrop-blur-2xl rounded-[32px] border border-white/10 p-4 md:p-6 shadow-2xl"
                    >
                        <div className="flex bg-white/5 backdrop-blur-md rounded-2xl p-1 relative overflow-hidden w-full md:w-fit mx-auto border border-white/10 mb-6">
                            <button
                                className={`flex-1 md:px-10 py-3 text-sm font-bold tracking-wide uppercase transition-all duration-300 rounded-xl flex items-center justify-center gap-2 ${activeTab === 'track' ? 'bg-navy-900 text-white shadow-lg border border-blue-600/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                onClick={() => setActiveTab('track')}
                            >
                                <Search className="w-4 h-4" />
                                <span>Track</span>
                            </button>
                            <button
                                className={`flex-1 md:px-10 py-3 text-sm font-bold tracking-wide uppercase transition-all duration-300 rounded-xl flex items-center justify-center gap-2 ${activeTab === 'book' ? 'bg-navy-900 text-white shadow-lg border border-blue-600/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                onClick={() => setActiveTab('book')}
                            >
                                <Plane className="w-4 h-4" />
                                <span>Book</span>
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {activeTab === 'track' ? (
                                <motion.div
                                    key="track"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="px-2"
                                >
                                    <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4 bg-white/5 p-2 rounded-[24px] border border-white/5">
                                        <div className="flex-grow relative flex items-center">
                                            <Search className="absolute left-6 text-gray-500 w-5 h-5" />
                                            <input
                                                className="w-full pl-14 pr-4 py-4 md:py-5 rounded-[20px] bg-transparent border-0 focus:ring-0 text-white text-lg placeholder:text-gray-500 outline-none"
                                                placeholder="Enter Tracking ID (e.g. CF-1234)"
                                                type="text"
                                                value={trackingNumber}
                                                onChange={(e) => setTrackingNumber(e.target.value)}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="bg-navy-900 text-white px-10 py-4 md:py-5 rounded-[20px] font-bold hover:bg-navy-800 transition-all flex items-center justify-center gap-2 shadow-lg border border-blue-600/30 hover:border-blue-600/50"
                                        >
                                            Track Now
                                            <ArrowRight className="w-5 h-5 text-blue-600" />
                                        </button>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="book"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                >
                                    <div className="relative">
                                        <input
                                            className="w-full p-4 pl-12 rounded-2xl bg-white/5 text-white border border-white/5 focus:border-gold-500/50 outline-none transition-all"
                                            placeholder="Origin"
                                            type="text"
                                            value={bookingData.origin}
                                            onChange={(e) => setBookingData(p => ({ ...p, origin: e.target.value }))}
                                        />
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    </div>
                                    <div className="relative">
                                        <input
                                            className="w-full p-4 pl-12 rounded-2xl bg-white/5 text-white border border-white/5 focus:border-gold-500/50 outline-none transition-all"
                                            placeholder="Destination"
                                            type="text"
                                            value={bookingData.destination}
                                            onChange={(e) => setBookingData(p => ({ ...p, destination: e.target.value }))}
                                        />
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    </div>
                                    <button
                                        onClick={handleBook}
                                        className="bg-navy-900 text-white py-4 rounded-2xl font-bold hover:bg-navy-800 transition-all shadow-lg border border-blue-600/30 hover:border-blue-600/50"
                                    >
                                        Check Rates
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>

            <motion.div
                className="w-full overflow-hidden whitespace-nowrap py-10 border-t border-white/5 bg-navy-950 z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
            >
                <div className="flex animate-marquee gap-24 items-center">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-24">
                            <img src="/logo-light.png" alt="Cargofly" className="h-6 md:h-8 w-auto object-contain brightness-0 invert opacity-20" />
                            <span className="text-sm font-bold tracking-widest opacity-20 uppercase flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                                premium air logistics
                            </span>
                        </div>
                    ))}
                </div>
            </motion.div>

            <style jsx global>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 40s linear infinite;
                    display: flex;
                    width: max-content;
                }
            `}</style>
        </section>
    );
}
