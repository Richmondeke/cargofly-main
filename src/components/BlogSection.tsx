"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const BLOG_POSTS = [
    {
        tag: "Feature",
        title: "How Our AI Tracking Algorithm Works for Drivers and Businesses",
        author: "Relane Olaon",
        date: "10 Dec 2024",
        image: "/images/dashboard-banner.png",
    },
    {
        tag: "News",
        title: "How Syncsafe is Resolving Driver-Business Parentships in Logistics",
        author: "David Lora",
        date: "15 Dec 2024",
        image: "/images/hero-aircraft.png",
    },
    {
        tag: "Tips",
        title: "Creating the Perfect Driver Profile: Tips to Land More Jobs",
        author: "Sarah Johnson",
        date: "18 Dec 2024",
        image: "/images/ground-crew.png",
    }
];

export default function BlogSection() {
    return (
        <section className="py-40 bg-transparent relative z-10 border-t border-white/10">
            <div className="container mx-auto px-spacing-06">
                <div className="flex flex-col items-center text-center mb-spacing-10 max-w-3xl mx-auto">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-white/50 font-body text-xs uppercase tracking-[0.2em] mb-spacing-05"
                    >
                        Insights & Updates
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="font-display text-4xl md:text-5xl font-bold text-white mb-spacing-06 tracking-tight"
                    >
                        Latest From the Sky
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                        className="text-white/70 text-base md:text-lg leading-relaxed font-body"
                    >
                        Expert analysis on global logistics trends, AI-powered tracking breakthroughs,
                        and tips for optimizing your supply chain.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {BLOG_POSTS.map((post, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
                            className="bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl border border-white/10 group cursor-pointer hover:bg-white/10 transition-colors"
                        >
                            <div className="p-8">
                                <span className="inline-block px-4 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase rounded-md mb-4 group-hover:bg-[#003399] group-hover:text-white transition-colors">
                                    {post.tag}
                                </span>
                                <h3 className="text-white font-bold text-lg leading-tight mb-4 group-hover:text-blue-200 transition-colors">
                                    {post.title}
                                </h3>
                                <p className="text-slate-300 text-xs font-body mb-6 text-left">
                                    By <span className="text-white font-bold underline">{post.author}</span> on {post.date}
                                </p>

                                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-inner bg-slate-800">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {/* Gradient overlay to match the abstract look */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-navy-900/40 to-transparent" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
