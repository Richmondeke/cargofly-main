"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, Plus, HelpCircle } from "lucide-react";

const faqs = [
    {
        question: "What types of cargo services does Cargofly offer?",
        answer: "We offer general air freight, specialized transportation for healthcare supplies, perishables, live animals, and high-value secure cargo. We also provide courier services for documents and emergency 24/7 charters."
    },
    {
        question: "Do you provide same-day or inter-island delivery?",
        answer: "Yes, we specialize in same-day and next-day delivery throughout Hawai'i and the Pacific. Our Kamaka Express service provides exclusive aircraft access for direct delivery to any island."
    },
    {
        question: "How is shipping pricing determined?",
        answer: "Pricing is calculated based on a combination of weight and dimensions (dimensional weight) to ensure fair rates. Minimum fees apply to certain routes and cargo types."
    },
    {
        question: "Can I ship oversized or hazardous items?",
        answer: "Absolutely. We have expert handling for unique and specialized cargo, including oversized machinery and hazardous materials, with customized logistics solutions for every shipment."
    },
    {
        question: "Are there partnerships for retail shipping?",
        answer: "Yes, we partner with major retailers like Home Depot and Lowe's. You can arrange delivery to our facility, and we'll handle the air freight to your destination island for local pickup."
    },
    {
        question: "What are your operating hours and liability?",
        answer: "Our operations typically run from 5:30 AM to 4:30 PM on weekdays. Please note that Cargofly is not liable for concealed damage within original packaging."
    }
];

export default function FAQ() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <section id="faq" className="py-24 bg-white">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 text-gold-600 font-bold text-sm uppercase tracking-wider mb-4"
                    >
                        <HelpCircle className="w-4 h-4" />
                        Common Questions
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-navy-900 mb-4">
                        Shipping <span className="text-gold-500">FAQ</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Everything you need to know about our global logistics and Hawaii inter-island services.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="relative"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <motion.div
                                animate={{
                                    backgroundColor: hoveredIndex === index ? "rgba(10, 25, 47, 0.02)" : "rgba(255, 255, 255, 1)",
                                    borderColor: hoveredIndex === index ? "rgba(202, 138, 4, 0.3)" : "rgba(0, 0, 0, 0.05)"
                                }}
                                className="border rounded-2xl p-6 transition-all duration-300 cursor-default"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className={`text-lg font-bold transition-colors ${hoveredIndex === index ? "text-gold-600" : "text-navy-900"}`}>
                                        {faq.question}
                                    </h3>
                                    <motion.div
                                        animate={{ rotate: hoveredIndex === index ? 45 : 0 }}
                                        className={`p-1 rounded-full ${hoveredIndex === index ? "bg-gold-500 text-navy-900" : "bg-gray-100 text-gray-400"}`}
                                    >
                                        <Plus className="w-5 h-5" />
                                    </motion.div>
                                </div>

                                <AnimatePresence>
                                    {hoveredIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pt-4 text-gray-600 leading-relaxed">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
