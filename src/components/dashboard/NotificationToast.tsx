"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Info, AlertTriangle, CheckCircle, X, FlightTakeoff, Settings, Box } from 'lucide-react';
import { NotificationType } from '@/contexts/NotificationContext';

interface NotificationToastProps {
    notification: {
        id: string;
        title: string;
        message: string;
        type: NotificationType;
    } | null;
    onClose: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (notification) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
            }, 8000); // Slightly longer duration for better readability
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [notification, onClose]);

    if (!notification) return null;

    const getIcon = () => {
        switch (notification.type) {
            case 'shipment':
                return <Box className="h-6 w-6 text-gold-500" />;
            case 'alert':
                return <AlertTriangle className="h-6 w-6 text-red-500" />;
            case 'system':
            default:
                return <Settings className="h-6 w-6 text-blue-400" />;
        }
    };

    const getAccentColor = () => {
        switch (notification.type) {
            case 'shipment':
                return 'bg-gold-500';
            case 'alert':
                return 'bg-red-500';
            case 'system':
            default:
                return 'bg-blue-500';
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: -120, opacity: 0, x: '-50%', scale: 0.9 }}
                    animate={{ y: 32, opacity: 1, x: '-50%', scale: 1 }}
                    exit={{ y: -120, opacity: 0, x: '-50%', scale: 0.9 }}
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                        mass: 1.2
                    }}
                    className="fixed left-1/2 z-[10000] flex w-[95%] max-w-lg overflow-hidden rounded-2xl bg-navy-900 border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]"
                >
                    {/* Color Accent Bar */}
                    <div className={`w-1.5 self-stretch ${getAccentColor()}`} />

                    <div className="flex flex-1 items-start gap-4 p-5">
                        <div className="flex-shrink-0 rounded-xl bg-white/5 p-2.5 border border-white/10">
                            {getIcon()}
                        </div>

                        <div className="flex-1 pt-0.5">
                            <h4 className="font-display font-bold text-white text-base mb-1 tracking-tight">
                                {notification.title}
                            </h4>
                            <p className="text-sm text-white/70 leading-relaxed line-clamp-2">
                                {notification.message}
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                setIsVisible(false);
                                setTimeout(onClose, 300);
                            }}
                            className="flex-shrink-0 rounded-lg p-2 hover:bg-white/10 transition-colors"
                        >
                            <X className="h-5 w-5 text-white/40" />
                        </button>
                    </div>

                    {/* Progress Bar Animation */}
                    <motion.div
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: 8, ease: "linear" }}
                        className={`absolute bottom-0 left-0 h-0.5 ${getAccentColor()} opacity-50`}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NotificationToast;
