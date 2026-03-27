"use client";

import { motion } from "framer-motion";

const countries = [
    { name: "Nigeria", flag: "🇳🇬" },
    { name: "Ghana", flag: "🇬🇭" },
    { name: "South Africa", flag: "🇿🇦" },
    { name: "Kenya", flag: "🇰🇪" },
    { name: "Tanzania", flag: "🇹🇿" },
    { name: "Egypt", flag: "🇪🇬" },
    { name: "Senegal", flag: "🇸🇳" },
    { name: "Ivory Coast", flag: "🇨🇮" },
];

export default function Coverage() {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 text-center mb-16">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-navy-900/50 text-sm font-bold uppercase tracking-widest mb-4 block"
                >
                    Expanding Our Coverage
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-bold text-navy-900 tracking-tight"
                >
                    Now Covering <span className="text-blue-600">6+</span> African <br /> Countries
                </motion.h2>
            </div>

            <div className="relative">
                {/* Gradient Fades */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

                <motion.div
                    className="flex gap-8 items-center"
                    animate={{ x: [0, -1000] }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            duration: 30,
                            ease: "linear",
                        }
                    }}
                >
                    {[...countries, ...countries, ...countries].map((country, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-4 bg-gray-50 border border-gray-100 px-8 py-4 rounded-3xl shadow-premium-sm hover:shadow-premium transition-all duration-300 group cursor-default"
                        >
                            <span className="text-4xl filter grayscale group-hover:grayscale-0 transition-all duration-500 scale-110">
                                {country.flag}
                            </span>
                            <span className="text-lg font-bold text-navy-900/70 group-hover:text-navy-900 whitespace-nowrap">
                                {country.name}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
