// Firebase Cloud Messaging Service Worker
// This file must be in the public folder at the root level

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
    apiKey: "AIzaSyCz6OAnpdaeC4BYp85MKM7ImbsEec-w4hE",
    authDomain: "caverton-4eeec.firebaseapp.com",
    projectId: "caverton-4eeec",
    storageBucket: "caverton-4eeec.firebasestorage.app",
    messagingSenderId: "905688850260",
    appId: "1:905688850260:web:7da10ea5ebb2827c5772c1"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);

    const notificationTitle = payload.notification?.title || 'Cargofly Update';
    const notificationOptions = {
        body: payload.notification?.body || 'You have a new update',
        icon: '/logo.png',
        badge: '/logo.png',
        tag: payload.data?.shipmentId || 'cargofly-notification',
        data: payload.data,
        actions: [
            { action: 'view', title: 'View Details' },
            { action: 'dismiss', title: 'Dismiss' }
        ]
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification clicked:', event);

    event.notification.close();

    if (event.action === 'view' && event.notification.data?.shipmentId) {
        const url = `/dashboard/shipments/${event.notification.data.shipmentId}`;
        event.waitUntil(clients.openWindow(url));
    } else {
        event.waitUntil(clients.openWindow('/dashboard'));
    }
});
