'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';

export const HeroV2 = () => {
    const router = useRouter();

    return (
        <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Video */}
            <video
                src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50 z-10" />

            {/* Content */}
            <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24">
                <div className="max-w-4xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1]"
                    >
                        Cargofly Air Freight
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl leading-relaxed font-light"
                    >
                        Bypass disruptions with a faster, more frequent, and reliable service.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 mb-10"
                    >
                        <button
                            onClick={() => router.push('/dashboard/new-booking')}
                            className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-slate-100 transition-colors text-lg"
                        >
                            Get instant prices
                        </button>
                        <button
                            onClick={() => router.push('/about')}
                            className="bg-transparent border border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors text-lg"
                        >
                            Contact us
                        </button>
                    </motion.div>

                    {/* Checkmarks */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-wrap items-center gap-6 text-white/90"
                    >
                        <div className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-white" />
                            <span className="font-medium text-lg">Global</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-white" />
                            <span className="font-medium text-lg">Reliable</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-white" />
                            <span className="font-medium text-lg">Owned Fleet</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroV2;
