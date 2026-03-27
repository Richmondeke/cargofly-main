import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase safely for both build-time evaluation and run-time usage
const app = (() => {
    if (getApps().length > 0) return getApp();
    if (firebaseConfig.apiKey) return initializeApp(firebaseConfig);
    return undefined;
})();

// Export serverDb with a fallback to avoid crashing build if config is missing
export const serverDb = app ? getFirestore(app) : (undefined as unknown as ReturnType<typeof getFirestore>);
