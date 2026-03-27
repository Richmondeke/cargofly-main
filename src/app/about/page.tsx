"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Globe,
    Award,
    Users,
    Building2,
    ArrowRight,
    TrendingUp,
    ShieldCheck,
    Plane,
} from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";
import {
    fadeInUp,
    fadeInLeft,
    fadeInRight,
    staggerContainer
} from "@/lib/animations";


const values = [
    {
        icon: <ShieldCheck className="w-6 h-6" />,
        title: "Uncompromising Safety",
        description:
            "Safety is not just a policy; it's our culture. We adhere to the highest international aviation safety standards.",
    },
    {
        icon: <Award className="w-6 h-6" />,
        title: "Premium Excellence",
        description:
            "We don't just move cargo; we deliver an experience. White-glove service standard on every shipment.",
    },
    {
        icon: <TrendingUp className="w-6 h-6" />,
        title: "Innovation First",
        description:
            "Leveraging cutting-edge technology to provide real-time visibility and efficient logistics solutions.",
    },
    {
        icon: <Users className="w-6 h-6" />,
        title: "Client-Centric",
        description:
            "Your success is our priority. We build long-term partnerships based on trust and reliability.",
    },
];

const offices = [
    {
        city: "Lagos",
        country: "Nigeria",
        address: "Murtala Muhammed International Airport, Ikeja",
        type: "Global Headquarters",
    },
    {
        city: "London",
        country: "United Kingdom",
        address: "Heathrow Cargo Centre, Hounslow",
        type: "European Hub",
    },
    {
        city: "Dubai",
        country: "UAE",
        address: "Dubai Logistics City, DWC",
        type: "Middle East Hub",
    },
    {
        city: "Houston",
        country: "USA",
        address: "George Bush Intercontinental Airport",
        type: "Americas Hub",
    },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen pt-32 pb-24 bg-white dark:bg-navy-900 transition-colors duration-500">
            {/* Background */}
            <div className="fixed inset-0 z-0 bg-white dark:bg-navy-900" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="text-center mb-24"
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-gold-500/10 text-gold-400 text-xs font-bold tracking-[0.2em] uppercase mb-6 font-body">
                        Our Story
                    </span>
                    <h1 className="font-display text-4xl md:text-5xl text-navy-900 dark:text-white mb-6">
                        Redefining Aviation
                        <span className="block italic text-navy-900/80 dark:text-white/80">Logistics</span>
                    </h1>
                    <p className="text-navy-900/60 dark:text-white/60 max-w-2xl mx-auto font-body text-lg leading-relaxed">
                        As a subsidiary of the Caverton Offshore Support Group, Cargofly brings
                        decades of aviation excellence to the air cargo industry.
                    </p>
                </motion.div>

                {/* Story Section */}
                <section className="mb-32">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInLeft}
                            className="relative aspect-square lg:aspect-auto lg:h-[600px] rounded-3xl overflow-hidden"
                        >
                            <Image
                                src="/images/aircraft-loading.png"
                                alt="Caverton Cargo Aircraft Loading"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-transparent" />
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInRight}
                        >
                            <h2 className="font-display text-3xl md:text-4xl text-white mb-6">
                                A Legacy of
                                <span className="block italic text-white/80">Distinctive Service</span>
                            </h2>
                            <div className="space-y-6 text-white/60 font-body leading-relaxed">
                                <p>
                                    Established to bridge the gap in premium air cargo services across West
                                    Africa, Cargofly leverages the extensive aviation infrastructure and
                                    expertise of the Caverton Group.
                                </p>
                                <p>
                                    What started as a specialized service to support our oil and gas
                                    operations has grown into a premier logistics provider, connecting
                                    businesses in Nigeria to global markets with unprecedented speed and
                                    reliability.
                                </p>
                                <p>
                                    Today, we operate a dedicated fleet of cargo aircraft and partner with
                                    major global carriers to offer seamless door-to-door solutions for time-critical
                                    and high-value shipments.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-8 mt-12">
                                <div>
                                    <h3 className="font-display text-4xl text-white mb-2">2010</h3>
                                    <p className="text-sm text-white/40 font-body uppercase tracking-wider">
                                        Established
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-display text-4xl text-white mb-2">24h</h3>
                                    <p className="text-sm text-white/40 font-body uppercase tracking-wider">
                                        Ops Center
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Stats */}
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="mb-32 py-12 border-y border-white/5 bg-white/5 rounded-3xl"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <AnimatedCounter value={500} suffix="+" label="Companies Served" />
                        <AnimatedCounter value={15} suffix="+" label="Years Experience" />
                        <AnimatedCounter value={50} suffix="k+" label="Tons Delivered" />
                        <AnimatedCounter value={100} suffix="%" label="Safety Record" />
                    </div>
                </motion.section>

                {/* Values */}
                <section className="mb-32">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-gold-500/10 text-gold-400 text-xs font-bold tracking-[0.2em] uppercase mb-6 font-body">
                            Our Core Values
                        </span>
                        <h2 className="font-display text-3xl md:text-4xl text-white">
                            The Cargofly
                            <span className="block italic text-white/80">Standard</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition-colors group rounded-3xl"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center mb-6 group-hover:bg-gold-500/30 transition-colors">
                                    <div className="text-gold-400">{value.icon}</div>
                                </div>
                                <h3 className="font-display text-xl text-white mb-3">
                                    {value.title}
                                </h3>
                                <p className="text-white/60 text-sm font-body leading-relaxed">
                                    {value.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* Global Presence */}
                <section className="mb-32">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInLeft}
                        >
                            <span className="inline-block py-1 px-3 rounded-full bg-gold-500/10 text-gold-400 text-xs font-bold tracking-[0.2em] uppercase mb-6 font-body">
                                Global Network
                            </span>
                            <h2 className="font-display text-3xl md:text-4xl text-white mb-6">
                                Connected to the
                                <span className="block italic text-white/80">World</span>
                            </h2>
                            <p className="text-white/60 font-body leading-relaxed mb-10">
                                Strategically positioned hubs in key global trade centers ensure your cargo
                                moves efficiently across continents. Our network is constantly expanding to
                                serve you better.
                            </p>

                            <div className="space-y-6">
                                {offices.map((office, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-navy-800 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
                                            <Globe className="w-4 h-4 text-gold-400" />
                                        </div>
                                        <div>
                                            <div className="flex items-baseline gap-2 mb-1">
                                                <h4 className="font-display text-lg text-white">
                                                    {office.city}
                                                </h4>
                                                <span className="text-xs uppercase tracking-wider text-gold-400 font-body">
                                                    {office.type}
                                                </span>
                                            </div>
                                            <p className="text-white/40 text-sm font-body">
                                                {office.address}, {office.country}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInRight}
                            className="relative h-[600px] rounded-3xl overflow-hidden bg-white/5 border border-white/10"
                        >
                            {/* Abstract Map Visualization */}
                            <div className="absolute inset-0 bg-navy-900">
                                {/* Dots representing hubs */}
                                {offices.map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute w-3 h-3 rounded-full bg-gold-400 animate-pulse"
                                        style={{
                                            top: `${20 + i * 20}%`,
                                            left: `${30 + i * 15}%`,
                                            boxShadow: "0 0 20px rgba(202, 138, 4, 0.6)",
                                        }}
                                    />
                                ))}
                                {/* Connecting lines */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                    <path
                                        d="M 30% 20% Q 50% 50% 45% 40% T 60% 60%"
                                        fill="none"
                                        stroke="#CA8A04"
                                        strokeWidth="1"
                                        className="opacity-20"
                                    />
                                </svg>
                            </div>

                            <div className="absolute bottom-8 left-8 right-8 text-center p-6 bg-navy-900 border border-white/10 rounded-2xl">
                                <Plane className="w-8 h-8 text-gold-400 mx-auto mb-4" />
                                <p className="text-white font-body">
                                    Operating regular scheduled flights between Lagos and key European/Middle Eastern hubs.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* CTA */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="text-center"
                >
                    <div className="bg-[#FFCA00]/10 border border-[#FFCA00]/20 rounded-3xl p-12">
                        <h2 className="font-display text-3xl md:text-4xl text-white mb-6">
                            Join Our Team
                        </h2>
                        <p className="text-white/60 font-body max-w-xl mx-auto mb-8">
                            We are always looking for talented individuals to join our growing family.
                        </p>
                        <Link href="/contact">
                            <motion.button
                                whileHover={{ y: -3 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center gap-2 px-10 py-5 bg-white/5 border border-white/10 text-white rounded-xl font-medium uppercase tracking-wider hover:bg-white/10 hover:border-gold-500/50 hover:text-gold-400 transition-all"
                            >
                                View Careers
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
