"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Phone, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Input } from './Input';
import { Label } from './Label';

interface Country {
    code: string;
    name: string;
    dial: string;
    flag: string;
}

const countries: Country[] = [
    { code: 'NG', name: 'Nigeria', dial: '+234', flag: '🇳🇬' },
    { code: 'US', name: 'United States', dial: '+1', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', dial: '+44', flag: '🇬🇧' },
    { code: 'CA', name: 'Canada', dial: '+1', flag: '🇨🇦' },
    { code: 'GH', name: 'Ghana', dial: '+233', flag: '🇬🇭' },
    { code: 'ZA', name: 'South Africa', dial: '+27', flag: '🇿🇦' },
    { code: 'AE', name: 'United Arab Emirates', dial: '+971', flag: '🇦🇪' },
    { code: 'DE', name: 'Germany', dial: '+49', flag: '🇩🇪' },
    { code: 'FR', name: 'France', dial: '+33', flag: '🇫🇷' },
    { code: 'CN', name: 'China', dial: '+86', flag: '🇨🇳' },
    { code: 'IN', name: 'India', dial: '+91', flag: '🇮🇳' },
];

interface PhoneInputProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function PhoneInput({
    id,
    label,
    value,
    onChange,
    placeholder,
    className
}: PhoneInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Parse initial value if it contains a dial code
    useEffect(() => {
        if (value) {
            const matched = countries.find(c => value.startsWith(c.dial));
            if (matched) setSelectedCountry(matched);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredCountries = countries.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.dial.includes(search) ||
        c.code.toLowerCase().includes(search.toLowerCase())
    );

    const handleCountrySelect = (country: Country) => {
        // Strip old prefix if there was one
        const numberPart = value.startsWith(selectedCountry.dial)
            ? value.slice(selectedCountry.dial.length).trim()
            : value;

        setSelectedCountry(country);
        onChange(`${country.dial} ${numberPart}`);
        setIsOpen(false);
        setSearch('');
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/[^0-9\s-]/g, '');
        onChange(`${selectedCountry.dial} ${val}`);
    };

    const displayValue = value.startsWith(selectedCountry.dial)
        ? value.slice(selectedCountry.dial.length).trim()
        : value;

    return (
        <div className={cn("space-y-2 relative", className)} ref={wrapperRef}>
            <Label htmlFor={id}>{label}</Label>
            <div className="flex">
                {/* Dial Code Selector */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-3 h-[46px] bg-slate-50 dark:bg-white/5 border border-r-0 border-slate-200 dark:border-white/10 rounded-l-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex-shrink-0"
                >
                    <span className="text-xl leading-none">{selectedCountry.flag}</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{selectedCountry.dial}</span>
                    <ChevronDown className={cn("w-3 h-3 text-slate-400 transition-transform", isOpen && "rotate-180")} />
                </button>

                {/* Input Field */}
                <Input
                    id={id}
                    type="tel"
                    value={displayValue}
                    onChange={handleNumberChange}
                    placeholder={placeholder || "000 000 0000"}
                    className="rounded-l-none rounded-xl border-slate-200 dark:border-white/10 focus:border-primary bg-white/50 dark:bg-navy-900/50 backdrop-blur-md h-[46px]"
                />
            </div>

            {/* Dropdown — positioned relative to the outer wrapper, outside the flex row */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 mt-1 w-72 bg-white dark:bg-navy-950 border border-slate-100 dark:border-white/10 rounded-2xl shadow-2xl z-[500] overflow-hidden"
                        style={{ boxShadow: '0 20px 60px -10px rgba(0,0,0,0.2)' }}
                    >
                        <div className="p-2 border-b border-slate-100 dark:border-white/5">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                <input
                                    autoFocus
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search country..."
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-white/5 border-none rounded-xl text-sm focus:ring-0 focus:outline-none dark:text-white"
                                />
                            </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
                            {filteredCountries.map((c) => (
                                <button
                                    key={c.code}
                                    type="button"
                                    onClick={() => handleCountrySelect(c)}
                                    className="w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-primary/5 dark:hover:bg-white/5 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl leading-none">{c.flag}</span>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{c.name}</span>
                                            <span className="text-xs text-slate-500 font-medium">{c.dial}</span>
                                        </div>
                                    </div>
                                    {selectedCountry.code === c.code && <Check className="w-4 h-4 text-primary" />}
                                </button>
                            ))}
                            {filteredCountries.length === 0 && (
                                <div className="p-4 text-center text-xs text-slate-400 font-bold italic">No results found</div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
