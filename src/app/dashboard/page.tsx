'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    getDashboardStats,
    getActiveShipments,
    seedInitialData,
    DashboardShipment,
    formatTimestamp,
} from '@/lib/dashboard-service';
import { ShipmentDetailsDrawer } from '@/components/dashboard/ShipmentDetailsDrawer';
import { Eye } from 'lucide-react';

// Modals
import QuoteModal from '@/components/dashboard/QuoteModal';
import TrackModal from '@/components/dashboard/TrackModal';
import ReportModal from '@/components/dashboard/ReportModal';

// Status icon helper
function getStatusIcon(status: string) {
    const s = status?.toLowerCase() || '';
    if (s.includes('transit')) return { icon: 'flight', bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600' };
    if (s.includes('processing') || s.includes('pending')) return { icon: 'box_edit', bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600' };
    if (s.includes('delivered') || s.includes('arrived')) return { icon: 'warehouse', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600' };
    if (s.includes('customs') || s.includes('hold')) return { icon: 'security', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600' };
    return { icon: 'local_shipping', bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600' };
}

export default function DashboardPage() {
    const { user, userProfile, loading: authLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [stats, setStats] = useState({ totalShipments: 0, inTransit: 0, delivered: 0, totalRevenue: 0, pending: 0 });
    const [shipments, setShipments] = useState<DashboardShipment[]>([]);

    // Drawer State
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedShipment, setSelectedShipment] = useState<DashboardShipment | null>(null);

    // Quick Action Modal States
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
    const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (authLoading || !user) return;

        async function loadDashboardData() {
            try {
                await seedInitialData();
                const [statsData, shipmentsData] = await Promise.all([
                    getDashboardStats(userProfile?.uid, userProfile?.role),
                    getActiveShipments(userProfile?.uid, userProfile?.role),
                ]);
                setStats(statsData);
                setShipments(shipmentsData);
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            } finally {
                setLoading(false);
            }
        }
        loadDashboardData();
    }, [authLoading, user]);

    const activeShipments = shipments.filter(s => {
        const st = s.status?.toLowerCase() || '';
        return st.includes('transit') || st.includes('processing') || st.includes('customs');
    });

    const recentBookings = shipments.slice(0, 4);

    return (
        <div className="flex-1 overflow-y-auto bg-[#F8FAFC] dark:bg-background-dark min-h-full">
            <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">

                {/* Announcement Banner */}
                <section className="relative overflow-hidden rounded-xl bg-slate-900 p-6 sm:p-8 flex items-center justify-between group">
                    <div className="z-10 relative space-y-3">
                        <span className="inline-block px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded">
                            Route Expansion
                        </span>
                        <h2 className="text-white text-2xl sm:text-3xl font-bold leading-tight">
                            New Route to Singapore <br className="hidden sm:block" />
                            Starting Next Month
                        </h2>
                        <p className="text-slate-300 max-w-md text-sm">
                            Book your cargo space early to take advantage of introductory low rates for our new daily service.
                        </p>
                        <div className="flex gap-3 pt-1 flex-wrap">
                            <Link href="/dashboard/new-booking">
                                <button className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/20">
                                    Book This Route
                                </button>
                            </Link>
                            <button className="bg-white/10 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-white/20 transition-all">
                                Learn More
                            </button>
                        </div>
                    </div>
                    <div
                        className="absolute right-0 top-0 h-full w-1/3 sm:w-2/5 opacity-20 pointer-events-none transition-transform group-hover:scale-105 duration-700"
                        style={{
                            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCj32WxKMQJJjPpeGLU41bKxnpgDqvVvH4DxU94dpj2u-QSOXOb9gIIpMEB7z0msS40fh5EnRzayghD3ChwBJe9nf4XDp7EVafYqL_aqT8k3TcP5batWJQvKvh9S8P9ExMPhbcv48N6ErQ2vyR_8dz8CwgI6BzbjwLOjnq8RdpPCzhlDqDUteub66JOuj0mmXCNrM_zWbbj7JLEC2TgGH63pKmvYjgL4HVwHMP1EQryzNajyDK1YxojNTBGclCFA9V6Wt2L1FmjTUmj')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                </section>

                {/* Quick Action Bar */}
                <section className="flex flex-wrap gap-3 items-center justify-between">
                    <div className="flex gap-3 flex-wrap">
                        <Link href="/dashboard/new-booking">
                            <button className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all text-sm">
                                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                                New Shipment
                            </button>
                        </Link>
                        <button 
                            onClick={() => setIsQuoteModalOpen(true)}
                            className="flex items-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-5 py-3 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm"
                        >
                            <span className="material-symbols-outlined text-[20px]">request_quote</span>
                            Request Quote
                        </button>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        <button 
                            onClick={() => setIsTrackModalOpen(true)}
                            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-semibold px-4 py-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-all text-sm"
                        >
                            <span className="material-symbols-outlined text-[20px]">track_changes</span>
                            Track Shipment
                        </button>
                        <button 
                            onClick={() => setIsReportModalOpen(true)}
                            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-semibold px-4 py-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-all text-sm"
                        >
                            <span className="material-symbols-outlined text-[20px]">download</span>
                            Download Report
                        </button>
                    </div>
                </section>

                {/* Stats Cards */}
                <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {/* Total Shipments */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Shipments</p>
                            <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">
                                {(!mounted || loading) ? <span className="animate-pulse text-slate-300">—</span> : stats.totalShipments}
                                <span className="text-sm font-normal text-slate-400 ml-1">All time</span>
                            </h3>
                            <div className="mt-2 flex items-center text-emerald-500 text-xs font-bold">
                                <span className="material-symbols-outlined text-base">trending_up</span>
                                <span className="ml-1">Active network</span>
                            </div>
                        </div>
                        <div className="size-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600">
                            <span className="material-symbols-outlined text-3xl">weight</span>
                        </div>
                    </div>

                    {/* In Transit */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Shipments</p>
                            <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">
                                {(!mounted || loading) ? <span className="animate-pulse text-slate-300">—</span> : stats.inTransit}
                                <span className="text-sm font-normal text-slate-400 ml-1">In Transit</span>
                            </h3>
                            <div className="mt-2 flex items-center text-primary text-xs font-bold">
                                <span className="material-symbols-outlined text-base">schedule</span>
                                <span className="ml-1">Real-time tracking</span>
                            </div>
                        </div>
                        <div className="size-14 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-3xl">local_shipping</span>
                        </div>
                    </div>

                    {/* Pending / Quotes */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending</p>
                            <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">
                                {(!mounted || loading) ? <span className="animate-pulse text-slate-300">—</span> : ((stats as any).pending || 0)}
                                <span className="text-sm font-normal text-slate-400 ml-1">Awaiting Action</span>
                            </h3>
                            <div className="mt-2 flex items-center text-slate-400 text-xs font-bold">
                                <span className="material-symbols-outlined text-base">pending</span>
                                <span className="ml-1">Needs attention</span>
                            </div>
                        </div>
                        <div className="size-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-600 dark:text-slate-300">
                            <span className="material-symbols-outlined text-3xl">request_quote</span>
                        </div>
                    </div>
                </section>

                {/* Data Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Active Shipments List */}
                    <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Active Shipments</h3>
                            <Link href="/dashboard/shipments" className="text-primary text-sm font-semibold hover:underline">
                                View All
                            </Link>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {loading ? (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="p-5 flex items-center gap-4">
                                            <div className="size-10 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
                                            <div className="flex-1 space-y-2">
                                                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-1/2" />
                                                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-3/4" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : activeShipments.length > 0 ? (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {activeShipments.slice(0, 5).map(s => {
                                        const statusStyle = getStatusIcon(s.status);
                                        return (
                                            <div
                                                key={s.id}
                                                className="p-5 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                                                onClick={() => { setSelectedShipment(s); setIsDrawerOpen(true); }}
                                            >
                                                <div className={`size-10 ${statusStyle.bg} ${statusStyle.text} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                                    <span className="material-symbols-outlined text-[20px]">{statusStyle.icon}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <p className="text-sm font-bold truncate text-slate-900 dark:text-white">
                                                            {s.trackingNumber || s.id}
                                                        </p>
                                                        <StatusBadge status={s.status} />
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                                                        <span className="font-semibold">{s.origin}</span>
                                                        <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                                                        <span className="font-semibold">{s.destination}</span>
                                                        <span className="mx-1">•</span>
                                                        <span>ETA: {s.eta || 'TBD'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-10 text-center text-slate-400 text-sm">
                                    <span className="material-symbols-outlined text-4xl block mb-2 opacity-40">local_shipping</span>
                                    No active shipments at the moment.
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Recent Bookings Table */}
                    <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Recent Bookings</h3>
                            <Link href="/dashboard/shipments">
                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                    <span className="material-symbols-outlined text-slate-500">filter_list</span>
                                </button>
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Booking ID</th>
                                        <th className="px-6 py-4">Route</th>
                                        <th className="px-6 py-4">Weight</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-800">
                                    {loading ? (
                                        [1, 2, 3, 4].map(i => (
                                            <tr key={i}>
                                                <td colSpan={4} className="px-6 py-4">
                                                    <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                                                </td>
                                            </tr>
                                        ))
                                    ) : recentBookings.length > 0 ? (
                                        recentBookings.map(s => (
                                            <tr
                                                key={s.id}
                                                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                                                onClick={() => { setSelectedShipment(s); setIsDrawerOpen(true); }}
                                            >
                                                <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                                                    {s.trackingNumber ? s.trackingNumber.slice(0, 12) : s.id.slice(0, 8)}
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                                    {s.origin} → {s.destination}
                                                </td>
                                                <td className="px-6 py-4 text-slate-500">
                                                    {s.weight || '—'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <StatusBadge status={s.status} />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-10 text-center text-slate-400 text-sm">
                                                No bookings yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
            </div>

            <ShipmentDetailsDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                shipment={selectedShipment}
            />

            {/* Quick Action Modals */}
            <QuoteModal 
                isOpen={isQuoteModalOpen} 
                onClose={() => setIsQuoteModalOpen(false)} 
            />
            <TrackModal 
                isOpen={isTrackModalOpen} 
                onClose={() => setIsTrackModalOpen(false)} 
            />
            <ReportModal 
                isOpen={isReportModalOpen} 
                onClose={() => setIsReportModalOpen(false)} 
            />
        </div>
        </div>
    );
}
