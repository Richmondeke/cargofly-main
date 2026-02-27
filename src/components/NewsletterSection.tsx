"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeInUp } from "@/lib/animations";

export default function NewsletterSection() {
    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="w-full py-40 border-t border-white/10 relative z-10"
        >
            <div className="container mx-auto px-spacing-06 flex justify-center">
                <div className="w-full max-w-2xl bg-white/5 rounded-[40px] p-spacing-10 border border-white/10 backdrop-blur-sm text-center shadow-2xl">
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-spacing-06 tracking-tight">
                        Stay Updated
                    </h2>
                    <p className="text-white/70 font-body text-base md:text-lg leading-relaxed mb-spacing-10 max-w-md mx-auto">
                        Subscribe for exclusive updates and premium shipping offers delivered straight to your inbox.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder:text-white/30 focus:outline-none focus:border-gold-500/50 transition-all font-body text-base"
                        />
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="shrink-0 bg-gold-500 text-navy-900 px-10 py-4 rounded-2xl font-bold text-base uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/20"
                        >
                            Subscribe
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
