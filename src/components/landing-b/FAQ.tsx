"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";

const faqs = [
    {
        question: "How does Cargofly track my shipments?",
        answer: "We use real-time GPS and satellite tracking to give you the exact location of your cargo at all times."
    },
    {
        question: "Do you handle urgent or emergency deliveries?",
        answer: "Yes. Our team handles time-sensitive shipments 24/7. We prioritize these items to ensure they arrive as quickly as possible."
    },
    {
        question: "Where do you ship to?",
        answer: "We operate across West Africa and connect directly to major hubs in Europe, Asia, and North America."
    },
    {
        question: "How do you calculate shipping costs?",
        answer: "Our pricing is based on the weight and size of your cargo, how fast you need it delivered, and the specific delivery location."
    },
    {
        question: "Can I see the tracking data in my own systems?",
        answer: "Yes. We provide an API that allows you to easily sync our tracking data directly into your company's own software."
    }
];


export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section id="faq" className="py-32 bg-gray-50 text-navy-900 px-6 relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/images/pattern-dots.svg')] bg-[size:20px_20px]" />

            <div className="max-w-4xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/10 text-blue-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 border border-blue-600/20">
                        <HelpCircle className="w-3.5 h-3.5" />
                        FAQs
                    </div>
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[0.9] text-navy-900">
                        Frequently Asked <span className="text-blue-600 italic">Questions</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-navy-900/60 max-w-2xl mx-auto font-medium leading-relaxed">
                        Everything you need to know about our global logistics and cargo services.
                    </p>

                </motion.div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.8,
                                delay: index * 0.1,
                                ease: [0.23, 1, 0.32, 1]
                            }}
                            className="group"
                        >
                            <button
                                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                className={`w-full text-left p-8 md:p-10 rounded-[2.5rem] transition-all duration-500 border ${activeIndex === index
                                    ? "bg-white border-blue-600/30 shadow-premium-xl"
                                    : "bg-white border-gray-100/50 hover:border-blue-600/30 shadow-premium"
                                    }`}
                            >
                                <div className="flex items-center justify-between gap-6">
                                    <h3 className={`text-xl md:text-2xl font-bold transition-colors duration-500 ${activeIndex === index ? "text-blue-600" : "text-navy-900"
                                        }`}>
                                        {faq.question}
                                    </h3>
                                    <div className={`p-2 rounded-2xl transition-all duration-500 shrink-0 ${activeIndex === index ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400 group-hover:bg-blue-600/10 group-hover:text-blue-600"
                                        }`}>
                                        {activeIndex === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {activeIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pt-8 text-lg md:text-xl text-navy-900/60 leading-relaxed font-medium">
                                                {faq.answer}
                                            </div>

                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
