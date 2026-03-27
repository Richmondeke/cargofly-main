"use client";

import { motion } from "framer-motion";
import { Play, Youtube } from "lucide-react";

export default function Trust() {
    const locations = ["Nigeria", "Ghana", "Cameroon"];

    return (
        <section className="py-24 bg-white px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Content */}
                    <div className="order-2 lg:order-1">
                        <motion.h2
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-bold text-navy-900 leading-tight mb-8"
                        >
                            Global businesses trust us <br />
                            to make logistics <br />
                            <span className="text-blue-600">effortless</span>
                        </motion.h2>

                        <div className="flex flex-wrap gap-2 mb-12">
                            {locations.map((loc, i) => (
                                <motion.span
                                    key={loc}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`px-6 py-2 rounded-full text-sm font-bold border ${i === 0
                                            ? "bg-purple-100 text-purple-600 border-purple-200"
                                            : "bg-gray-100 text-navy-900/60 border-gray-200"
                                        }`}
                                >
                                    {loc}
                                </motion.span>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="pl-8 border-l-4 border-navy-900/10"
                        >
                            <h3 className="text-xl font-bold text-navy-900 mb-2">Moniebee Success</h3>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                "One of the best things about working with Cargofly is their technical support.
                                Top-notch even on weekends and public holidays. In one word: sensational."
                            </p>
                            <a
                                href="#"
                                className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline group"
                            >
                                Watch On Youtube
                                <motion.span
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                >
                                    →
                                </motion.span>
                            </a>
                        </motion.div>
                    </div>

                    {/* Right: Video Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="order-1 lg:order-2 relative group"
                    >
                        <div className="aspect-[16/10] bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-premium-xl border-8 border-white">
                            <img
                                src="/images/illustrations/aircraft_hangar.jpg"
                                alt="Success Story"
                                className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                            />

                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl relative z-10"
                                >
                                    <Play className="w-8 h-8 text-navy-900 fill-navy-900 ml-1" />
                                </motion.button>

                                {/* Pulse Effect */}
                                <div className="absolute w-24 h-24 bg-white/30 rounded-full animate-ping" />
                            </div>

                            {/* Logo Overlay */}
                            <div className="absolute bottom-8 right-8">
                                <span className="text-white/20 text-4xl font-bold italic tracking-tighter">Moniebee</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
