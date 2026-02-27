"use client";

import { motion } from "framer-motion";




export default function TrustSection() {
    return (
        <section className="bg-transparent py-40 border-t border-white/10">
            <div className="container mx-auto px-spacing-06">
                <div className="text-center mb-spacing-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="font-display text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
                    >
                        Trusted by freight forwarders, exporters,
                        <br />
                        and growing businesses worldwide.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                        className="text-white/70 text-base md:text-lg leading-relaxed font-body"
                    >
                        Your shipments deserve full visibility, faster processing, and a system you can rely on.
                    </motion.p>
                </div>

                <div className="flex flex-col items-center gap-8">
                    {/* The TagMarquee will follow this section as seen in the screenshot */}
                </div>
            </div>
        </section>
    );
}
