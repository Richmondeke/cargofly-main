'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Ticket } from '@/lib/ticket-service';

interface StatusDropdownProps {
    status: Ticket['status'];
    onChange: (status: Ticket['status']) => void;
    disabled?: boolean;
}

const statuses: { value: Ticket['status']; label: string }[] = [
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
];

export default function StatusDropdown({ status, onChange, disabled }: StatusDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getStatusStyles = (s: Ticket['status']) => {
        switch (s) {
            case 'open':
                return 'bg-red-100/10 text-red-500 border-red-500/20';
            case 'in-progress':
                return 'bg-yellow-100/10 text-yellow-500 border-yellow-500/20';
            case 'resolved':
                return 'bg-green-100/10 text-green-500 border-green-500/20';
            case 'closed':
                return 'bg-slate-100/10 text-slate-500 border-slate-500/20';
            default:
                return 'bg-slate-100/10 text-slate-500 border-slate-500/20';
        }
    };

    const getBadgeStyles = (s: Ticket['status']) => {
        switch (s) {
            case 'open':
                return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            case 'in-progress':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'resolved':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'closed':
                return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
            default:
                return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                    transition-all duration-200 border
                    ${getBadgeStyles(status)}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 cursor-pointer'}
                `}
            >
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                <span className="capitalize whitespace-nowrap">
                    {status.replace('-', ' ')}
                </span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="fixed z-50 mt-2 w-48 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right"
                    style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                    }}
                >
                    <div className="p-1.5 space-y-0.5">
                        {statuses.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`
                                    w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors
                                    ${status === option.value
                                        ? 'bg-primary/20 text-white' // Selected item highlight? Or pill style?
                                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                    }
                                `}
                            >
                                <span className={`
                                    px-2 py-1 rounded-md border
                                    ${getStatusStyles(option.value)}
                                `}>
                                    {option.label}
                                </span>

                                {status === option.value && (
                                    <Check className="w-4 h-4 text-primary" /> // Primary color checkmark
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
