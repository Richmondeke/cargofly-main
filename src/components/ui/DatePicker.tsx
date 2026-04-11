"use client";

import * as React from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { format } from "date-fns"; // Check if date-fns is available, if not I'll use native

interface DatePickerProps {
    value?: Date;
    onChange: (date?: Date) => void;
    label?: string;
    placeholder?: string;
    className?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
}

export function DatePicker({
    value,
    onChange,
    label,
    placeholder = "Select date",
    className,
    error,
    required,
    disabled
}: DatePickerProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    // Native date input ref to use as the hidden actual input for mobile/native feel
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Format the date for the display
    const formatDate = (date?: Date) => {
        if (!date) return "";
        try {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            return "";
        }
    };

    // Format for native input (YYYY-MM-DD)
    const formatForInput = (date?: Date) => {
        if (!date) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (!val) {
            onChange(undefined);
        } else {
            onChange(new Date(val));
        }
    };

    return (
        <div className={cn("space-y-2 w-full", className)}>
            {label && (
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 pl-1">
                    {label}{required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative group">
                {/* Visual Fake Input */}
                <div
                    onClick={() => !disabled && inputRef.current?.showPicker?.()}
                    className={cn(
                        "flex items-center w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm transition-all shadow-sm cursor-pointer",
                        "dark:border-white/10 dark:bg-white/5 dark:text-white",
                        "hover:border-primary/50 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10",
                        disabled && "opacity-50 cursor-not-allowed",
                        value ? "text-slate-900 font-bold" : "text-slate-400 font-medium"
                    )}
                >
                    <CalendarIcon className={cn(
                        "w-4 h-4 mr-3 transition-colors",
                        value ? "text-primary" : "text-slate-400 group-hover:text-primary/70"
                    )} />

                    <span className="flex-1 truncate">
                        {value ? formatDate(value) : placeholder}
                    </span>

                    {value && !required && !disabled && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange(undefined);
                            }}
                            className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                        >
                            <X className="w-3.5 h-3.5 text-slate-400 hover:text-red-500" />
                        </button>
                    )}
                </div>

                {/* Hidden Native Input */}
                <input
                    ref={inputRef}
                    type="date"
                    className="absolute inset-0 opacity-0 pointer-events-none appearance-none"
                    value={formatForInput(value)}
                    onChange={handleNativeChange}
                    disabled={disabled}
                    required={required}
                />
            </div>

            {error && (
                <p className="text-[10px] font-bold text-red-500 pl-1 uppercase tracking-tight">
                    {error}
                </p>
            )}
        </div>
    );
}
