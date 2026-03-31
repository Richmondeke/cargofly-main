"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { productsData } from '@/lib/services-data';
import Header from '@/components/landing-b/Header';
import Footer from '@/components/Footer';
import { fadeInUp, staggerContainer, scaleIn } from '@/lib/animations';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const product = productsData[slug];

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white text-navy-900">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
                    <button
                        onClick={() => router.push('/')}
                        className="text-blue-600 hover:underline flex items-center gap-2 justify-center"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white text-navy-900 overflow-x-hidden">
            <Header />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 bg-navy-950 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 rotate-12 translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="max-w-4xl"
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 text-gold-400 font-bold text-xs uppercase tracking-widest mb-8">
                            <Link href="/" className="hover:underline flex items-center gap-1">
                                <ArrowLeft className="w-3 h-3" /> Solutions
                            </Link>
                            <span className="opacity-20 text-white">/</span>
                            <span>{product.title}</span>
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
                            {product.title}
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-white/60 font-medium leading-relaxed mb-12">
                            {product.fullDescription}
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                            <Link href="/dashboard">
                                <button className="px-10 py-5 bg-gold-500 text-navy-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all shadow-xl flex items-center gap-3">
                                    Launch Interface
                                    <Zap className="w-4 h-4" />
                                </button>
                            </Link>
                            <button className="px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-white/20 transition-all">
                                Request Demo
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Product Stats */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 -mt-32 relative z-20">
                        {product.stats.map((stat) => (
                            <motion.div
                                key={stat.label}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={scaleIn}
                                className="p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-premium text-center"
                            >
                                <p className="text-5xl font-bold text-blue-600 mb-2">{stat.value}</p>
                                <p className="text-xs font-bold text-navy-900/40 uppercase tracking-[0.2em]">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Ecosystem Features</h2>
                            <div className="space-y-6">
                                {product.features.map((feature) => (
                                    <div key={feature} className="flex items-start gap-4">
                                        <div className="mt-1 bg-blue-600/10 p-1 rounded-full">
                                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <p className="text-lg font-medium text-gray-600">{feature}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={scaleIn}
                            className="bg-gray-50 rounded-[3rem] p-12 border border-blue-600/10 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-5 text-blue-600">
                                {product.icon}
                            </div>
                            <h3 className="text-3xl font-bold mb-8 italic text-blue-600">Platform Excellence</h3>
                            <div className="space-y-10">
                                {product.benefits.map((benefit) => (
                                    <div key={benefit.title}>
                                        <h4 className="text-xl font-bold mb-2 uppercase tracking-widest text-navy-900">{benefit.title}</h4>
                                        <p className="text-gray-500 leading-relaxed font-medium">{benefit.description}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6">
                <div className="max-w-5xl mx-auto rounded-[4rem] bg-navy-950 p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(1,111,255,0.1),transparent)]" />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative z-10"
                    >
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 leading-tight">
                            The Future of Logistics <br />is <span className="text-gold-400">Digital</span>.
                        </h2>
                        <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto font-medium">
                            Join the growing ecosystem of forward-thinking logistics providers using CargoOS to dominate their markets.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/dashboard">
                                <button className="w-full sm:w-auto px-12 py-6 bg-gold-500 text-navy-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all shadow-2xl">
                                    Get Started Free
                                </button>
                            </Link>
                            <Link href="/demo">
                                <button className="w-full sm:w-auto px-12 py-6 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-white/20 transition-all">
                                    Watch Deep Dive
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
