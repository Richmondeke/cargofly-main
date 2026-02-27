"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const ROW1 = [
    "Pharmaceuticals & Healthcare",
    "Aerospace & AOG",
    "E-commerce Logistics",
    "Perishables & Food",
    "Automotive Parts",
    "High-Value Cargo",
    "Oversized Freight",
    "Live Animals",
];

const ROW2 = [
    "Cold Chain Solutions",
    "Charters",
    "Dangerous Goods",
    "Humanitarian Relief",
    "Time-Critical Delivery",
    "Supply Chain Management",
    "Customs Clearance",
    "Project Cargo",
    "Temperature Controlled",
    "Express Freight",
    "Global Distribution",
    "Freight Consolidation",
    "Last-Mile Delivery",
    "Warehouse Management",
];

export default function TagMarquee() {
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);

    const MarqueeRow = ({ tags, duration, dir = "left", id }: { tags: string[], duration: number, dir?: "left" | "right", id: number }) => {
        const isHovered = hoveredRow === id;

        return (
            <div
                className="flex overflow-hidden"
                onMouseEnter={() => setHoveredRow(id)}
                onMouseLeave={() => setHoveredRow(null)}
            >
                <motion.div
                    className="flex gap-4 pr-4"
                    animate={{ x: dir === "left" ? "-50%" : "0%" }}
                    initial={dir === "right" ? { x: "-50%" } : undefined}
                    transition={{
                        duration: isHovered ? duration * 3 : duration,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    style={{ width: "fit-content" }}
                >
                    {tags.map((tag, i) => (
                        <motion.div
                            key={i}
                            whileHover={{
                                scale: 1.05,
                                backgroundColor: "rgb(255, 203, 0)", // Gold Yellow
                                color: "rgb(0, 51, 153)", // Navy Blue
                            }}
                            transition={{ duration: 0.2 }}
                            className="whitespace-nowrap px-6 py-3 bg-indigo-100 border border-navy-900/10 text-navy-900 text-xs font-bold uppercase tracking-tight rounded-md shadow-sm cursor-pointer"
                        >
                            {tag}
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        );
    };

    return (
        <div className="w-full py-40 bg-transparent relative z-10 space-y-4 border-t border-white/10">
            <MarqueeRow id={1} tags={[...ROW1, ...ROW1, ...ROW1]} duration={30} />
            <MarqueeRow id={2} tags={[...ROW2, ...ROW2, ...ROW2]} duration={40} dir="right" />
            <MarqueeRow id={3} tags={[...ROW1, ...ROW2, ...ROW1]} duration={35} />
        </div>
    );
}
