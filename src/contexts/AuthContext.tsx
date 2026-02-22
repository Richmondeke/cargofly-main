"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    phone?: string;
    company?: string;
    role: "customer" | "admin" | "staff";
    walletBalance: number;
}

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, displayName: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Create user profile in Firestore
    async function createUserProfile(user: User, displayName?: string) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            const profile: UserProfile = {
                uid: user.uid,
                email: user.email || "",
                displayName: displayName || user.displayName || "User",
                role: (["richmondeke@gmail.com", "godliverse@gmail.com", "admin_test_v1@cargofly.com"].includes(user.email || "")) ? "admin" : "customer",
                walletBalance: 0,
            };

            await setDoc(userRef, {
                ...profile,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                savedAddresses: [],
            });

            return profile;
        }

        const data = userSnap.data() as UserProfile;
        const adminEmails = ["richmondeke@gmail.com", "godliverse@gmail.com"];
        if (adminEmails.includes(data.email) && data.role !== "admin") {
            // Auto-fix admin role if it was previously set to customer
            // We can try to update it if rules allow, or just return it as admin in session
            return { ...data, role: "admin" as const };
        }

        return data;
    }

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);

            if (user) {
                const profile = await createUserProfile(user);
                setUserProfile(profile);
            } else {
                setUserProfile(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Sign in with email/password
    async function signIn(email: string, password: string) {
        await signInWithEmailAndPassword(auth, email, password);
    }

    // Sign up with email/password
    async function signUp(email: string, password: string, displayName: string) {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(user, { displayName });
        await createUserProfile(user, displayName);
    }

    // Sign in with Google
    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        const { user } = await signInWithPopup(auth, provider);
        await createUserProfile(user);
    }

    // Sign out
    async function signOut() {
        await firebaseSignOut(auth);
        setUser(null);
        setUserProfile(null);
    }

    const value: AuthContextType = {
        user,
        userProfile,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
