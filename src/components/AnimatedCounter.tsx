"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
    value: number;
    suffix?: string;
    prefix?: string;
    label?: string;
    duration?: number;
    className?: string;
}

export default function AnimatedCounter({
    value,
    suffix = "",
    prefix = "",
    label,
    duration = 2,
    className,
}: AnimatedCounterProps) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (!isInView) return;

        let startTime: number;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

            // Easing function for smooth deceleration
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeOutQuart * value));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [isInView, value, duration]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className={cn("text-center", className)}
        >
            <div className={cn("font-display text-5xl md:text-6xl text-navy-900 dark:text-white mb-2", !label && "mb-0")}>
                {prefix}
                <span className="tabular-nums">{count.toLocaleString()}</span>
                <span className="text-gold-500 dark:text-gold-400">{suffix}</span>
            </div>
            {label && (
                <p className="text-navy-900/40 dark:text-white/40 text-sm uppercase tracking-wider font-body">
                    {label}
                </p>
            )}
        </motion.div>
    );
}
