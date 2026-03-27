"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Input } from './Input';
import { Label } from './Label';

interface Suggestion {
    name: string;
    city?: string;
    country: string;
    postcode?: string;
    description: string;
    fullText: string;
}

interface AddressAutocompleteProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function AddressAutocomplete({
    id,
    label,
    value,
    onChange,
    placeholder,
    className
}: AddressAutocompleteProps) {
    const [query, setQuery] = useState(value);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setQuery(value);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchSuggestions = async (searchText: string) => {
        if (searchText.length < 3) {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/address/search?q=${encodeURIComponent(searchText)}&limit=5`);
            const data = await response.json();

            const processed: Suggestion[] = data.features.map((f: { properties: any }) => {
                const props = f.properties;
                const name = props.name || '';
                const city = props.city || '';
                const country = props.country || '';
                const postcode = props.postcode || '';

                const parts = [name, city, postcode, country].filter(Boolean);
                const description = [city, country].filter(Boolean).join(', ');

                return {
                    name: name,
                    city: city,
                    country: country,
                    postcode: postcode,
                    description: description,
                    fullText: parts.join(', ')
                };
            });

            setSuggestions(processed);
            setShowSuggestions(true);
        } catch (error) {
            console.error('Autocomplete error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (query.length >= 3) {
                fetchSuggestions(query);
            } else {
                setSuggestions([]);
            }
        }, 400);

        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        onChange(val);
    };

    const handleSelect = (suggestion: Suggestion) => {
        setQuery(suggestion.fullText);
        onChange(suggestion.fullText);
        setShowSuggestions(false);
    };

    return (
        <div className={cn("relative space-y-2", className)} ref={wrapperRef}>
            <Label htmlFor={id}>{label}</Label>
            <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                    <MapPin className="w-4 h-4" />
                </div>
                <Input
                    id={id}
                    value={query}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    autoComplete="off"
                    className="pl-10 pr-10 bg-white/50 dark:bg-navy-900/50 backdrop-blur-md border-slate-200 dark:border-white/10 hover:border-primary/50 focus:border-primary transition-all rounded-xl"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                    {query && (
                        <button
                            onClick={() => { setQuery(''); onChange(''); setSuggestions([]); }}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute z-[100] w-full mt-2 bg-white/95 dark:bg-navy-950/95 backdrop-blur-xl border border-slate-100 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="py-2">
                            {suggestions.map((s, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSelect(s)}
                                    className="w-full px-4 py-3 text-left hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors flex items-start gap-3 group"
                                >
                                    <div className="mt-1 w-8 h-8 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors shrink-0">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                            {s.name}
                                        </span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">
                                            {s.description}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                        <div className="px-4 py-2 bg-slate-50/50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Powered by Photon</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
