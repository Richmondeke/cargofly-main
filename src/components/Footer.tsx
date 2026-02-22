"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    MapPin,
    Phone,
    Mail,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    ArrowRight,
} from "lucide-react";

const footerLinks = {
    company: [
        { name: "About", href: "/about" },
        { name: "Staffing", href: "/staffing" },
        { name: "Drivers", href: "/drivers" },
    ],
    resources: [
        { name: "Insights", href: "/insights" },
        { name: "Support", href: "/support" },
        { name: "Newsletter", href: "/newsletter" },
    ],
    legal: [
        { name: "Cookie Usage", href: "/cookies" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms and Conditions", href: "/terms" },
    ],
};

import { cn } from "@/lib/utils";
import { fadeInUp } from "@/lib/animations";

export default function Footer({ isLanding }: { isLanding?: boolean }) {
    return (
        <motion.footer
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className={cn("relative border-t border-white/5", isLanding ? "bg-transparent" : "bg-navy-900")}
        >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-navy-800/50 via-transparent to-transparent pointer-events-none" />

            <div className="container mx-auto px-spacing-06 relative z-10">
                <div className="py-spacing-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-spacing-09 border-b border-navy-800/50">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <h4 className="font-display text-xs uppercase tracking-widest text-[#003399]/60 mb-spacing-06">Company</h4>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-[#003399] hover:text-blue-500 transition-colors text-sm font-body"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="lg:col-span-2">
                        <h4 className="font-display text-xs uppercase tracking-widest text-[#003399]/60 mb-spacing-06">Resources</h4>
                        <ul className="space-y-3">
                            {footerLinks.resources.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-[#003399] hover:text-blue-500 transition-colors text-sm font-body"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="lg:col-span-2">
                        <h4 className="font-display text-xs uppercase tracking-widest text-[#003399]/60 mb-spacing-06">Legal</h4>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-[#003399] hover:text-blue-500 transition-colors text-sm font-body"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter Section */}
                    <div className="lg:col-span-6 lg:pl-12">
                        <div className="bg-white/5 rounded-3xl p-8 border border-white/10 backdrop-blur-sm">
                            <h3 className="font-display text-2xl text-white mb-2">
                                Stay Updated
                            </h3>
                            <p className="text-white/60 font-body text-sm mb-6">
                                Subscribe for exclusive updates and premium shipping offers.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-gold-500/50 transition-all font-body text-sm"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="shrink-0 bg-gold-500 text-navy-900 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-gold-400 transition-colors"
                                >
                                    Subscribe
                                    <ArrowRight className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-spacing-07 border-t border-navy-900/10 flex flex-col md:flex-row items-center justify-between gap-spacing-05">
                    <p className="text-[#003399]/60 text-xs font-body">
                        (c) Caverton, 2024
                    </p>
                </div>
            </div>

            {/* Animated Iconmark */}
            <motion.div
                className="absolute bottom-20 right-10 pointer-events-none hidden lg:block"
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center">
                    <Image
                        src="/images/iconmark-blue.png"
                        alt="Cargofly"
                        width={80}
                        height={80}
                        className="object-contain opacity-80"
                    />
                </div>
            </motion.div>
        </motion.footer>
    );
}
