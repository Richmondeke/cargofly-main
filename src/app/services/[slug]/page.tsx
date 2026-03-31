"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { servicesData } from '@/lib/services-data';
import Header from '@/components/landing-b/Header';
import Footer from '@/components/Footer';
import { fadeInUp, staggerContainer, scaleIn } from '@/lib/animations';

export default function ServiceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const service = servicesData[slug];

    if (!service) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white text-navy-900">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
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
            <section className="pt-32 pb-20 px-6 bg-gray-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 rotate-12 translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="max-w-4xl"
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-8">
                            <Link href="/" className="hover:underline flex items-center gap-1">
                                <ArrowLeft className="w-3 h-3" /> Services
                            </Link>
                            <span className="opacity-20">/</span>
                            <span>{service.title}</span>
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
                            {service.title}
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed mb-12">
                            {service.fullDescription}
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                            <Link href="/dashboard/new-booking">
                                <button className="px-10 py-5 bg-navy-900 text-gold-400 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-navy-800 transition-all shadow-xl flex items-center gap-3">
                                    Book This Service
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                            <button className="px-10 py-5 bg-white border border-gray-200 text-navy-900 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-gray-50 transition-all">
                                Download Specs
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Stats & Features */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                        {service.stats.map((stat, idx) => (
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
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Key Capabilities</h2>
                            <div className="space-y-6">
                                {service.features.map((feature) => (
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
                            className="bg-navy-900 rounded-[3rem] p-12 text-white relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-10">
                                {service.icon}
                            </div>
                            <h3 className="text-3xl font-bold mb-8 italic text-gold-400">The Cargofly Advantage</h3>
                            <div className="space-y-10">
                                {service.benefits.map((benefit) => (
                                    <div key={benefit.title}>
                                        <h4 className="text-xl font-bold mb-2 uppercase tracking-widest text-white/90">{benefit.title}</h4>
                                        <p className="text-white/60 leading-relaxed font-medium">{benefit.description}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6">
                <div className="max-w-5xl mx-auto rounded-[4rem] bg-blue-600 p-12 md:p-24 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative z-10"
                    >
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 leading-tight">
                            Optimize Your Supply Chain With {service.title}
                        </h2>
                        <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto font-medium">
                            Join hundreds of enterprises that trust Cargofly for their most critical logistics operations.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/dashboard/new-booking">
                                <button className="w-full sm:w-auto px-12 py-6 bg-white text-navy-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-all shadow-2xl">
                                    Start Shipping
                                </button>
                            </Link>
                            <Link href="/contact">
                                <button className="w-full sm:w-auto px-12 py-6 bg-transparent border-2 border-white/30 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all">
                                    Talk to Sales
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
