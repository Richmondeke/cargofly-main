"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
    Package,
    MapPin,
    Clock,
    CheckCircle2,
    Copy,
    Check,
    Plane,
    Info,
} from "lucide-react";
import TrackingWidget from "@/components/TrackingWidget";
import TrackingTimeline, { TrackingEvent as UITrackingEvent } from "@/components/TrackingTimeline";
import { cn } from "@/lib/utils";
import {
    getShipmentByTracking,
    getTrackingEvents,
    Shipment,
    TrackingEvent as DBTrackingEvent,
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
    const [copied, setCopied] = useState(false);

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
                    const flowEvents = eventsData.reverse().map((e: any) => ({
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

    const formatDate = (timestamp: any) => {
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
                    className="text-center mb-12"
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-gold-500/10 text-gold-400 text-xs font-bold tracking-[0.2em] uppercase mb-6 font-body">
                        Track Shipment
                    </span>
                    <h1 className="font-display text-4xl md:text-5xl text-navy-900 dark:text-white mb-4">
                        Track Your
                        <span className="block italic text-navy-900/80 dark:text-white/80">Package</span>
                    </h1>
                    <p className="text-navy-900/60 dark:text-white/60 max-w-xl mx-auto font-body">
                        Enter your tracking number to get real-time updates on your shipment&apos;s
                        location and status.
                    </p>
                </motion.div>

                {/* Tracking Widget */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="max-w-2xl mx-auto mb-16"
                >
                    <TrackingWidget
                        variant="page"
                        onTrack={(id) => setTrackingId(id)}
                    />
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
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid lg:grid-cols-3 gap-8"
                    >
                        {/* Main Status Card */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 duration-500 group-hover:bg-gold-500/20" />

                                <div className="relative z-10">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h2 className="font-display text-3xl text-white">
                                                    {shipment.status.replace(/_/g, " ").toUpperCase()}
                                                </h2>
                                                <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider">
                                                    Active
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-white/40 font-body">
                                                <span>Tracking ID:</span>
                                                <span className="text-white font-mono tracking-wider">
                                                    {shipment.trackingNumber}
                                                </span>
                                                <button
                                                    onClick={handleCopy}
                                                    className="p-1 hover:text-gold-400 transition-colors"
                                                >
                                                    {copied ? (
                                                        <Check className="w-4 h-4 text-green-400" />
                                                    ) : (
                                                        <Copy className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-white/40 font-body mb-1">
                                                Estimated Delivery
                                            </p>
                                            <p className="font-display text-xl text-gold-400">
                                                {formatDate(shipment.estimatedDelivery)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mb-8 relative">
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${getProgress(shipment.status)}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className="h-full bg-gold-500"
                                            />
                                        </div>
                                        <div
                                            className="absolute top-1/2 -translate-y-1/2 -ml-3"
                                            style={{ left: `${getProgress(shipment.status)}%` }}
                                        >
                                            <div className="w-6 h-6 rounded-full bg-gold-500 border-4 border-navy-900 shadow-[0_0_20px_rgba(202,138,4,0.5)] flex items-center justify-center">
                                                <Plane className="w-3 h-3 text-navy-900" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Route Info */}
                                    <div className="grid grid-cols-2 gap-8 py-8 border-t border-white/5">
                                        <div>
                                            <p className="text-sm text-white/40 font-body mb-2 flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-gold-500" />
                                                From
                                            </p>
                                            <p className="text-xl text-white font-display mb-1">
                                                {shipment.sender.city}, {shipment.sender.country}
                                            </p>
                                            <p className="text-sm text-white/40 font-body">
                                                {formatDate(shipment.createdAt)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-white/40 font-body mb-2 flex items-center justify-end gap-2">
                                                <MapPin className="w-4 h-4 text-gold-500" />
                                                Destination
                                            </p>
                                            <p className="text-xl text-white font-display mb-1">
                                                {shipment.recipient.city}, {shipment.recipient.country}
                                            </p>
                                            <p className="text-sm text-white/40 font-body">
                                                {formatDate(shipment.estimatedDelivery)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <TrackingTimeline
                                events={events}
                                currentStatus={getStatusDisplay(shipment.status as any) || shipment.status}
                            />
                        </div>

                        {/* Shipment Details Sidebar */}
                        <div className="space-y-6">
                            <div className="glass-panel p-6 rounded-3xl">
                                <h3 className="font-display text-lg text-white mb-6 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-gold-500" />
                                    Shipment Details
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                                        <span className="text-white/40 text-sm font-body">Service</span>
                                        <span className="text-white font-body capitalize">{shipment.service.replace(/_/g, " ")}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                                        <span className="text-white/40 text-sm font-body">Weight</span>
                                        <span className="text-white font-body">{shipment.package.weight} kg</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                                        <span className="text-white/40 text-sm font-body">Dimensions</span>
                                        <span className="text-white font-body">
                                            {shipment.package.dimensions.length}x{shipment.package.dimensions.width}x{shipment.package.dimensions.height} cm
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                                        <span className="text-white/40 text-sm font-body">Contents</span>
                                        <span className="text-white font-body">{shipment.package.description}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Support Card */}
                            <div className="p-6 rounded-3xl bg-gold-500/10 border border-gold-500/20">
                                <h3 className="font-display text-lg text-white mb-2">
                                    Need Help?
                                </h3>
                                <p className="text-sm text-white/60 font-body mb-4">
                                    Our support team is available 24/7 to assist you with your shipment.
                                </p>
                                <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors font-body text-sm font-bold uppercase tracking-wider">
                                    Contact Support
                                </button>
                            </div>
                        </div>
                    </motion.div>
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
