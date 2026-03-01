"use client";

import { motion } from "framer-motion";
import {
    Plane,
    CheckCircle2,
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
            <div className="absolute left-[33px] top-6 bottom-0 w-[2px] bg-gray-100 dark:bg-navy-700" />

            {/* Events */}
            <div className="space-y-0">
                {events.map((event, index) => {
                    const isCurrent = event.status === currentStatus;

                    return (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative flex gap-6 pb-12 last:pb-0 group"
                        >
                            {/* Icon Pillar */}
                            <div className="relative flex flex-col items-center">
                                <div
                                    className={cn(
                                        "w-[18px] h-[18px] rounded-full flex items-center justify-center transition-all z-10",
                                        event.isCompleted
                                            ? "bg-navy-900 dark:bg-navy-700"
                                            : isCurrent
                                                ? "bg-gold-500 scale-125 shadow-[0_0_15px_rgba(202,138,4,0.5)]"
                                                : "bg-gray-200 dark:bg-navy-800"
                                    )}
                                >
                                    {event.isCompleted && (
                                        <CheckCircle2 className="w-3 h-3 text-white" />
                                    )}
                                    {isCurrent && (
                                        <Plane className="w-2.5 h-2.5 text-navy-900" />
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 -mt-1">
                                <div className="flex flex-col mb-1">
                                    <h4
                                        className={cn(
                                            "font-display text-sm font-bold uppercase tracking-widest",
                                            isCurrent ? "text-navy-900 dark:text-white" : "text-gray-400"
                                        )}
                                    >
                                        {event.status}
                                    </h4>
                                    <p className="text-[11px] text-gray-400 font-medium font-body mt-0.5">
                                        {event.timestamp} — {event.location}
                                    </p>
                                </div>
                                {isCurrent && (
                                    <div className="mt-2 text-[10px] font-bold py-1 px-2 bg-gray-100 dark:bg-navy-700 rounded-lg inline-block text-navy-900 dark:text-white uppercase tracking-tighter">
                                        Current Status
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
