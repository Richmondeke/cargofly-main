"use client";

import { useState, useEffect } from "react";
import TransitionLink from "@/components/TransitionLink";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

import { slideDown } from "@/lib/animations";

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        handleScroll(); // Check on mount
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const pathname = usePathname();

    const navLinks = [
        { name: "About", href: "/about" },
        { name: "FAQs", href: "/faqs" },
        { name: "Contact Sales", href: "/contact" },
        { name: "Blog", href: "/blog" },
    ];

    if (pathname === "/login" || pathname === "/register") {
        return null;
    }

    return (
        <motion.nav
            initial="hidden"
            animate="visible"
            variants={slideDown}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-transparent",
                scrolled
                    ? "bg-white dark:bg-background-dark border-navy-900/10 dark:border-white/10 py-spacing-05 shadow-md"
                    : "bg-transparent pt-8 pb-4 md:pt-12 md:pb-6"
            )}
        >
            <div className="container mx-auto px-spacing-06 flex items-center justify-between">
                {/* Logo */}
                {/* Logo */}
                <TransitionLink href="/" className="relative z-50 flex items-center gap-2 group">
                    <div className="relative w-32 md:w-40 h-10 md:h-12">
                        {/* Dark Mode Logo (White) - Visible when dark OR when transparent navbar on dark hero (default) */}
                        <Image
                            src="/logo-dark.png"
                            alt="Caverton Helicopters"
                            fill
                            className={cn(
                                "object-contain transition-opacity duration-300",
                                // Show white logo if:
                                // 1. Dark mode active
                                // 2. Not scrolled (transparent bg on dark hero)
                                (theme === "dark" || !scrolled) ? "opacity-100" : "opacity-0"
                            )}
                            priority
                        />
                        {/* Light Mode Logo (Blue) - Visible ONLY when scrolled on light mode */}
                        <Image
                            src="/logo-light.png"
                            alt="Caverton Helicopters"
                            fill
                            className={cn(
                                "object-contain transition-opacity duration-300 absolute inset-0",
                                (theme === "light" && scrolled) ? "opacity-100" : "opacity-0"
                            )}
                            priority
                        />
                    </div>
                </TransitionLink>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <div className="flex items-center gap-6">
                        {navLinks.map((link) => {
                            const isActive =
                                pathname === link.href ||
                                (link.href !== "/" && pathname.startsWith(link.href));
                            return (
                                <TransitionLink
                                    key={link.name}
                                    href={link.href}
                                    className={cn(
                                        "text-sm font-body font-medium tracking-wide transition-colors uppercase relative py-2",
                                        isActive
                                            ? "text-gold-500 dark:text-gold-400"
                                            : scrolled
                                                ? "text-navy-900/70 dark:text-white/70 hover:text-navy-900 dark:hover:text-white"
                                                : "text-white/90 hover:text-white"
                                    )}
                                >
                                    {link.name}
                                    {isActive && (
                                        <motion.span
                                            layoutId="navbar-indicator"
                                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold-500"
                                        />
                                    )}
                                </TransitionLink>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className={cn(
                                "p-2 rounded-full transition-colors",
                                scrolled
                                    ? "text-navy-900 dark:text-white hover:bg-navy-900/5 dark:hover:bg-white/10"
                                    : "text-white hover:bg-white/10"
                            )}
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <TransitionLink
                            href="/login"
                            className={cn(
                                "text-sm font-body transition-colors border border-white/30 px-6 py-2 rounded-lg hover:bg-white/10",
                                scrolled
                                    ? "text-navy-900 border-navy-900/30 dark:text-white dark:border-white/30"
                                    : "text-white"
                            )}
                        >
                            Log in
                        </TransitionLink>
                    </div>

                    <TransitionLink href="/ship">
                        <motion.button
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="relative overflow-hidden group bg-gold-500 text-navy-900 px-6 py-2.5 rounded-lg font-body font-semibold text-base transition-all hover:bg-gold-400 shadow-md"
                        >
                            <span className="relative z-10">Ship Now</span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </motion.button>
                    </TransitionLink>
                </div>

                {/* Mobile Menu Button - Moved right */}
                <div className="flex items-center gap-4 md:hidden">
                    {/* Mobile Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors text-navy-900 dark:text-white"
                    >
                        {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    <button
                        className="z-50 text-navy-900 dark:text-white p-2"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Nav Overlay */}
                <motion.div
                    initial={false}
                    animate={isOpen ? { opacity: 1, visibility: "visible" } : { opacity: 0, visibility: "hidden" }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 bg-white dark:bg-navy-900 z-50 flex flex-col items-center justify-center gap-8 md:hidden"
                >
                    {navLinks.map((link, i) => (
                        <motion.div
                            key={link.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <TransitionLink
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="font-display text-4xl text-navy-900 dark:text-white hover:text-gold-500 dark:hover:text-gold-400 transition-colors"
                            >
                                {link.name}
                            </TransitionLink>
                        </motion.div>
                    ))}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col items-center gap-6 mt-4"
                    >
                        <TransitionLink
                            href="/login"
                            onClick={() => setIsOpen(false)}
                            className="font-display text-2xl text-navy-900/80 dark:text-white/80 hover:text-navy-900 dark:hover:text-white transition-colors"
                        >
                            Sign In
                        </TransitionLink>
                        <TransitionLink
                            href="/register"
                            onClick={() => setIsOpen(false)}
                            className="font-display text-2xl text-navy-900/80 dark:text-white/80 hover:text-navy-900 dark:hover:text-white transition-colors"
                        >
                            Create Account
                        </TransitionLink>

                        <TransitionLink
                            href="/ship"
                            onClick={() => setIsOpen(false)}
                            className="mt-4 bg-gold-500 text-navy-900 px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:shadow-lg transition-all"
                        >
                            Ship Now
                        </TransitionLink>
                    </motion.div>
                </motion.div>
            </div>
        </motion.nav>
    );
}
