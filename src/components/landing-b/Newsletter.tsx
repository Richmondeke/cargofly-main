"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function Newsletter() {
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Subscribed: ${email}`);
        setEmail("");
    };

    return (
        <section className="py-24 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-end">
                    {/* Left: Content */}
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-bold text-navy-900 leading-tight mb-6"
                        >
                            Get updates and <br />
                            insights in your inbox.
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-gray-600 text-lg max-w-md leading-relaxed"
                        >
                            Join our mailing list to get updates on our new and existing products.
                            We also share early insights and news around the logistics space.
                        </motion.p>
                    </div>

                    {/* Right: Form */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="w-full"
                        >
                            <h3 className="text-2xl font-bold text-navy-900 mb-8">Subscribe to our newsletter</h3>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="email" className="text-sm font-bold text-navy-900 uppercase tracking-wider">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="Enter your email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-lg"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl hover:bg-blue-700 transition-all hover:shadow-xl hover:shadow-blue-600/20 active:scale-[0.98]"
                                >
                                    Subscribe
                                </button>
                                <p className="text-gray-400 text-sm">
                                    We will only use your email address for the purpose of this newsletter.
                                    Please review our <a href="#" className="text-blue-600 underline">Privacy Notice</a> for more information.
                                </p>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
