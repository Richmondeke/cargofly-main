"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Products() {
    return (
        <section id="solutions" className="py-24 bg-white text-navy-900 px-6">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                    className="mb-16 md:mb-24"
                >
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Our Solutions</h2>
                    <p className="text-xl text-gray-600 max-w-2xl">
                        Digital-first logistics infrastructure built for the complexities of modern trade.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 [perspective:1000px]">
                    {/* Air Freight Product Card */}
                    <motion.div
                        initial={{ opacity: 0, rotateX: -10, y: 50 }}
                        whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        whileHover={{
                            scale: 1.02,
                            translateZ: 30,
                            rotateX: 1,
                            rotateY: -1,
                            boxShadow: "0 30px 60px -12px rgba(0, 51, 153, 0.15)"
                        }}
                        className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col items-start cursor-default transition-all duration-300 group overflow-hidden"
                    >
                        <div className="relative w-full aspect-video mb-8 rounded-2xl overflow-hidden border border-gray-100 shadow-inner group-hover:scale-[1.05] transition-transform duration-700">
                            <Image
                                src="/images/illustrations/aircraft_hangar.jpg"
                                alt="Air Freight Solutions"
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                        </div>
                        <h3 className="text-3xl font-bold mb-4 group-hover:text-blue-600 transition-colors">Air Freight Management</h3>
                        <p className="text-gray-600 mb-10 flex-1 text-lg leading-relaxed">
                            Take complete control of your air cargo. Book flights, manage manifest documents, and track shipments across multiple airlines in one unified dashboard.
                        </p>
                        <Link
                            href="/dashboard/new-booking"
                            className="group relative inline-flex items-center gap-2 bg-navy-900 text-white px-8 py-3.5 rounded-full overflow-hidden transition-all duration-300 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-600/20 font-semibold"
                        >
                            <span className="relative z-10">Start Booking</span>
                            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform text-blue-600 group-hover:text-white" />
                            <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </Link>
                    </motion.div>

                    {/* Charter Services Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        whileHover={{
                            scale: 1.01,
                            translateZ: 10,
                            backgroundColor: "rgba(1, 111, 255, 0.05)"
                        }}
                        className="bg-gray-100/50 rounded-3xl p-8 md:p-12 border border-gray-100 border-dashed flex flex-col items-center justify-center text-center inset-0 transition-all duration-300 cursor-default"
                    >
                        <h3 className="text-2xl font-semibold text-gray-500 mb-2">Charter Solutions</h3>
                        <p className="text-gray-600">Dedicated cargo capacity for your most critical logistics needs. Coming soon.</p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
