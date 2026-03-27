"use client";

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase safely (prevent multiple initializations or crashing if config is missing)
const app = (() => {
    if (getApps().length > 0) return getApps()[0];
    if (firebaseConfig.apiKey) return initializeApp(firebaseConfig);
    return undefined;
})();

// Export services with fallbacks to avoid crashing build if config is missing
export const auth = app ? getAuth(app) : (undefined as unknown as ReturnType<typeof getAuth>);
export const db = app ? getFirestore(app) : (undefined as unknown as ReturnType<typeof getFirestore>);
export const storage = app ? getStorage(app) : (undefined as unknown as ReturnType<typeof getStorage>);

export default app;
