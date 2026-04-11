"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    addDoc,
    serverTimestamp,
    Timestamp,
    getDocs,
    writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export type NotificationType = 'shipment' | 'system' | 'alert';

export interface Notification {
    id: string;
    title: string;
    message: string;
    timestamp: Date;
    type: NotificationType;
    isRead: boolean;
}

interface FirestoreNotification {
    id?: string;
    title: string;
    message: string;
    timestamp: Timestamp;
    type: NotificationType;
    isRead: boolean;
    userId: string;
}

interface NotificationContextType {
    notifications: Notification[];
    isSidebarOpen: boolean;
    unreadCount: number;
    activeToast: Notification | null;
    toggleSidebar: () => void;
    closeSidebar: () => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearAll: () => void;
    clearActiveToast: () => void;
    requestBrowserPermission: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

function firestoreToNotification(data: FirestoreNotification, id: string): Notification {
    return {
        id,
        title: data.title,
        message: data.message,
        timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(),
        type: data.type || 'system',
        isRead: data.isRead ?? false,
    };
}

export function NotificationProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeToast, setActiveToast] = useState<Notification | null>(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [browserPermission, setBrowserPermission] = useState<NotificationPermission>('default');

    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            setBrowserPermission(window.Notification.permission);
        }
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
    const closeSidebar = () => setIsSidebarOpen(false);
    const clearActiveToast = () => setActiveToast(null);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Real-time listener: user's notifications sub-collection
    useEffect(() => {
        if (!user?.uid) {
            setNotifications([]);
            setIsInitialLoad(true);
            return;
        }

        const notifRef = collection(db, 'users', user.uid, 'notifications');
        const q = query(notifRef, orderBy('timestamp', 'desc'));

        const unsub = onSnapshot(
            q,
            (snapshot) => {
                if (snapshot.empty) {
                    setIsInitialLoad(false);
                    // Seed a welcome notification on first visit
                    seedWelcomeNotification(user.uid);
                    return;
                }

                const fetched = snapshot.docs.map(d =>
                    firestoreToNotification(d.data() as FirestoreNotification, d.id)
                );

                // Detect new notifications for toast (excluding initial load and existing ones)
                if (!isInitialLoad) {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === "added") {
                            const newNotif = firestoreToNotification(change.doc.data() as FirestoreNotification, change.doc.id);
                            // Only toast if it's unread and recent (not from some old state)
                            const now = new Date().getTime();
                            const notifTime = newNotif.timestamp.getTime();
                            if (!newNotif.isRead && (now - notifTime < 10000)) { // within 10 seconds
                                setActiveToast(newNotif);

                                // Trigger native notification if permitted
                                if (window.Notification.permission === 'granted') {
                                    new window.Notification(newNotif.title, {
                                        body: newNotif.message,
                                        icon: '/favicon.ico' // Or a specific app icon
                                    });
                                }

                                console.log('New notification toast triggered:', newNotif.title);
                            }
                        }
                    });
                }

                setNotifications(fetched);
                setIsInitialLoad(false);
            },
            (error) => {
                console.error('Notification listener error:', error);
            }
        );

        return () => unsub();
    }, [user?.uid, isInitialLoad]);

    async function seedWelcomeNotification(uid: string) {
        try {
            await addDoc(collection(db, 'users', uid, 'notifications'), {
                title: 'Welcome to Cargofly',
                message: 'Your account is set up and ready. Book your first shipment to get started.',
                timestamp: serverTimestamp(),
                type: 'system',
                isRead: false,
                userId: uid,
            });
        } catch (e) {
            console.warn('Could not seed welcome notification', e);
        }
    }

    const markAsRead = useCallback(async (id: string) => {
        if (!user?.uid) return;
        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        try {
            const notifRef = doc(db, 'users', user.uid, 'notifications', id);
            await updateDoc(notifRef, { isRead: true });
        } catch (e) {
            console.error('Failed to mark notification as read:', e);
        }
    }, [user?.uid]);

    const markAllAsRead = useCallback(async () => {
        if (!user?.uid) return;
        // Optimistic update
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        try {
            const unread = notifications.filter(n => !n.isRead);
            const batch = writeBatch(db);
            unread.forEach(n => {
                const notifRef = doc(db, 'users', user.uid!, 'notifications', n.id);
                batch.update(notifRef, { isRead: true });
            });
            await batch.commit();
        } catch (e) {
            console.error('Failed to mark all as read:', e);
        }
    }, [user?.uid, notifications]);

    const clearAll = useCallback(async () => {
        if (!user?.uid) return;
        // Optimistic update
        setNotifications([]);
        try {
            const notifRef = collection(db, 'users', user.uid, 'notifications');
            const snapshot = await getDocs(notifRef);
            const batch = writeBatch(db);
            snapshot.docs.forEach(d => batch.delete(d.ref));
            await batch.commit();
        } catch (e) {
            console.error('Failed to clear notifications:', e);
        }
    }, [user?.uid]);

    const requestBrowserPermission = async () => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            const permission = await window.Notification.requestPermission();
            setBrowserPermission(permission);
        }
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            isSidebarOpen,
            unreadCount,
            activeToast,
            toggleSidebar,
            closeSidebar,
            markAsRead,
            markAllAsRead,
            clearAll,
            clearActiveToast,
            requestBrowserPermission
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}

