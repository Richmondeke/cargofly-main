"use client";

import { useState, useEffect, Suspense, use } from "react";
import Link from "next/link";
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
    ArrowLeft
} from "lucide-react";
import TrackingTimeline, { TrackingEvent as UITrackingEvent } from "@/components/TrackingTimeline";
import { cn } from "@/lib/utils";
import {
    getShipmentByTracking,
    getTrackingEvents,
    Shipment,
    getStatusDisplay,
    formatTimestamp
} from "@/lib/firestore";

interface PageProps {
    params: Promise<{ id: string }>;
}

function TrackingContent({ id }: { id: string }) {
    const [shipment, setShipment] = useState<Shipment | null>(null);
    const [events, setEvents] = useState<UITrackingEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError("");
            try {
                // Remove any CF- prefix if present for querying, or handle as needed based on your DB
                // The DB queries usually expect the full string or a specific format. 
                // Based on previous code, passing the ID directly seems correct.
                const shipmentData = await getShipmentByTracking(id);

                if (shipmentData && shipmentData.id) {
                    const eventsData = await getTrackingEvents(shipmentData.id);
                    setShipment(shipmentData);

                    const flowEvents = eventsData.reverse().map((e: any) => ({
                        id: e.id,
                        status: getStatusDisplay(e.status) || e.status,
                        location: e.location,
                        timestamp: formatTimestamp(e.timestamp),
                        description: e.description,
                        isCompleted: true
                    }));
                    setEvents(flowEvents);
                } else {
                    setError("Shipment not found.");
                }
            } catch (err) {
                console.error("Error fetching shipment:", err);
                setError("Failed to load shipment details.");
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchData();
        }
    }, [id]);

    const handleCopy = async () => {
        if (id) {
            await navigator.clipboard.writeText(id);
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
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        }).format(date);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !shipment) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <div className="p-4 rounded-full bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    <Info className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Shipment Not Found</h3>
                <p className="text-slate-500 dark:text-slate-400">{error || "The requested shipment could not be found."}</p>
                <Link href="/dashboard/shipments" className="text-primary hover:underline">
                    Return to Shipments
                </Link>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/shipments" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Shipment Details</h1>
                    <p className="text-slate-500 dark:text-slate-400">Tracking ID: {id}</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Status Card */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                                        {shipment.status.replace(/_/g, " ").toUpperCase()}
                                    </h2>
                                    <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold uppercase tracking-wider">
                                        Active
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                    <span>Tracking ID:</span>
                                    <span className="font-mono">{shipment.trackingNumber}</span>
                                    <button onClick={handleCopy} className="p-1 hover:text-primary transition-colors">
                                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Estimated Delivery</p>
                                <p className="text-xl font-bold text-primary">{formatDate(shipment.estimatedDelivery)}</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-8 relative">
                            <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${getProgress(shipment.status)}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-primary"
                                />
                            </div>
                            <div
                                className="absolute top-1/2 -translate-y-1/2 -ml-3"
                                style={{ left: `${getProgress(shipment.status)}%` }}
                            >
                                <div className="w-6 h-6 rounded-full bg-primary border-4 border-white dark:border-surface-dark shadow-lg flex items-center justify-center">
                                    <Plane className="w-3 h-3 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Route Info */}
                        <div className="grid grid-cols-2 gap-8 py-8 border-t border-slate-100 dark:border-slate-700">
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-primary" /> From
                                </p>
                                <p className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                                    {shipment.sender.city}, {shipment.sender.country}
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{formatDate(shipment.createdAt)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-end gap-2">
                                    <MapPin className="w-4 h-4 text-primary" /> Destination
                                </p>
                                <p className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                                    {shipment.recipient.city}, {shipment.recipient.country}
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{formatDate(shipment.estimatedDelivery)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <TrackingTimeline
                        events={events}
                        currentStatus={getStatusDisplay(shipment.status as any) || shipment.status}
                    />
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <Package className="w-5 h-5 text-primary" /> Shipment Details
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700">
                                <span className="text-slate-500 dark:text-slate-400 text-sm">Service</span>
                                <span className="text-slate-900 dark:text-white capitalize">{shipment.service.replace(/_/g, " ")}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700">
                                <span className="text-slate-500 dark:text-slate-400 text-sm">Weight</span>
                                <span className="text-slate-900 dark:text-white">{shipment.package.weight} kg</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700">
                                <span className="text-slate-500 dark:text-slate-400 text-sm">Dimensions</span>
                                <span className="text-slate-900 dark:text-white">
                                    {shipment.package.dimensions.length}x{shipment.package.dimensions.width}x{shipment.package.dimensions.height} cm
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700">
                                <span className="text-slate-500 dark:text-slate-400 text-sm">Contents</span>
                                <span className="text-slate-900 dark:text-white">{shipment.package.description}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DashboardTrackPage({ params }: PageProps) {
    const resolvedParams = use(params);
    return <TrackingContent id={resolvedParams.id} />;
}
