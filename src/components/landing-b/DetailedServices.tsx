"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plane, Activity, Thermometer, ShieldCheck, ArrowRight } from "lucide-react";

const serviceCategories = [
    {
        title: "Scheduled Cargo Consolidations",
        slug: "scheduled-consolidations",
        description: "We combine smaller shipments into one cost-effective flight, ensuring your goods move regularly and affordably.",
        icon: <Plane className="w-6 h-6" />,
        image: "/images/cargo/service_consolidation.png"
    },
    {
        title: "Large & Special Equipment",
        slug: "special-equipment",
        description: "Moving heavy machinery or oversized parts? Our expert team and specialized propeller planes handle the most challenging loads with care.",
        icon: <Activity className="w-6 h-6" />,
        image: "/images/cargo/service_special_equipment.png"
    },
    {
        title: "Global Air Charter",
        slug: "global-charter",
        description: "Private flight solutions for your cargo. When timing is everything, we dedicate an entire aircraft to your specific route and schedule.",
        icon: <Thermometer className="w-6 h-6" />,
        image: "/images/cargo/service_global_charter.png"
    },
    {
        title: "Fixed-Route Charter Operations",
        slug: "fixed-route-charter",
        description: "Steady, reliable transport on a set schedule. Ideal for supply chains that need consistent deliveries between set locations.",
        icon: <ShieldCheck className="w-6 h-6" />,
        image: "/images/cargo/service_fixed_pipe.png"
    },
];

const expertiseTags = [
    "Simple Logistics", "Reliable Delivery", "Express Air", "Cargo Monitoring",
    "Easy Tracking", "Secure Handling", "Global Network", "Direct Flights",
    "Fast Clearing", "Heavy Freight", "Scheduled Runs", "Supply Chain"
];

const topTags = [
    "Air Cargo", "Live Tracking", "Easy Logistics",
    "West Africa", "Priority Shipping", "Quick Response", "Smart Freight"
];

export default function DetailedServices() {
    return (
        <section id="detailed-services" className="bg-white text-navy-900 py-32 px-6 overflow-hidden relative">
            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    className="mb-20 text-center md:text-left"
                >
                    <h2 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-8 tracking-tighter leading-[0.9] text-navy-900">
                        Our <span className="text-blue-600 italic">Services</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-navy-900/60 max-w-3xl mb-12 font-medium leading-relaxed">
                        We simplify air cargo logistics with reliable propeller-driven transport and transparent, easy-to-use technology.
                    </p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-20">
                        <button onClick={() => window.location.href = '/dashboard/new-booking'} className="group px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-500 transition-all shadow-2xl flex items-center gap-3">
                            Start Booking
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </motion.div>


                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
                    {serviceCategories.map((category, idx) => (
                        <Link key={category.slug} href={`/services/${category.slug}`}>
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{
                                    delay: idx * 0.1,
                                    duration: 0.8,
                                    ease: [0.23, 1, 0.32, 1]
                                }}
                                className="group rounded-[2.5rem] sm:rounded-[3rem] bg-gray-50 border border-gray-100 hover:border-blue-600/30 transition-all duration-700 hover:shadow-premium-xl relative overflow-hidden h-[400px] sm:h-[500px]"
                            >
                                {/* Background Image */}
                                <div
                                    className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${category.image})` }}
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 z-10 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                                <div className="relative z-20 h-full flex flex-col justify-end p-8 sm:p-12">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white mb-6 shadow-premium group-hover:scale-110 transition-transform duration-500">
                                        {category.icon}
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-white">{category.title}</h3>
                                    <p className="text-lg text-white/70 leading-relaxed font-medium">
                                        {category.description}
                                    </p>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* Expertise Tag Cloud - Marquee */}
                <div className="relative pt-20 border-t border-gray-100/50 overflow-hidden flex flex-col gap-6">
                    <div className="flex overflow-hidden whitespace-nowrap">
                        <motion.div
                            className="flex gap-6 pr-6"
                            animate={{ x: [0, -2000] }}
                            transition={{
                                x: { repeat: Infinity, duration: 60, ease: "linear" }
                            }}
                        >
                            {[...expertiseTags, ...expertiseTags, ...expertiseTags, ...expertiseTags].map((tag, i) => (
                                <div key={i} className="flex items-center gap-2 text-[10px] text-navy-900/40 font-black uppercase tracking-[0.3em] px-8 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 whitespace-nowrap">
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
