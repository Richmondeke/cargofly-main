"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Announcement, subscribeToAnnouncements } from '@/lib/announcement-service';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AnnouncementBannerProps {
    fallback?: React.ReactNode;
}

export function AnnouncementBanner({ fallback }: AnnouncementBannerProps) {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeToAnnouncements((data) => {
            const bannerAnnouncements = data
                .filter(ann => ann.type === 'banner' || ann.tag)
                .sort((a: any, b: any) => {
                    const orderDiff = (Number(a.order) || 0) - (Number(b.order) || 0);
                    if (orderDiff !== 0) return orderDiff;
                    const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
                    const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
                    return timeB - timeA;
                });
            setAnnouncements(bannerAnnouncements);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (announcements.length <= 1 || isHovered) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % announcements.length);
        }, 8000);

        return () => clearInterval(timer);
    }, [announcements.length, isHovered]);

    if (loading) {
        return (
            <div className="w-full h-[340px] bg-navy-900 rounded-2xl animate-pulse flex items-center justify-center">
                <div className="text-white/20 font-display">Loading announcements...</div>
            </div>
        );
    }

    if (announcements.length === 0) {
        return fallback || (
            <section className="relative overflow-hidden rounded-2xl bg-[#003399] p-10 sm:p-14 flex items-center justify-between group min-h-[340px]">
                <div
                    className="absolute inset-0 z-0 pointer-events-none bg-repeat opacity-100"
                    style={{
                        backgroundImage: "url('/Cargofly motif_transparent.png')",
                        backgroundSize: '300px'
                    }}
                />
                <div className="z-10 relative space-y-6 w-full sm:w-auto">
                    <span className="inline-block px-3 py-1 bg-gold-500 text-navy-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded">
                        Welcome
                    </span>
                    <h2 className="text-white text-4xl sm:text-5xl font-display font-medium leading-[1.1] tracking-tight">
                        Global Logistics, <br className="hidden sm:block" />
                        Redefined.
                    </h2>
                    <p className="text-white/80 max-w-md text-lg leading-relaxed">
                        Precision-engineered cargo flight operations for the world's most demanding enterprises.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link href="/dashboard/new-booking" className="w-full sm:w-auto">
                            <button className="w-full bg-gold-500 text-navy-900 px-10 py-4.5 rounded-2xl font-bold text-sm hover:brightness-110 transition-all shadow-2xl shadow-gold-500/30 active:scale-95 cursor-pointer">
                                Book a Shipment
                            </button>
                        </Link>
                    </div>
                </div>
                <div
                    className="absolute right-0 top-0 h-full w-1/3 sm:w-1/2 opacity-100 pointer-events-none transition-transform group-hover:scale-105 duration-700 z-10"
                    style={{
                        backgroundImage: "url('/Cargofly.jpg')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        maskImage: 'linear-gradient(to left, black 60%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to left, black 60%, transparent 100%)'
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#003399]/40 to-transparent" />
                </div>
            </section>
        );
    }

    const current = announcements[currentIndex];

    return (
        <section
            className="relative overflow-hidden rounded-2xl bg-[#003399] min-h-[340px] group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={current.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute inset-0 p-10 sm:p-14 flex items-center justify-between"
                >
                    {/* Motif Background Overlay */}
                    <div
                        className="absolute inset-0 z-0 pointer-events-none bg-repeat opacity-100"
                        style={{
                            backgroundImage: "url('/Cargofly motif_transparent.png')",
                            backgroundSize: '300px'
                        }}
                    />

                    <div className="z-20 relative space-y-5 w-full sm:w-auto">
                        {current.tag && (
                            <span className="inline-block px-3 py-1 bg-gold-500 text-navy-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded">
                                {current.tag}
                            </span>
                        )}
                        <div className="space-y-1">
                            <h2 className="text-white text-4xl sm:text-5xl font-display font-medium leading-[1.1] tracking-tight">
                                {current.title}
                            </h2>
                            <p className="text-white/80 max-w-lg text-lg leading-relaxed line-clamp-2 sm:line-clamp-none">
                                {current.content}
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            {current.link && (
                                <Link href={current.link} className="w-full sm:w-auto">
                                    <button className="w-full bg-gold-500 text-navy-900 px-8 py-3.5 rounded-xl font-bold text-sm hover:brightness-110 transition-all shadow-xl shadow-gold-500/20 active:scale-95 cursor-pointer whitespace-nowrap">
                                        {current.ctaText || "Learn More"}
                                    </button>
                                </Link>
                            )}
                            {current.secondaryLink && (
                                <Link href={current.secondaryLink} className="w-full sm:w-auto">
                                    <button className="w-full bg-white/10 backdrop-blur-xl text-white border border-white/20 px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-white/20 transition-all active:scale-95 cursor-pointer whitespace-nowrap">
                                        {current.secondaryCtaText || "Details"}
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>

                    <div
                        className="absolute right-0 top-0 h-full w-1/3 sm:w-1/2 opacity-100 pointer-events-none transition-transform group-hover:scale-105 duration-700 z-10"
                        style={{
                            backgroundImage: `url('${current.bgImage || '/Cargofly.jpg'}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            maskImage: 'linear-gradient(to left, black 60%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to left, black 60%, transparent 100%)'
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#003399]/40 to-transparent" />
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Pagination Controls */}
            {announcements.length > 1 && (
                <>
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                        {announcements.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex
                                    ? 'w-6 bg-gold-500'
                                    : 'w-1.5 bg-white/30 hover:bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>

                    <div className="absolute bottom-8 right-10 sm:right-14 z-30 flex gap-3">
                        <button
                            onClick={() => setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length)}
                            className="size-9 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white/20 transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setCurrentIndex((prev) => (prev + 1) % announcements.length)}
                            className="size-9 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white/20 transition-all"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </>
            )}
        </section>
    );
}
