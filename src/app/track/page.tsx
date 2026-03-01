"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
    Package,
    Plane,
    Info,
    Share2,
    Printer,
    Search,
} from "lucide-react";
import TrackingTimeline, { TrackingEvent as UITrackingEvent } from "@/components/TrackingTimeline";
import FlightPath from "@/components/FlightPath";
import {
    getShipmentByTracking,
    getTrackingEvents,
    Shipment,
    getStatusDisplay,
    formatTimestamp
} from "@/lib/firestore";

function TrackPageContent() {
    const searchParams = useSearchParams();
    const [trackingId, setTrackingId] = useState<string | null>(null);
    const [shipment, setShipment] = useState<Shipment | null>(null);
    const [events, setEvents] = useState<UITrackingEvent[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const id = searchParams.get("id");
        if (id) {
            setTrackingId(id);
        }
    }, [searchParams]);

    useEffect(() => {
        async function fetchData() {
            if (!trackingId) return;

            setLoading(true);
            setError("");
            try {
                // 1. Get Shipment First
                const shipmentData = await getShipmentByTracking(trackingId);

                if (shipmentData && shipmentData.id) {
                    // 2. Then Get Events using the Document ID
                    const eventsData = await getTrackingEvents(shipmentData.id);

                    setShipment(shipmentData);

                    // Convert Firestore events to UI events
                    // Firestore returns Descending (Newest First). 
                    // We reverse to show Chronological (Oldest First) to match Timeline flow.
                    const flowEvents = eventsData.reverse().map((e: unknown) => ({
                        id: e.id,
                        status: getStatusDisplay(e.status) || e.status,
                        location: e.location,
                        timestamp: formatTimestamp(e.timestamp),
                        description: e.description,
                        isCompleted: true // Past events are completed
                    }));
                    setEvents(flowEvents);
                } else {
                    setError("Shipment not found. Please check the tracking number.");
                    setShipment(null);
                    setEvents([]);
                }
            } catch (err) {
                console.error("Error fetching shipment:", err);
                // Show specific error if available, otherwise generic
                const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
                setError(`Failed to load shipment: ${errorMessage}`);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [trackingId]);

    const handleCopy = async () => {
        if (trackingId) {
            await navigator.clipboard.writeText(trackingId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const getProgress = (status: string) => {
        switch (status) {
            case "pending": return 10;
            case "processing": return 25;
            case "pickup": return 40;
            case "in_transit": return 60;
            case "customs": return 75;
            case "out_for_delivery": return 90;
            case "delivered": return 100;
            case "cancelled": return 0;
            case "returned": return 100;
            default: return 0;
        }
    };

    const formatDate = (timestamp: unknown) => {
        if (!timestamp) return "Pending";
        // Handle Firestore Timestamp or Date
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        }).format(date);
    };

    return (
        <div className="min-h-screen pt-32 pb-24 bg-white dark:bg-navy-900 transition-colors duration-500">
            {/* Background */}
            <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-100 via-white to-gray-50 dark:from-navy-800 dark:via-navy-900 dark:to-black" />
            <div className="fixed inset-0 z-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] dark:invert" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex-1 max-w-2xl">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-gold-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Track another Shipment ID (e.g. CF-8829341029)"
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-navy-800/50 border border-gray-200 dark:border-navy-700 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all text-navy-900 dark:text-white font-body"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            const val = (e.target as HTMLInputElement).value;
                                            if (val) setTrackingId(val);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-navy-800 border border-gray-200 dark:border-navy-700 text-navy-900 dark:text-white hover:bg-gray-200 dark:hover:bg-navy-700 transition-colors text-sm font-bold font-body">
                                <Share2 className="w-4 h-4" />
                                Share
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-900 dark:bg-gold-500 text-white dark:text-navy-900 hover:bg-navy-800 dark:hover:bg-gold-400 transition-colors text-sm font-bold font-body">
                                <Printer className="w-4 h-4" />
                                Print
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Shipment Info Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-12"
                >
                    <h1 className="font-display text-4xl text-navy-900 dark:text-white mb-2">
                        Shipment Tracking
                    </h1>
                    <div className="flex items-center gap-2 text-navy-900/60 dark:text-white/60 font-body">
                        <span>Tracking ID:</span>
                        <span className="text-navy-900 dark:text-white font-bold">{trackingId || "---"}</span>
                    </div>
                </motion.div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-white/60 font-body">Locating shipment...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 bg-red-500/10 rounded-xl border border-red-500/20 max-w-2xl mx-auto"
                    >
                        <Info className="w-8 h-8 text-red-500 mx-auto mb-4" />
                        <p className="text-red-200 font-body">{error}</p>
                    </motion.div>
                )}

                {/* Results */}
                {shipment && !loading && (
                    <div className="grid lg:grid-cols-12 gap-8 items-start">
                        {/* Left Column: Timeline */}
                        <div className="lg:col-span-4 lg:sticky lg:top-32">
                            <div className="bg-white dark:bg-navy-800/50 rounded-3xl p-8 border border-gray-100 dark:border-navy-700">
                                <h3 className="font-display text-xl text-navy-900 dark:text-white mb-8">
                                    Status Timeline
                                </h3>
                                <TrackingTimeline
                                    events={events}
                                    currentStatus={getStatusDisplay(shipment.status as unknown) || shipment.status}
                                />
                            </div>
                        </div>

                        {/* Right Column: Details & Map */}
                        <div className="lg:col-span-8 space-y-8">
                            {/* Cargo Info Card */}
                            <div className="bg-navy-900 rounded-3xl overflow-hidden text-white shadow-2xl">
                                <div className="bg-navy-800/50 px-8 py-4 border-b border-white/5 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Cargo Information</p>
                                        <h3 className="font-display text-xl">Shipment Details</h3>
                                    </div>
                                    <Package className="w-5 h-5 text-gold-500" />
                                </div>
                                <div className="p-8">
                                    <div className="grid md:grid-cols-2 gap-y-10 gap-x-12 mb-10">
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Origin</p>
                                            <p className="text-lg font-display">{shipment.sender.city}, {shipment.sender.country}</p>
                                        </div>
                                        <div className="space-y-1 md:text-right">
                                            <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Destination</p>
                                            <p className="text-lg font-display">{shipment.recipient.city}, {shipment.recipient.country}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Est. Delivery</p>
                                            <p className="text-lg font-display text-gold-400">{formatDate(shipment.estimatedDelivery)}</p>
                                        </div>
                                        <div className="space-y-1 md:text-right">
                                            <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Weight</p>
                                            <p className="text-lg font-display">{shipment.package.weight} kg</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Cargo Type</p>
                                            <p className="text-lg font-display">{shipment.package.description}</p>
                                        </div>
                                        <div className="space-y-1 md:text-right">
                                            <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Service Level</p>
                                            <div className="flex items-center md:justify-end gap-1 text-gold-400">
                                                <span className="text-lg font-display">+ PRIORITY</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <p className="text-gray-400 font-mono text-sm tracking-wider">
                                            Invoice #INV-2023-8829
                                        </p>
                                        <button className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors text-sm font-bold font-body">
                                            View Invoice
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Flight Path / Map Visual */}
                            <div className="bg-white dark:bg-navy-800/50 rounded-3xl p-8 border border-gray-100 dark:border-navy-700">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="font-display text-xl text-navy-900 dark:text-white flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
                                            <Plane className="w-4 h-4" />
                                        </div>
                                        Real-time Flight Path
                                    </h3>
                                    <div className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                                        Live Tracking
                                    </div>
                                </div>
                                <div className="aspect-[2/1] bg-sky-100 dark:bg-navy-900 rounded-2xl overflow-hidden relative">
                                    <FlightPath
                                        origin={shipment.sender.city}
                                        destination={shipment.recipient.city}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function TrackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen pt-32 pb-24 bg-navy-900 flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        }>
            <TrackPageContent />
        </Suspense>
    );
}
