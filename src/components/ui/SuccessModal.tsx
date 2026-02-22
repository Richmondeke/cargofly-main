import React from 'react';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
    buttonText?: string;
}

export default function SuccessModal({
    isOpen,
    onClose,
    title = 'Success!',
    message = 'Your changes have been saved successfully.',
    buttonText = 'Continue'
}: SuccessModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-surface-dark rounded-2xl max-w-sm w-full p-6 shadow-2xl transform scale-100 animate-in zoom-in-95 duration-200 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-3xl text-green-600 dark:text-green-400">check_circle</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {title}
                </h3>

                <p className="text-slate-500 dark:text-slate-400 mb-6">
                    {message}
                </p>

                <button
                    onClick={onClose}
                    className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-sm"
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
}
