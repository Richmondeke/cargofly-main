"use client";

import { motion } from "framer-motion";
import HeroWidget from "./HeroWidget";

// Custom Bezier for smooth "slide in"
const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const slideUpText = {
    hidden: { y: 60, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 1.0,
            ease: smoothEase
        }
    }
};

const slideUpWidget = {
    hidden: { y: 60, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 1.0,
            ease: smoothEase,
            delay: 0.2 // Reduced delay since there is no image to load in between
        }
    }
};

export default function HeroAB() {
    return (
        <section className="relative w-full pt-48 pb-[60px] bg-transparent flex flex-col items-center">
            {/* Main Content Frame - Centered Layout */}
            <div className="w-full max-w-[1000px] flex flex-col justify-center items-center gap-12 px-6 relative z-10 text-center">

                {/* Top Section: Centered Text */}
                <div className="space-y-4 flex flex-col items-center">
                    <motion.h1
                        variants={slideUpText}
                        initial="hidden"
                        animate="visible"
                        className="font-display text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white leading-[0.9] tracking-tighter mb-2"
                    >
                        {"Global Air Freight, Made ".split("").map((char, index) => (
                            <motion.span
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                    duration: 0.05,
                                    delay: index * 0.05 + 0.3, // Slightly faster start
                                }}
                            >
                                {char}
                            </motion.span>
                        ))}
                        <br />
                        <motion.span
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 0.5,
                                delay: "Global Air Freight, Made ".length * 0.05 + 0.4,
                            }}
                            className="text-[#FFCA00] inline-block mt-2 tracking-tighter"
                        >
                            Simple
                        </motion.span>
                    </motion.h1>

                    <motion.p
                        variants={slideUpText}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.1 }}
                        className="text-white/80 text-lg md:text-xl font-medium font-body max-w-2xl leading-snug mx-auto"
                    >
                        Track, Book, and Move Cargo Worldwide —
                        <br className="hidden sm:block" />
                        Faster Than Ever.
                    </motion.p>
                </div>

                {/* Bottom Widget - Centered */}
                <motion.div
                    variants={slideUpWidget}
                    initial="hidden"
                    animate="visible"
                    className="w-full mt-12 relative z-20"
                >
                    <HeroWidget />
                </motion.div>
            </div>
        </section>
    );
}
