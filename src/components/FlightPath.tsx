"use client";

import { motion } from "framer-motion";

interface FlightPathProps {
    origin: string;
    destination: string;
}

export default function FlightPath({ origin, destination }: FlightPathProps) {
    return (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            {/* Background Map Placeholder Pattern */}
            <div className="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            <div className="relative w-[80%] h-[60%]">
                {/* Curve SVG */}
                <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible">
                    <defs>
                        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" strokeWidth="2" />
                            <stop offset="50%" stopColor="#ca8a04" strokeWidth="2" />
                            <stop offset="100%" stopColor="#3b82f6" strokeWidth="2" />
                        </linearGradient>
                    </defs>

                    {/* The Path */}
                    <path
                        className="text-gray-200 dark:text-navy-700"
                        d="M 50,150 Q 200,50 350,150"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                    />

                    {/* Animated Progress Path */}
                    <motion.path
                        d="M 50,150 Q 200,50 350,150"
                        fill="none"
                        stroke="url(#pathGradient)"
                        strokeWidth="3"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 0.6, opacity: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                    />

                    {/* Origin Point */}
                    <circle cx="50" cy="150" r="4" fill="#3b82f6" />
                    <text x="50" y="175" textAnchor="middle" className="text-[10px] font-bold fill-navy-900 dark:fill-white font-display">
                        {origin.toUpperCase()}
                    </text>

                    {/* Destination Point */}
                    <circle cx="350" cy="150" r="4" fill="#3b82f6" />
                    <text x="350" y="175" textAnchor="middle" className="text-[10px] font-bold fill-navy-900 dark:fill-white font-display">
                        {destination.toUpperCase()}
                    </text>

                    {/* Plane Icon (Animating along the path) */}
                    <motion.g
                        initial={{ offsetDistance: "0%" }}
                        animate={{ offsetDistance: "60%" }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        style={{
                            offsetPath: "path('M 50,150 Q 200,50 350,150')",
                            offsetRotate: "auto 90deg"
                        }}
                    >
                        <path
                            d="M-5,-5 L5,0 L-5,5 Z"
                            fill="#ca8a04"
                            stroke="#ca8a04"
                        />
                        <circle r="12" fill="rgba(202,138,4,0.2)" />
                    </motion.g>
                </svg>

                {/* Status Box */}
                <div className="absolute bottom-4 left-4 bg-navy-900 p-3 rounded-lg border border-white/10 shadow-xl hidden md:block">
                    <div className="space-y-1">
                        <div className="flex justify-between gap-4">
                            <span className="text-[8px] text-gray-400 font-bold uppercase">Alt: 35,000 FT</span>
                            <span className="text-[8px] text-gray-400 font-bold uppercase text-right">SPD: 540 KTS</span>
                        </div>
                        <div className="bg-white/5 h-1 rounded-full overflow-hidden">
                            <div className="w-3/5 h-full bg-gold-400" />
                        </div>
                        <p className="text-[8px] text-white/60 font-medium">ETA: 00:45 LHR</p>
                    </div>
                </div>
            </div>

            {/* Ocean Texture/Waves */}
            <div className="absolute bottom-0 left-0 w-full h-1/4 bg-sky-200/20 dark:bg-navy-800/20 blur-xl translate-y-1/2" />
        </div>
    );
}
