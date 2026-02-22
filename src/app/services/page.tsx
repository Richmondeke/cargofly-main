"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    Plane,
    Truck,
    Globe,
    Ship,
    Clock,
    Shield,
    Thermometer,
    Package,
    ArrowRight,
    Check,
    Star,
} from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import { cn } from "@/lib/utils";
import {
    staggerContainer,
    fadeInUp,
    scaleIn
} from "@/lib/animations";

const services = [
    {
        icon: <Plane className="w-6 h-6" />,
        title: "Express Air Freight",
        description:
            "Priority air cargo with guaranteed delivery times. Perfect for time-sensitive shipments across continents.",
        features: [
            "Next-day delivery available",
            "Real-time GPS tracking",
            "Customs clearance included",
            "Temperature-controlled options",
        ],
        href: "/ship",
        featured: true,
    },
    {
        icon: <Truck className="w-6 h-6" />,
        title: "Ground Transport",
        description:
            "Reliable overland shipping across West Africa with comprehensive regional coverage.",
        features: [
            "Door-to-door delivery",
            "Flexible scheduling",
            "Bulk shipment options",
            "24/7 tracking support",
        ],
        href: "/ship",
    },
    {
        icon: <Globe className="w-6 h-6" />,
        title: "International Cargo",
        description:
            "Global reach with local expertise. We handle customs, documentation, and last-mile delivery.",
        features: [
            "200+ countries served",
            "Multi-modal solutions",
            "Duty & tax handling",
            "Insurance included",
        ],
        href: "/ship",
    },
    {
        icon: <Ship className="w-6 h-6" />,
        title: "Sea Freight",
        description:
            "Cost-effective ocean freight for heavy or bulk cargo. Full and partial container options.",
        features: [
            "FCL & LCL options",
            "Port-to-port delivery",
            "Container tracking",
            "Competitive rates",
        ],
        href: "/ship",
    },
    {
        icon: <Thermometer className="w-6 h-6" />,
        title: "Temperature Controlled",
        description:
            "Specialized cold chain logistics for pharmaceuticals, perishables, and sensitive cargo.",
        features: [
            "Maintains -25°C to +25°C",
            "Real-time monitoring",
            "GDP compliant",
            "Pharma certified",
        ],
        href: "/ship",
    },
    {
        icon: <Shield className="w-6 h-6" />,
        title: "High-Value Cargo",
        description:
            "Premium security and handling for valuables, art, and high-value goods.",
        features: [
            "Armed escort available",
            "Secure chain of custody",
            "Full insurance coverage",
            "Discreet handling",
        ],
        href: "/ship",
    },
];

const comparisonData = [
    { feature: "Express Air", express: true, standard: true, economy: false },
    { feature: "Ground Transport", express: true, standard: true, economy: true },
    { feature: "Same-Day Pickup", express: true, standard: false, economy: false },
    { feature: "GPS Tracking", express: true, standard: true, economy: true },
    { feature: "Insurance Included", express: true, standard: true, economy: false },
    { feature: "Customs Support", express: true, standard: true, economy: false },
    { feature: "24/7 Support", express: true, standard: false, economy: false },
    { feature: "Signature Required", express: true, standard: true, economy: true },
];

