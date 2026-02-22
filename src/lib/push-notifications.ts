'use client';

import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import app, { db } from './firebase';

// VAPID key for web push - you'll need to generate this in Firebase Console
const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

/**
 * Check if push notifications are supported in this browser
 */
export async function isPushSupported(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    if (!('serviceWorker' in navigator)) return false;
    if (!('PushManager' in window)) return false;

    try {
        return await isSupported();
    } catch {
        return false;
    }
}

/**
 * Get the current notification permission status
 */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
    if (typeof window === 'undefined') return 'unsupported';
    if (!('Notification' in window)) return 'unsupported';
    return Notification.permission;
}

/**
 * Request permission for push notifications and get FCM token
 */
export async function requestPushPermission(userId: string): Promise<{
    success: boolean;
    token?: string;
    error?: string;
}> {
    try {
        // Check if supported
        const supported = await isPushSupported();
        if (!supported) {
            return { success: false, error: 'Push notifications are not supported in this browser' };
        }

        // Request permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            return { success: false, error: 'Notification permission denied' };
        }

        // Register service worker
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('Service Worker registered:', registration);

        // Get FCM token
        const messaging = getMessaging(app);
        const token = await getToken(messaging, {
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: registration,
        });

        if (!token) {
            return { success: false, error: 'Failed to get FCM token' };
        }

        // Save token to user document
        await saveFCMToken(userId, token);

        return { success: true, token };
    } catch (error) {
        console.error('Error requesting push permission:', error);
        return { success: false, error: (error as Error).message };
    }
}

/**
 * Save FCM token to user's document in Firestore
 */
async function saveFCMToken(userId: string, token: string): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
        fcmTokens: arrayUnion(token),
        updatedAt: new Date(),
    });
}

/**
 * Remove FCM token from user's document (for logout or disabling notifications)
 */
export async function removeFCMToken(userId: string, token: string): Promise<void> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
        fcmTokens: arrayRemove(token),
        updatedAt: new Date(),
    });
}

/**
 * Listen for foreground messages (when app is open)
 */
export function onForegroundMessage(callback: (payload: {
    title: string;
    body: string;
    data?: Record<string, string>;
}) => void): () => void {
    if (typeof window === 'undefined') return () => { };

    try {
        const messaging = getMessaging(app);

        const unsubscribe = onMessage(messaging, (payload) => {
            console.log('Foreground message received:', payload);

            callback({
                title: payload.notification?.title || 'Cargofly Update',
                body: payload.notification?.body || 'You have a new notification',
                data: payload.data as Record<string, string>,
            });
        });

        return unsubscribe;
    } catch (error) {
        console.error('Error setting up foreground message listener:', error);
        return () => { };
    }
}

/**
 * Show a toast notification for foreground messages
 */
export function showNotificationToast(title: string, body: string, onClick?: () => void): void {
    // Create a custom toast element
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 z-50 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 max-w-sm animate-slide-in cursor-pointer';
    toast.innerHTML = `
        <div class="flex items-start gap-3">
            <div class="p-2 bg-primary/10 rounded-lg">
                <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
            </div>
            <div class="flex-1">
                <p class="font-semibold text-slate-900 dark:text-white text-sm">${title}</p>
                <p class="text-slate-500 dark:text-slate-400 text-xs mt-1">${body}</p>
            </div>
            <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    `;

    toast.addEventListener('click', () => {
        toast.remove();
        onClick?.();
    });

    document.body.appendChild(toast);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}
