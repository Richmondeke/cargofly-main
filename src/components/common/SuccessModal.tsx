'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: 'success' | 'error';
    actionLabel?: string;
    onAction?: () => void;
    showConfirm?: boolean;
    onConfirm?: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
}

export const SuccessModal: React.FC<NotificationModalProps> = ({
    isOpen,
    onClose,
    title,
    message,
    type = 'success',
    actionLabel,
    onAction,
    showConfirm,
    onConfirm,
    confirmLabel,
    cancelLabel
}) => {
    const isSuccess = type === 'success';

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
                    >
                        {/* Background Accent */}
                        <div className={cn(
                            "absolute top-0 left-0 w-full h-2",
                            isSuccess ? "bg-green-500" : "bg-red-500"
                        )} />

                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className={cn(
                                "mb-6 p-4 rounded-2xl",
                                isSuccess ? "bg-green-50 font-bold" : "bg-red-50"
                            )}>
                                {isSuccess ? (
                                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                                ) : (
                                    <AlertCircle className="w-12 h-12 text-red-500" />
                                )}
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                                {title}
                            </h3>

                            <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                                {message}
                            </p>

                            {showConfirm ? (
                                <div className="flex gap-3 w-full">
                                    <button
                                        onClick={onClose}
                                        className="flex-1 h-14 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl border border-slate-100 dark:border-slate-700 transition-all hover:bg-slate-100 dark:hover:bg-slate-700"
                                    >
                                        {cancelLabel || 'Cancel'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            onConfirm?.();
                                            onClose();
                                        }}
                                        className="flex-1 h-14 bg-red-600 text-white font-bold rounded-2xl shadow-lg shadow-red-200 dark:shadow-red-900/20 transition-all hover:bg-red-700 hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        {confirmLabel || 'Confirm'}
                                    </button>
                                </div>
                            ) : (
                                <div className="w-full">
                                    {actionLabel ? (
                                        <button
                                            onClick={onAction || onClose}
                                            className={cn(
                                                "w-full h-14 text-white font-bold rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]",
                                                isSuccess ? "bg-primary shadow-primary/20 hover:bg-primary/90" : "bg-red-600 shadow-red-200 hover:bg-red-700"
                                            )}
                                        >
                                            {actionLabel}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={onClose}
                                            className="w-full h-14 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl border border-slate-100 dark:border-slate-700 transition-all hover:bg-slate-100 dark:hover:bg-slate-700"
                                        >
                                            Close
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};



