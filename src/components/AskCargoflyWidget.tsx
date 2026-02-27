import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowUpRight, ArrowUp, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const QUICK_LINKS = [
    "I want to track a shipment",
    "I need help getting a quote",
    "I want to learn about prohibited items"
];

const ChatbotIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 200 300" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        {/* Head */}
        <circle cx="30" cy="80" r="15" />
        {/* Body */}
        <path d="M 25 100 L 40 90 L 60 135 L 50 140 Z" />
        {/* Top Wing */}
        <path d="M 60 135 L 110 30 L 155 50 C 130 90 90 120 60 135 Z" />
        {/* Middle Wing */}
        <path d="M 60 135 C 100 125 150 100 165 90 C 170 110 160 130 140 140 Z" />
        {/* Bottom Wing */}
        <path d="M 60 140 L 120 155 C 150 150 165 130 165 90 C 140 140 90 145 60 140 Z" />
        {/* Sweeping Tail */}
        <path d="M 45 140 C 30 200 10 250 80 295 C 40 270 30 200 60 135 Z" />
    </svg>
);

export default function AskCargoflyWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="bg-white w-[380px] h-[640px] max-h-[85vh] rounded-[28px] shadow-2xl flex flex-col mb-4 border border-slate-100 overflow-hidden transform-origin-bottom-right"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-5 pb-2">
                            <span className="font-bold text-slate-800 text-lg">Cargofly</span>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                            >
                                <ChevronDown className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto px-5 pb-6 flex flex-col">
                            {/* Greeting Area */}
                            <div className="flex flex-col items-center justify-center mt-8 mb-12">
                                <div className="text-[#4196FF] mb-4">
                                    <ChatbotIcon className="w-12 h-12" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                                    Hello <span className="text-2xl">👋</span>
                                </h2>
                                <p className="text-slate-600 text-sm">How can I help you today?</p>
                            </div>

                            {/* Quick Links */}
                            <div className="flex flex-col mb-8 border-t border-slate-100">
                                {QUICK_LINKS.map((link, index) => (
                                    <button
                                        key={index}
                                        className="flex items-center gap-4 py-4 border-b border-slate-100 hover:bg-slate-50 transition-colors text-left group px-2"
                                    >
                                        <ArrowUpRight className="w-5 h-5 text-slate-800" strokeWidth={2.5} />
                                        <span className="text-slate-800 text-sm flex-1">{link}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Spacer to push input to bottom if needed */}
                            <div className="flex-1" />

                            {/* Input Area */}
                            <div className="mt-auto">
                                <div className="border-[1.5px] border-slate-200 rounded-[20px] p-3 flex flex-col relative focus-within:border-[#4196FF] transition-colors bg-white">
                                    <textarea
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Ask Cargofly anything..."
                                        className="w-full resize-none outline-none text-sm text-slate-800 placeholder:text-slate-500 min-h-[80px] bg-transparent"
                                    />
                                    <div className="flex justify-end mt-2">
                                        <button
                                            className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                                                inputValue.trim()
                                                    ? "bg-[#4196FF] text-white"
                                                    : "bg-slate-100 text-slate-400"
                                            )}
                                        >
                                            <ArrowUp className="w-4 h-4" strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-center text-[10px] text-slate-500 mt-3 px-4">
                                    Ask Cargofly can make mistakes. Double-check replies.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(true)}
                    className="bg-[#4196FF] text-white px-6 py-3.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-3 font-bold text-sm"
                >
                    <ChatbotIcon className="w-6 h-6" />
                    Ask Cargofly
                </motion.button>
            )}
        </div>
    );
}
