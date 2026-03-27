"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
    getShipmentByTracking,
    getTrackingEvents,
    Shipment,
    TrackingEvent,
    getStatusDisplay,
    formatTimestamp
} from "@/lib/firestore";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface UITrackingEvent {
    id: string;
    status: string;
    location: string;
    timestamp: string;
    description: string;
    isCompleted: boolean;
}

function TrackResults({ shipment, firestoreEvents, setTrackingId }: { shipment: Shipment, firestoreEvents: TrackingEvent[], setTrackingId: (id: string) => void }) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const formatDate = (timestamp: any) => {
        if (!timestamp) return "Pending";
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            timeZoneName: 'short'
        }).format(date);
    };

    const getStatusStage = (status: string) => {
        const stages: Record<string, number> = {
            pending: 0,
            confirmed: 0,
            picked_up: 1,
            in_transit: 2,
            at_hub: 2,
            customs_hold: 3,
            out_for_delivery: 4,
            delivered: 4,
            cancelled: -1,
            returned: -1
        };
        return stages[status] ?? 0;
    };

    const currentStage = shipment ? getStatusStage(shipment.status) : 0;
    const stages = [
        { label: "Booked", icon: "check_circle" },
        { label: "Picked Up", icon: "check_circle" },
        { label: "In Transit", icon: "flight" },
        { label: "Customs", icon: "assignment" },
        { label: "Delivered", icon: "home" }
    ];

    const events: UITrackingEvent[] = [...firestoreEvents].reverse().map((e: TrackingEvent, idx: number) => ({
        id: e.id || `event-${idx}`,
        status: getStatusDisplay(e.status) || e.status,
        location: e.location,
        timestamp: formatTimestamp(e.timestamp),
        description: e.description,
        isCompleted: true
    }));

    if (!mounted) return null;

    return (
        <div className="min-h-screen pt-32 pb-24 bg-[#F8FAFC] dark:bg-slate-950 font-sans">
            <div className="container mx-auto px-6 max-w-5xl">
                {/* Title Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <StatusBadge status={shipment.status} className="h-6 px-3 rounded-full text-[10px] bg-green-100 text-green-700 border-none" />
                        <span className="text-[10px] text-slate-400 font-medium">Updated 4 mins ago</span>
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        AWB {shipment.trackingNumber}
                    </h1>
                </div>

                {/* Progress Card */}
                <Card className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-8 mb-6 shadow-sm">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
                        <div className="flex-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Origin</span>
                            <h2 className="text-3xl font-bold text-primary">{shipment.sender.city.substring(0, 3).toUpperCase()}</h2>
                            <p className="text-xs text-slate-500">{shipment.sender.city}</p>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-2xl rotate-90 md:rotate-0">flight</span>
                        </div>
                        <div className="flex-1 text-right">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Destination</span>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{shipment.recipient.city.substring(0, 3).toUpperCase()}</h2>
                            <p className="text-xs text-slate-500">{shipment.recipient.city}</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative pt-4 pb-8">
                        <div className="absolute top-[2.15rem] left-0 right-0 h-[2px] bg-slate-100 dark:bg-white/5 mx-8" />
                        <div
                            className="absolute top-[2.15rem] left-0 h-[2px] bg-primary transition-all duration-1000 ease-out mx-8"
                            style={{ width: `${Math.max(0, currentStage) * 25}%` }}
                        />
                        <div className="flex justify-between relative z-10">
                            {stages.map((stage, idx) => (
                                <div key={idx} className="flex flex-col items-center">
                                    <div className={`
                                        w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 border-2
                                        ${idx <= currentStage
                                            ? 'bg-primary border-primary text-white'
                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-300'}
                                    `}>
                                        <span className="material-symbols-outlined text-xs">{idx < currentStage ? 'check' : stage.icon === 'check_circle' ? '' : stage.icon}</span>
                                    </div>
                                    <div className="mt-3 text-center">
                                        <span className={`text-[10px] font-bold uppercase tracking-tight block ${idx <= currentStage ? 'text-primary' : 'text-slate-400'}`}>
                                            {stage.label}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Card className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-8 shadow-sm">
                        <div className="flex items-center gap-2 mb-8">
                            <span className="material-symbols-outlined text-primary">info</span>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Cargo Details</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Pieces / Weight</span>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                    {shipment.packages.reduce((sum, p) => sum + p.pieces, 0)} pcs / {shipment.packages.reduce((sum, p) => sum + p.weight, 0).toFixed(2)} kg
                                </p>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Service Level</span>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{shipment.service.toUpperCase()}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-primary/5 border border-primary/20 rounded-2xl p-8 shadow-sm flex flex-col justify-center">
                        <span className="text-[10px] text-primary/60 font-bold uppercase tracking-widest block mb-2">Estimated Arrival</span>
                        <h4 className="text-2xl font-bold text-primary mb-1">
                            {formatDate(shipment.estimatedDelivery)}
                        </h4>
                        <p className="text-[10px] text-slate-400 italic">Subject to local conditions.</p>
                    </Card>
                </div>

                {/* History */}
                <Card className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl p-8 mb-10 shadow-sm">
                    <div className="flex items-center gap-2 mb-10">
                        <span className="material-symbols-outlined text-primary">history</span>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tracking History</h3>
                    </div>
                    <div className="relative">
                        <div className="absolute left-[26px] top-6 bottom-6 w-[2px] bg-slate-100 dark:bg-white/5" />
                        <div className="space-y-12">
                            {events.map((event, idx) => (
                                <div key={event.id} className="relative flex items-start gap-12 group">
                                    <div className={`
                                        relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-sm
                                        ${idx === 0 ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}
                                    `}>
                                        <span className="material-symbols-outlined text-[14px]">
                                            {idx === 0 ? 'flight_takeoff' : 'check'}
                                        </span>
                                    </div>
                                    <div className={`flex-1 p-5 rounded-xl border transition-all duration-300 ${idx === 0 ? 'bg-white dark:bg-slate-800 border-primary/20 shadow-md' : 'bg-slate-50/50 dark:bg-slate-800/30 border-transparent'}`}>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                            <h4 className={`font-bold ${idx === 0 ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>
                                                {event.description}
                                            </h4>
                                            <span className="text-[10px] font-medium text-primary uppercase">{event.timestamp.split(', ').slice(-2).join(', ')}</span>
                                        </div>
                                        <p className="text-xs text-slate-500">{event.location} — {event.timestamp.split(', ').slice(0, 2).join(', ')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Action Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <button
                        onClick={() => {
                            const toastId = toast.loading('Generating Master AWB PDF...');
                            setTimeout(() => {
                                toast.success('Master AWB Downloaded', { id: toastId });
                            }, 1500);
                        }}
                        className="flex items-center justify-between p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">description</span>
                            </div>
                            <div className="text-left">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Download Master AWB</h4>
                                <p className="text-[10px] text-slate-500">Official Shipping Document (PDF)</p>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">download</span>
                    </button>

                    <button
                        onClick={() => router.push('/dashboard/support')}
                        className="flex items-center justify-between p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">headset_mic</span>
                            </div>
                            <div className="text-left">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Contact Support</h4>
                                <p className="text-[10px] text-slate-500">24/7 Priority Assistance</p>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">chevron_right</span>
                    </button>
                </div>

                {/* Track Another */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-slate-400 mb-6 font-medium">Want to track another shipment?</p>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const val = (e.currentTarget.elements.namedItem('trackingId') as HTMLInputElement).value;
                            if (val.trim()) setTrackingId(val.trim());
                        }}
                        className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                    >
                        <input
                            name="trackingId"
                            type="text"
                            placeholder="Enter Tracking ID"
                            className="flex-1 px-6 py-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white"
                        />
                        <button type="submit" className="bg-primary text-white font-bold px-8 py-4 rounded-xl shadow-lg active:scale-95">
                            Track
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

function TrackPageContent() {
    const searchParams = useSearchParams();
    const [trackingId, setTrackingId] = useState<string | null>(null);
    const [shipment, setShipment] = useState<Shipment | null>(null);
    const [firestoreEvents, setFirestoreEvents] = useState<TrackingEvent[]>([]);
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
                const shipmentData = await getShipmentByTracking(trackingId);
                if (shipmentData && shipmentData.id) {
                    const eventsData = await getTrackingEvents(shipmentData.id);
                    setShipment(shipmentData);
                    setFirestoreEvents(eventsData);
                } else {
                    setError("Shipment not found.");
                    setShipment(null);
                }
            } catch (err) {
                console.error("Error fetching shipment:", err);
                setError("Failed to load shipment.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [trackingId]);

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-24 bg-white dark:bg-slate-950 flex flex-col items-center justify-center font-sans text-slate-500">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p>Locating shipment...</p>
            </div>
        );
    }

    if (error || !shipment) {
        return (
            <div className="min-h-screen pt-32 pb-24 bg-[#f8f6f6] dark:bg-slate-950 font-sans">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <Card className="bg-white dark:bg-slate-900 rounded-3xl p-12 shadow-sm border border-slate-100 dark:border-white/5">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">No Shipment Found</h2>
                        <p className="text-slate-500 mb-8">{error || "Check your tracking ID and try again."}</p>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const val = (e.currentTarget.elements.namedItem('trackingId') as HTMLInputElement).value;
                                if (val.trim()) setTrackingId(val.trim());
                            }}
                            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                        >
                            <input
                                name="trackingId"
                                type="text"
                                placeholder="Enter Tracking ID"
                                className="flex-1 px-6 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 focus:outline-none"
                            />
                            <button type="submit" className="bg-primary text-white font-bold px-8 py-4 rounded-xl">
                                Track
                            </button>
                        </form>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <TrackResults
            shipment={shipment}
            firestoreEvents={firestoreEvents}
            setTrackingId={setTrackingId}
        />
    );
}

export default function TrackPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white dark:bg-slate-950" />}>
            <TrackPageContent />
        </Suspense>
    );
}
