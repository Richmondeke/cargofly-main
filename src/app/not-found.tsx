'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white dark:bg-navy-900 flex flex-col items-center justify-center p-6 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl w-full"
            >
                <div className="relative w-full aspect-video mb-12 rounded-3xl overflow-hidden shadow-2xl shadow-navy-900/10 dark:shadow-black/50">
                    <Image
                        src="/images/404.png"
                        alt="404 - Page Flight Path Not Found"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/40 to-transparent" />
                </div>

                <h1 className="text-4xl md:text-5xl font-humanist font-bold text-navy-900 dark:text-white mb-6">
                    Flight Path Not Found
                </h1>

                <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-lg mx-auto leading-relaxed">
                    The coordinates you're looking for aren't in our flight plan. Let's get you back on course to the main terminal.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center px-8 py-4 bg-navy-900 dark:bg-white text-white dark:text-navy-900 rounded-xl font-medium transition-all hover:scale-105 active:scale-95 shadow-xl shadow-navy-900/20 dark:shadow-white/10"
                >
                    Return to Base
                </Link>
            </motion.div>
        </div>
    );
}
