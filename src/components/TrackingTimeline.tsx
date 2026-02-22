"use client";

import { motion } from "framer-motion";
import {
    Package,
    Truck,
    Plane,
    CheckCircle2,
    MapPin,
    Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface TrackingEvent {
    id: string;
    status: string;
    location: string;
    timestamp: string;
    description: string;
    isCompleted: boolean;
}

interface TrackingTimelineProps {
    events: TrackingEvent[];
    currentStatus: string;
}

const statusIcons: Record<string, React.ElementType> = {
    "Order Placed": Package,
    "Picked Up": Package,
    "In Transit": Truck,
    "Departed": Plane,
    "Arrived": MapPin,
    "Out for Delivery": Truck,
    "Delivered": CheckCircle2,
};

export const sampleTrackingEvents: TrackingEvent[] = [
    {
        id: "1",
        status: "Order Placed",
        location: "Lagos, Nigeria",
        timestamp: "Jan 25, 2025 - 09:00 AM",
        description: "Shipment information received and order confirmed",
        isCompleted: true,
    },
    {
        id: "2",
        status: "Picked Up",
        location: "Lagos Distribution Center",
        timestamp: "Jan 25, 2025 - 02:30 PM",
        description: "Package picked up from sender",
        isCompleted: true,
    },
    {
        id: "3",
        status: "Departed",
        location: "Murtala Muhammed International Airport",
        timestamp: "Jan 26, 2025 - 06:00 AM",
        description: "Departed on Caverton cargo flight CV2847",
        isCompleted: true,
    },
    {
        id: "4",
        status: "Arrived",
        location: "Heathrow Airport, London",
        timestamp: "Jan 26, 2025 - 04:30 PM",
        description: "Arrived at destination hub, clearing customs",
        isCompleted: true,
    },
    {
        id: "5",
        status: "Out for Delivery",
        location: "London, UK",
        timestamp: "Jan 27, 2025 - 08:00 AM",
        description: "Package is out for delivery",
        isCompleted: false,
    },
    {
        id: "6",
        status: "Delivered",
        location: "London, UK",
        timestamp: "Estimated: Today",
        description: "Expected delivery by 6:00 PM",
        isCompleted: false,
    },
];

export default function TrackingTimeline({
    events,
    currentStatus,
}: TrackingTimelineProps) {
    return (
        <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />

            {/* Events */}
            <div className="space-y-0">
                {events.map((event, index) => {
                    const Icon = statusIcons[event.status] || Package;
                    const isCurrent = event.status === currentStatus;
                    const isLast = index === events.length - 1;

                    return (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative flex gap-6 pb-8 last:pb-0"
                        >
                            {/* Icon */}
                            <div className="relative z-10">
                                <div
                                    className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all bg-white dark:bg-slate-800 shadow-sm",
                                        event.isCompleted
                                            ? "bg-gold-500 shadow-lg shadow-gold-500/20"
                                            : isCurrent
                                                ? "border-2 border-gold-500 animate-pulse"
                                                : "border border-slate-200 dark:border-slate-700"
                                    )}
                                >
                                    <Icon
                                        className={cn(
                                            "w-5 h-5",
                                            event.isCompleted
                                                ? "text-navy-900"
                                                : isCurrent
                                                    ? "text-gold-500"
                                                    : "text-slate-400 dark:text-slate-500"
                                        )}
                                    />
                                </div>
                                {/* Connector dot for completed */}
                                {event.isCompleted && !isLast && (
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gold-500" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pt-1">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h4
                                        className={cn(
                                            "font-display text-lg",
                                            event.isCompleted || isCurrent
                                                ? "text-slate-900 dark:text-white"
                                                : "text-slate-400 dark:text-slate-500"
                                        )}
                                    >
                                        {event.status}
                                    </h4>
                                    {isCurrent && (
                                        <span className="px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-600 dark:text-gold-400 text-xs font-bold uppercase tracking-wider">
                                            Current
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2 font-body">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span>{event.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2 font-body">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{event.timestamp}</span>
                                </div>
                                <p
                                    className={cn(
                                        "text-sm font-body",
                                        event.isCompleted || isCurrent
                                            ? "text-slate-600 dark:text-slate-300"
                                            : "text-slate-400 dark:text-slate-500"
                                    )}
                                >
                                    {event.description}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
