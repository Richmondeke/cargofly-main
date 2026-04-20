"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isPastHero, setIsPastHero] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
            // Rough estimate of where the white reveal section becomes dominant
            setIsPastHero(window.scrollY > window.innerHeight * 0.8);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className={`fixed top-0 left-0 right-0 ${mobileMenuOpen ? "z-[1001]" : "z-[60]"}`}>
            {/* Announcement Banner */}
            <div className="bg-[#020617] py-2.5 overflow-hidden whitespace-nowrap border-b border-white/5 relative group cursor-default">
                {/* Glossy overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent pointer-events-none" />

                <div className="flex animate-marquee-slow hover:pause">
                    <div className="flex items-center gap-12 px-8">
                        <div className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-white/90 font-black text-[10px] uppercase tracking-[0.25em]">Now Delivering to Ghana</span>
                        </div>
                        <span className="text-white/20 font-light text-xs">|</span>
                        <div className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            <span className="text-white/80 font-bold text-[10px] uppercase tracking-[0.25em]">Inter-island shipping throughout Hawai&apos;i</span>
                        </div>
                        <span className="text-white/20 font-light text-xs">|</span>
                        <div className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-300" />
                            <span className="text-white/80 font-bold text-[10px] uppercase tracking-[0.25em]">Exclusive Charters Available 24/7</span>
                        </div>
                        <span className="text-white/20 font-light text-xs">|</span>
                        <div className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-200" />
                            <span className="text-white/80 font-bold text-[10px] uppercase tracking-[0.25em]">Secure Logistics for Global Trade</span>
                        </div>
                    </div>

                    {/* Mirror for continuous flow */}
                    <div className="flex items-center gap-12 px-8" aria-hidden="true">
                        <div className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-white/90 font-black text-[10px] uppercase tracking-[0.25em]">Now Delivering to Ghana</span>
                        </div>
                        <span className="text-white/20 font-light text-xs">|</span>
                        <div className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            <span className="text-white/80 font-bold text-[10px] uppercase tracking-[0.25em]">Inter-island shipping throughout Hawai&apos;i</span>
                        </div>
                        <span className="text-white/20 font-light text-xs">|</span>
                        <div className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-300" />
                            <span className="text-white/80 font-bold text-[10px] uppercase tracking-[0.25em]">Exclusive Charters Available 24/7</span>
                        </div>
                        <span className="text-white/20 font-light text-xs">|</span>
                        <div className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-200" />
                            <span className="text-white/80 font-bold text-[10px] uppercase tracking-[0.25em]">Secure Logistics for Global Trade</span>
                        </div>
                    </div>
                </div>
                <style jsx>{`
                    .animate-marquee-slow {
                        display: flex;
                        width: max-content;
                        animation: marquee-slow 35s linear infinite;
                    }
                    .animate-marquee-slow:hover {
                        animation-play-state: paused;
                    }
                    @keyframes marquee-slow {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                `}</style>
            </div>


            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={`relative transition-all duration-300 ${mobileMenuOpen
                    ? "bg-[#020617] py-4 text-white"
                    : isPastHero || isScrolled
                        ? "bg-navy-900 shadow-premium py-4 text-white"
                        : "bg-navy-900/80 backdrop-blur-md py-6 text-white"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center">
                        <img
                            src="/logo-dark.png"
                            alt="Cargofly"
                            className="h-7 md:h-10 w-auto object-contain brightness-0 invert"
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <Link href="#detailed-services" className="hover:text-gold-500 transition-colors">Services</Link>
                        <Link href="#products" className="hover:text-gold-500 transition-colors">Solutions</Link>
                        <Link href="/track" className="hover:text-gold-500 transition-colors">Tracking</Link>
                        <Link href="/login" className="px-5 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 bg-white text-navy-900 font-bold hover:bg-gold-500 hover:text-white hover:shadow-glow-sm border border-navy-900/10">
                            Log In
                        </Link>
                    </nav>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden p-2 text-white hover:text-gold-500 transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                <motion.div
                    initial={false}
                    animate={mobileMenuOpen ? "open" : "closed"}
                    variants={{
                        open: { opacity: 1, height: "auto", display: "block" },
                        closed: { opacity: 0, height: 0, transitionEnd: { display: "none" } }
                    }}
                    className="md:hidden bg-[#020617] border-b border-white/10 px-6 py-8 absolute top-full left-0 right-0 shadow-2xl z-[1001]"
                >
                    <nav className="flex flex-col gap-6">
                        <Link
                            href="#detailed-services"
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-lg font-medium text-white/80 hover:text-gold-500 transition-colors"
                        >
                            Services
                        </Link>
                        <Link
                            href="#products"
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-lg font-medium text-white/80 hover:text-gold-500 transition-colors"
                        >
                            Solutions
                        </Link>
                        <Link
                            href="/track"
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-lg font-medium text-white/80 hover:text-gold-500 transition-colors"
                        >
                            Tracking
                        </Link>
                        <div className="pt-4 border-t border-white/5">
                            <Link
                                href="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-center w-full px-6 py-4 rounded-xl font-bold bg-gold-500 text-black hover:bg-white transition-colors"
                            >
                                Log In
                            </Link>
                        </div>
                    </nav>
                </motion.div>
            </motion.header>
        </div>
    );
}
