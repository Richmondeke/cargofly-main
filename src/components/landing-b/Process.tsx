"use client";

import { motion } from "framer-motion";

const steps = [
    {
        title: "Digital Booking",
        description: "Secure your shipment space instantly via our digital portal or dedicated account managers. Real-time availability and transparent pricing.",
        number: "1"
    },
    {
        title: "Compliance & Clearance",
        description: "Our experts handle complex customs documentation and regulatory compliance across West Africa, ensuring zero delays at the border.",
        number: "2"
    },
    {
        title: "Express Delivery",
        description: "Real-time tracking and optimized routing ensure your cargo reaches its destination safely, with last-mile precision and accountability.",
        number: "3"
    }
];

export default function Process() {
    return (
        <section className="py-24 bg-white text-navy-900 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="mb-20"
                >
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Our Process</h2>
                    <p className="text-xl md:text-2xl text-gray-600 max-w-2xl text-pretty">
                        We move cargo with precision. Our end-to-end logistics process is engineered for speed, transparency, and reliability across the continent.
                    </p>
                </motion.div>

                <div className="space-y-4 md:space-y-6">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{
                                scale: 1.005,
                                backgroundColor: "rgba(1, 111, 255, 0.03)",
                            }}
                            className="group flex flex-col md:flex-row items-start md:items-center border border-gray-100 bg-gray-50 p-8 md:p-12 gap-8 md:gap-16 transition-all duration-300 rounded-[2rem] cursor-default hover:border-blue-600/20 hover:shadow-premium"
                        >
                            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-navy-900 text-white font-mono text-xl font-bold border border-blue-600/30 group-hover:bg-navy-800 transition-all duration-500 shadow-glow">
                                {step.number}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl md:text-4xl font-bold mb-4 group-hover:text-blue-600 transition-colors tracking-tight">
                                    {step.title}
                                </h3>
                                <p className="text-lg md:text-xl text-gray-600 max-w-3xl leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                            <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <motion.div
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    className="text-blue-600"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
