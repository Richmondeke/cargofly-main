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
        <div className="fixed top-0 left-0 right-0 z-[60]">
            {/* Announcement Banner */}
            <div className="bg-white py-1.5 overflow-hidden whitespace-nowrap border-b border-navy-900/10 relative">
                <div className="flex animate-marquee-slow">
                    <div className="flex items-center gap-16 px-8">
                        <span className="text-navy-900 font-bold text-xs uppercase tracking-widest">Now Delivering to Ghana</span>
                        <span className="text-navy-900/60 font-medium text-[10px]">•</span>
                        <span className="text-navy-900 font-bold text-xs uppercase tracking-widest">Inter-island shipping throughout Hawai'i</span>
                        <span className="text-navy-900/60 font-medium text-[10px]">•</span>
                        <span className="text-navy-900 font-bold text-xs uppercase tracking-widest">Exclusive Charters Available 24/7</span>
                        <span className="text-navy-900/60 font-medium text-[10px]">•</span>
                        <span className="text-navy-900 font-bold text-xs uppercase tracking-widest">Secure Logistics Solutions for Global Trade</span>
                    </div>
                    <div className="flex items-center gap-16 px-8" aria-hidden="true">
                        <span className="text-navy-900 font-bold text-xs uppercase tracking-widest">Now Delivering to Ghana</span>
                        <span className="text-navy-900/60 font-medium text-[10px]">•</span>
                        <span className="text-navy-900 font-bold text-xs uppercase tracking-widest">Inter-island shipping throughout Hawai'i</span>
                        <span className="text-navy-900/60 font-medium text-[10px]">•</span>
                        <span className="text-navy-900 font-bold text-xs uppercase tracking-widest">Exclusive Charters Available 24/7</span>
                        <span className="text-navy-900/60 font-medium text-[10px]">•</span>
                        <span className="text-navy-900 font-bold text-xs uppercase tracking-widest">Secure Logistics Solutions for Global Trade</span>
                    </div>
                </div>
                <style jsx>{`
                    .animate-marquee-slow {
                        display: flex;
                        width: max-content;
                        animation: marquee-slow 40s linear infinite;
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
                className={`relative transition-all duration-300 ${isPastHero || isScrolled
                    ? "bg-navy-900 shadow-premium py-4 text-white"
                    : "bg-navy-900/80 backdrop-blur-md py-6 text-white"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center">
                        <img
                            src="/logo-dark.png"
                            alt="Cargofly"
                            className="h-8 w-auto object-contain"
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <Link href="#detailed-services" className="hover:text-blue-600 transition-colors">Services</Link>
                        <Link href="#products" className="hover:text-blue-600 transition-colors">Solutions</Link>
                        <Link href="/track" className="hover:text-blue-600 transition-colors">Tracking</Link>
                        <Link href="/login" className="px-5 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 bg-white text-navy-900 font-bold hover:bg-blue-600 hover:text-white hover:shadow-glow-sm border border-navy-900/10">
                            Log In
                        </Link>
                    </nav>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Nav */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="md:hidden bg-navy-900 border-b border-white/10 px-6 py-6 absolute top-full left-0 right-0"
                    >
                        <nav className="flex flex-col gap-6 text-lg text-white">
                            <Link href="#detailed-services" onClick={() => setMobileMenuOpen(false)}>Services</Link>
                            <Link href="#products" onClick={() => setMobileMenuOpen(false)}>Solutions</Link>
                            <Link href="/track" onClick={() => setMobileMenuOpen(false)}>Tracking</Link>
                            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="inline-block px-6 py-3 text-center rounded-full font-bold bg-white text-navy-900 hover:bg-blue-600 hover:text-white">
                                Log In
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </motion.header>
        </div>
    );
}
