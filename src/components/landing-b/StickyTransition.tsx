"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface StickyTransitionProps {
    children: React.ReactNode;
    revealContent: React.ReactNode;
}

export default function StickyTransition({ children, revealContent }: StickyTransitionProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Scale of the reveal circle (starts hidden, then grows to cover the screen)
    const scale = useTransform(scrollYProgress, [0.3, 0.9], [0, 15]);
    const opacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);

    // Inverse scale for content inside the circle so it doesn't look distorted
    const contentScale = useTransform(scrollYProgress, [0.4, 0.9], [0.8, 1]);
    const contentOpacity = useTransform(scrollYProgress, [0.5, 0.8], [0, 1]);

    return (
        <div ref={containerRef} className="relative h-[300vh]">
            {/* Base Content (Sticky) */}
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                {children}

                {/* Reveal Overlay Layer */}
                <motion.div
                    style={{
                        scale,
                        opacity,
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-full z-40 origin-center pointer-events-none"
                />

                {/* Revealed Content Layer */}
                <motion.div
                    style={{
                        opacity: contentOpacity,
                        scale: contentScale,
                        zIndex: 50
                    }}
                    className="absolute inset-0 pointer-events-none"
                >
                    <div className="pointer-events-auto h-full w-full">
                        {revealContent}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