export default function ServicesPage() {
    return (
        <div className="min-h-screen pt-32 pb-24 bg-white dark:bg-navy-900 transition-colors duration-500">
            {/* Background */}
            <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-100 via-white to-gray-50 dark:from-navy-800 dark:via-navy-900 dark:to-black" />
            <div className="fixed inset-0 z-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] dark:invert" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="text-center mb-16"
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-gold-500/10 text-gold-400 text-xs font-bold tracking-[0.2em] uppercase mb-6 font-body">
                        Our Services
                    </span>
                    <h1 className="font-display text-4xl md:text-5xl text-navy-900 dark:text-white mb-4">
                        Premium Logistics
                        <span className="block italic text-navy-900/80 dark:text-white/80">Solutions</span>
                    </h1>
                    <p className="text-navy-900/60 dark:text-white/60 max-w-2xl mx-auto font-body">
                        From express air freight to specialized cold chain logistics, we offer
                        comprehensive shipping solutions tailored to your needs.
                    </p>
                </motion.div>

                {/* Services Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                >
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            variants={fadeInUp}
                        >
                            <ServiceCard {...service} />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Comparison Table */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="mb-24"
                >
                    <div className="text-center mb-12">
                        <span className="inline-block py-1 px-3 rounded-full bg-gold-500/10 text-gold-400 text-xs font-bold tracking-[0.2em] uppercase mb-6 font-body">
                            Compare Plans
                        </span>
                        <h2 className="font-display text-3xl md:text-4xl text-navy-900 dark:text-white">
                            Choose Your Service
                        </h2>
                    </div>

                    <div className="glass-panel rounded-3xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px]">
                                <thead>
                                    <tr className="border-b border-navy-900/10 dark:border-white/10">
                                        <th className="text-left py-6 px-6 font-body font-medium text-navy-900/40 dark:text-white/40 uppercase tracking-wider text-sm">
                                            Features
                                        </th>
                                        <th className="py-6 px-6 font-body font-medium text-gold-500 dark:text-gold-400 uppercase tracking-wider text-sm">
                                            Express
                                            <Star className="inline w-4 h-4 ml-1" />
                                        </th>
                                        <th className="py-6 px-6 font-body font-medium text-navy-900/60 dark:text-white/60 uppercase tracking-wider text-sm">
                                            Standard
                                        </th>
                                        <th className="py-6 px-6 font-body font-medium text-navy-900/40 dark:text-white/40 uppercase tracking-wider text-sm">
                                            Economy
                                        </th>
                                    </tr>
                                </thead>
                                <motion.tbody
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={staggerContainer}
                                >
                                    {comparisonData.map((row, index) => (
                                        <motion.tr
                                            key={index}
                                            variants={fadeInUp}
                                            className="border-b border-navy-900/5 dark:border-white/5 hover:bg-navy-900/5 dark:hover:bg-white/5 transition-colors"
                                        >
                                            <td className="py-4 px-6 font-body text-navy-900 dark:text-white">
                                                {row.feature}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                {row.express ? (
                                                    <Check className="w-5 h-5 text-gold-500 dark:text-gold-400 mx-auto" />
                                                ) : (
                                                    <span className="text-navy-900/20 dark:text-white/20">—</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                {row.standard ? (
                                                    <Check className="w-5 h-5 text-navy-900/60 dark:text-white/60 mx-auto" />
                                                ) : (
                                                    <span className="text-navy-900/20 dark:text-white/20">—</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                {row.economy ? (
                                                    <Check className="w-5 h-5 text-navy-900/40 dark:text-white/40 mx-auto" />
                                                ) : (
                                                    <span className="text-navy-900/20 dark:text-white/20">—</span>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </motion.tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>

                {/* Business Solutions */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="mb-24"
                >
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div variants={fadeInUp}>
                            <span className="inline-block py-1 px-3 rounded-full bg-gold-500/10 text-gold-400 text-xs font-bold tracking-[0.2em] uppercase mb-6 font-body">
                                Enterprise Solutions
                            </span>
                            <h2 className="font-display text-3xl md:text-4xl text-navy-900 dark:text-white mb-6">
                                Scale Your
                                <span className="block italic text-navy-900/80 dark:text-white/80">Business</span>
                            </h2>
                            <p className="text-navy-900/60 dark:text-white/60 font-body leading-relaxed mb-8">
                                Partner with Cargofly for enterprise-grade logistics solutions.
                                Dedicated account management, custom integrations, and volume
                                pricing for businesses of all sizes.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {[
                                    "Dedicated account manager",
                                    "API integrations available",
                                    "Custom SLAs and contracts",
                                    "Volume-based pricing",
                                    "Priority support 24/7",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center">
                                            <Check className="w-3 h-3 text-gold-500 dark:text-gold-400" />
                                        </div>
                                        <span className="text-navy-900/80 dark:text-white/80 font-body">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link href="/contact">
                                <motion.button
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-gold-500 text-navy-900 rounded-xl font-bold uppercase tracking-wider hover:shadow-[0_0_30px_rgba(202,138,4,0.3)] transition-all"
                                >
                                    Contact Sales
                                    <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </Link>
                        </motion.div>

                        <motion.div variants={scaleIn} className="glass-panel rounded-3xl p-8">
                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { value: "500+", label: "Enterprise Clients" },
                                    { value: "99.9%", label: "Uptime SLA" },
                                    { value: "24/7", label: "Support Available" },
                                    { value: "200+", label: "API Integrations" },
                                ].map((stat, i) => (
                                    <div key={i} className="text-center p-6 rounded-xl bg-navy-900/5 dark:bg-white/5">
                                        <p className="font-display text-3xl text-navy-900 dark:text-white mb-2">
                                            {stat.value}
                                        </p>
                                        <p className="text-navy-900/40 dark:text-white/40 text-sm font-body uppercase tracking-wider">
                                            {stat.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="text-center"
                >
                    <div className="glass-panel rounded-3xl p-12 bg-gold-500/10 dark:bg-gold-500/5">
                        <h2 className="font-display text-3xl md:text-4xl text-navy-900 dark:text-white mb-4">
                            Ready to Ship?
                        </h2>
                        <p className="text-navy-900/60 dark:text-white/60 font-body max-w-xl mx-auto mb-8">
                            Get started with a free quote and experience premium logistics.
                        </p>
                        <Link href="/ship">
                            <motion.button
                                whileHover={{ y: -3 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center gap-2 px-10 py-5 bg-gold-500 text-navy-900 rounded-xl font-bold uppercase tracking-wider hover:shadow-[0_0_40px_rgba(202,138,4,0.4)] transition-all"
                            >
                                Get a Quote
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div >
    );
}
