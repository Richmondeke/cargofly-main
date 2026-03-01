'use client';

import { motion } from 'framer-motion';
import { useTransition } from '@/contexts/TransitionContext';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
    const { isExiting } = useTransition();
    const pathname = usePathname();

    // Very smooth custom cubic bezier matching premium modern web transitions
    const transitionTiming = { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const };

    // Dashboard routes usually don't need complex page transitions, might be disruptive
    // But we'll apply a subtle one there or just apply standard globally for now.
    const isDashboard = pathname?.startsWith('/dashboard');

    if (isDashboard) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                {children}
            </motion.div>
        )
    }

    // Define the sleek slide-up & scale effect
    const variants = {
        initial: {
            opacity: 0,
            y: 30, // slide up from slightly below
            scale: 0.98, // slight zoom in
            filter: 'blur(4px)',
        },
        enter: {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            transition: transitionTiming,
        },
        exit: {
            opacity: 0,
            y: -20, // slide up out
            scale: 0.98,
            filter: 'blur(4px)',
            transition: transitionTiming,
        },
    };

    return (
        <motion.div
            variants={variants}
            initial="initial"
            animate={isExiting ? 'exit' : 'enter'}
            // By using isExiting, we trigger the exit variant *before* the component unmounts
            className="will-change-transform will-change-opacity will-change-filter"
        >
            {children}
        </motion.div>
    );
}
