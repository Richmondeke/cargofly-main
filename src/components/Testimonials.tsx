"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { fadeInUp } from "@/lib/animations";

interface Testimonial {
    id: string;
    name: string;
    role: string;
    company: string;
    image: string;
    content: string;
    rating: number;
}

const testimonials: Testimonial[] = [
    {
        id: "1",
        name: "Adebayo Ogunlesi",
        role: "CEO",
        company: "Lagos Textiles Ltd",
        image: "/images/testimonial-1.png",
        content:
            "Cargofly transformed our export operations. The speed and reliability of their air freight service has helped us expand into new markets across Europe. Truly premium service.",
        rating: 5,
    },
    {
        id: "2",
        name: "Amara Diallo",
        role: "Supply Chain Director",
        company: "West Africa Pharma",
        image: "/images/testimonial-2.png",
        content:
            "When it comes to temperature-sensitive pharmaceutical shipments, we trust only Cargofly. Their real-time tracking and handling procedures are exactly what our industry demands.",
        rating: 5,
    },
    {
        id: "3",
        name: "Emmanuel Okonkwo",
        role: "Managing Director",
        company: "Continental Oil & Gas",
        image: "/images/testimonial-3.png",
        content:
            "The white-glove service and attention to detail sets Cargofly apart. For critical equipment shipments to our offshore operations, they deliver every time without fail.",
        rating: 5,
    },
    {
        id: "4",
        name: "Fatima Hassan",
        role: "Founder",
        company: "Abuja Fashion House",
        image: "/images/testimonial-4.png",
        content:
            "As a luxury fashion brand, presentation matters. Cargofly understands this. Our garments arrive to international buyers in perfect condition, every single time.",
        rating: 5,
    },
];

export default function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 300 : -300,
            opacity: 0,
        }),
    };

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setCurrentIndex((prev) =>
            newDirection > 0
                ? (prev + 1) % testimonials.length
                : (prev - 1 + testimonials.length) % testimonials.length
        );
    };

    // Auto-advance
    useEffect(() => {
        const timer = setInterval(() => paginate(1), 6000);
        return () => clearInterval(timer);
    }, []);

    const current = testimonials[currentIndex];

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="relative"
        >
            <div className="bg-slate-50 dark:bg-white/5 backdrop-blur-md rounded-3xl p-8 md:p-12 overflow-hidden border border-slate-200 dark:border-white/10">
                {/* Quote Icon */}
                <div className="absolute top-8 right-8 opacity-10">
                    <Quote className="w-24 h-24 text-gold-500" />
                </div>

                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={current.id}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="relative z-10"
                    >
                        {/* Rating */}
                        <div className="flex gap-1 mb-6">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={cn(
                                        "w-5 h-5",
                                        i < current.rating
                                            ? "fill-gold-400 text-gold-400"
                                            : "text-slate-300 dark:text-white/20"
                                    )}
                                />
                            ))}
                        </div>

                        {/* Content */}
                        <blockquote className="font-body text-xl md:text-2xl text-navy-900 dark:text-white/90 leading-relaxed mb-8 max-w-3xl">
                            &ldquo;{current.content}&rdquo;
                        </blockquote>

                        {/* Author */}
                        <div className="flex items-center gap-4">
                            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-gold-500/30">
                                <Image
                                    src={current.image}
                                    alt={current.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <p className="font-display text-lg text-navy-900 dark:text-white">{current.name}</p>
                                <p className="text-sm text-navy-900/60 dark:text-white/40 font-body">
                                    {current.role}, {current.company}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-10 pt-8 border-t border-navy-900/10 dark:border-white/10">
                    {/* Dots */}
                    <div className="flex gap-2">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setDirection(i > currentIndex ? 1 : -1);
                                    setCurrentIndex(i);
                                }}
                                className={cn(
                                    "w-2 h-2 rounded-full transition-all",
                                    i === currentIndex
                                        ? "w-8 bg-gold-500"
                                        : "bg-navy-900/20 dark:bg-white/20 hover:bg-navy-900/40 dark:hover:bg-white/40"
                                )}
                                aria-label={`Go to testimonial ${i + 1}`}
                            />
                        ))}
                    </div>

                    {/* Arrows */}
                    <div className="flex gap-2">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => paginate(-1)}
                            className="w-10 h-10 rounded-full bg-navy-900/5 dark:bg-white/5 border border-navy-900/10 dark:border-white/10 flex items-center justify-center text-navy-900/60 dark:text-white/60 hover:text-gold-500 dark:hover:text-gold-400 hover:border-gold-500/50 transition-colors"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => paginate(1)}
                            className="w-10 h-10 rounded-full bg-navy-900/5 dark:bg-white/5 border border-navy-900/10 dark:border-white/10 flex items-center justify-center text-navy-900/60 dark:text-white/60 hover:text-gold-500 dark:hover:text-gold-400 hover:border-gold-500/50 transition-colors"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
