"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTA() {
    return (
        <section className="py-24 bg-white px-6">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative bg-navy-900 rounded-[3rem] p-12 md:p-24 overflow-hidden group shadow-premium-xl"
                >
                    {/* Background Patterns */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-navy-800/50 rounded-full border border-white/5 -translate-x-1/2 translate-y-1/2" />

                    <div className="relative z-10 flex flex-col items-start max-w-2xl">
                        <div className="bg-blue-600 text-white px-8 py-10 rounded-3xl shadow-xl mb-12 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                                Unlock scalable logistics for your business in Africa.
                            </h2>
                        </div>

                        <Link
                            href="/login"
                            className="group flex items-center gap-4 text-white text-xl font-bold bg-white/5 hover:bg-white/10 px-8 py-4 rounded-full border border-white/10 transition-all duration-300"
                        >
                            Create an account
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-navy-900 group-hover:translate-x-2 transition-transform duration-300">
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </Link>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-1/2 right-12 -translate-y-1/2 hidden lg:flex flex-col gap-4 opacity-20">
                        {[1, 2, 3].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{ x: [0, 20, 0] }}
                                transition={{ repeat: Infinity, duration: 3, delay: i * 0.5 }}
                                className="w-64 h-1 bg-white rounded-full"
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
