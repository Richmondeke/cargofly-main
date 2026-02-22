'use client';

import React, { useEffect, useState } from 'react';
import { getLocations, getRoutes, Location, Route } from '@/lib/dashboard-service';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';

const NetworkMap = dynamic(() => import('@/components/dashboard/NetworkMap'), {
    ssr: false,
    loading: () => (
        <div className="h-96 bg-slate-100 dark:bg-navy-800 animate-pulse flex items-center justify-center rounded-2xl">
            <span className="text-slate-400 dark:text-slate-500">Loading Global Network...</span>
        </div>
    ),
});

export default function PublicNetworkMap() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [routes, setRoutes] = useState<Route[]>([]);

    useEffect(() => {
        async function loadData() {
            try {
                const [locData, routeData] = await Promise.all([
                    getLocations(),
                    getRoutes(),
                ]);
                setLocations(locData);
                setRoutes(routeData);
            } catch (error) {
                console.error('Error loading network data:', error);
            }
        }
        loadData();
    }, []);

    return (
        <section className="relative py-spacing-12 bg-white dark:bg-navy-900 transition-colors duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-50 via-transparent to-transparent dark:from-navy-800/50 dark:via-transparent dark:to-transparent" />

            <div className="container mx-auto px-spacing-06 relative z-10">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="text-center mb-spacing-10"
                >
                    <span className="inline-block py-spacing-01 px-spacing-04 rounded-full bg-gold-500/10 text-gold-400 text-xs font-bold tracking-[0.2em] uppercase mb-spacing-06 font-body">
                        Global Reach
                    </span>
                    <h2 className="font-display text-4xl md:text-5xl text-navy-900 dark:text-white mb-spacing-05">
                        Our Worldwide
                        <span className="block italic text-navy-900/80 dark:text-white/80">Network</span>
                    </h2>
                    <p className="text-navy-900/60 dark:text-white/60 max-w-2xl mx-auto font-body">
                        Connecting key global hubs with reliable, scheduled air and sea freight routes.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="bg-white dark:bg-navy-800/50 rounded-2xl border border-slate-200 dark:border-white/5 shadow-xl overflow-hidden relative z-0"
                >
                    <div className="h-[500px] w-full">
                        <NetworkMap locations={locations} routes={routes} />
                    </div>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-spacing-07 mt-spacing-09 text-center">
                    <div>
                        <div className="text-3xl font-display text-gold-500 mb-1">{locations.length}+</div>
                        <div className="text-sm text-navy-900/60 dark:text-white/60">Active Hubs</div>
                    </div>
                    <div>
                        <div className="text-3xl font-display text-gold-500 mb-1">{routes.length}+</div>
                        <div className="text-sm text-navy-900/60 dark:text-white/60">Direct Routes</div>
                    </div>
                    <div>
                        <div className="text-3xl font-display text-gold-500 mb-1">{new Set(locations.map(l => l.country)).size}+</div>
                        <div className="text-sm text-navy-900/60 dark:text-white/60">Countries</div>
                    </div>
                    <div>
                        <div className="text-3xl font-display text-gold-500 mb-1">24/7</div>
                        <div className="text-sm text-navy-900/60 dark:text-white/60">Operations</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
