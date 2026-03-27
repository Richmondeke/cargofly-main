"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Shirt, Briefcase, Coffee, ArrowRight } from "lucide-react";

const serviceCategories = [
    {
        title: "Air Freight",
        description: "Global air cargo transport with priority handling, ensuring your time-critical shipments reach their destination across continents with unmatched speed.",
        icon: <ShoppingCart className="w-6 h-6" />,
    },
    {
        title: "AOG Support",
        description: "Specialized Aircraft on Ground logistics for the aviation industry. We move critical parts 24/7 to keep your fleet in the skies.",
        icon: <Shirt className="w-6 h-6" />,
    },
    {
        title: "Cold Chain",
        description: "Temperature-controlled logistics for pharmaceuticals and perishables, maintaining integrity from origin to final destination using advanced monitoring.",
        icon: <Briefcase className="w-6 h-6" />,
    },
    {
        title: "Skilled Handling",
        description: "Expert handling for fragile, high-value, or oversized cargo. Our team ensures specialized care for every unique shipment requirement.",
        icon: <Coffee className="w-6 h-6" />,
    },
];

const expertiseTags = [
    "Real-time Tracking", "Customs Clearance", "Express Delivery", "Flight Monitoring",
    "Digital POD", "Secure Warehousing", "Cargo Insurance", "Global Network",
    "Supply Chain Optimization", "Door-to-Door", "Aviation Logistics", "Freight Forwarding"
];

const topTags = [
    "Air Logistics", "Smart Tracking", "Inventory Management",
    "West Africa Reach", "E-commerce Logistics", "AOG Solutions", "Real-time Dashboards"
];

export default function DetailedServices() {
    return (
        <section id="detailed-services" className="bg-white text-navy-900 py-24 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-900/5 border border-navy-900/10 text-navy-900 text-xs font-bold uppercase tracking-wider mb-8">
                        <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                        Logistics Excellence
                    </div>

                    <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">Services</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mb-12">
                        We integrate advanced technology with global reach to move your cargo.
                    </p>

                    <div className="flex flex-wrap gap-3 mb-16">
                        {topTags.map((tag) => (
                            <span key={tag} className="px-5 py-2.5 rounded-xl bg-blue-600/5 border border-blue-600/10 text-sm font-semibold text-blue-600/80">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-4 mb-20">
                        <button onClick={() => window.location.href = '/dashboard/new-booking'} className="px-8 py-4 bg-navy-900 text-white rounded-full font-bold hover:bg-navy-800 transition-all shadow-xl hover:scale-105 active:scale-95 border border-white/10">
                            Book Air Freight
                        </button>
                        <button onClick={() => window.location.href = '/track'} className="px-8 py-4 border border-gray-200 bg-gray-50 text-navy-900 rounded-full font-bold hover:bg-gray-100 transition-all hover:scale-105 active:scale-95">
                            Track Shipment
                        </button>
                    </div>
                </motion.div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24 [perspective:1000px]">
                    {serviceCategories.map((category, idx) => (
                        <motion.div
                            key={category.title}
                            initial={{ opacity: 0, rotateY: idx % 2 === 0 ? 10 : -10, x: idx % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{
                                delay: idx * 0.1,
                                duration: 1,
                                ease: [0.22, 1, 0.36, 1]
                            }}
                            whileHover={{
                                scale: 1.01,
                                backgroundColor: "rgba(1, 111, 255, 0.02)",
                            }}
                            className="group p-8 md:p-12 rounded-[2.5rem] bg-gray-50 border border-gray-100 hover:border-blue-600/20 transition-all duration-500 cursor-default shadow-premium hover:shadow-premium-xl"
                        >
                            <div className="flex items-center gap-6 mb-8">
                                <div className="p-4 rounded-2xl bg-blue-600/10 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 border border-blue-600/20">
                                    {category.icon}
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold group-hover:text-blue-600 transition-colors tracking-tight">{category.title}</h3>
                            </div>
                            <p className="text-lg text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors">
                                {category.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Expertise Tag Cloud - Opposite Scroll Marquee */}
                <div className="relative pt-12 border-t border-gray-100 overflow-hidden flex flex-col gap-4">
                    {/* Row 1: Left Scroll */}
                    <div className="flex overflow-hidden whitespace-nowrap">
                        <motion.div
                            className="flex gap-4 pr-4"
                            animate={{ x: [0, -1000] }}
                            transition={{
                                x: { repeat: Infinity, duration: 40, ease: "linear" }
                            }}
                        >
                            {[...expertiseTags, ...expertiseTags, ...expertiseTags].map((tag, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-navy-900/70 font-medium px-6 py-2 rounded-full border border-gray-200 bg-gray-100/50 whitespace-nowrap">
                                    {tag}
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Row 2: Right Scroll */}
                    <div className="flex overflow-hidden whitespace-nowrap">
                        <motion.div
                            className="flex gap-4 pr-4"
                            animate={{ x: [-1000, 0] }}
                            transition={{
                                x: { repeat: Infinity, duration: 45, ease: "linear" }
                            }}
                        >
                            {[...expertiseTags, ...expertiseTags, ...expertiseTags].map((tag, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-navy-900/70 font-medium px-6 py-2 rounded-full border border-gray-200 bg-gray-100/50 whitespace-nowrap">
                                    {tag}
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
