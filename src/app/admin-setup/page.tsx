"use client";

import { useState } from "react";
import { collection, query, where, getDocs, updateDoc, doc, serverTimestamp, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, AlertCircle, CheckCircle } from "lucide-react";

export default function AdminSetupPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

    const handleMakeAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            // 1. Find user in 'users' collection
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setStatus({
                    type: "error",
                    message: "User not found. Please register/login with this email first."
                });
                setLoading(false);
                return;
            }

            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            const userId = userDoc.id;

            // 2. Update 'users' collection role
            await updateDoc(doc(db, "users", userId), {
                role: "admin",
                updatedAt: serverTimestamp()
            });

            // 3. Update or Create logic for 'team_members'
            const teamRef = collection(db, "team_members");
            const teamQ = query(teamRef, where("email", "==", email));
            const teamSnapshot = await getDocs(teamQ);

            if (!teamSnapshot.empty) {
                // Update existing team member
                const teamDoc = teamSnapshot.docs[0];
                await updateDoc(doc(db, "team_members", teamDoc.id), {
                    role: "admin",
                    updatedAt: serverTimestamp()
                });
            } else {
                // Create new team member entry
                await addDoc(collection(db, "team_members"), {
                    uid: userId,
                    email: email,
                    displayName: userData.displayName || email.split("@")[0],
                    role: "admin",
                    department: "IT", // Default for super admin
                    status: "active",
                    joinedAt: serverTimestamp(),
                });
            }

            setStatus({
                type: "success",
                message: `Success! ${email} is now an Admin. You can now access the Admin Dashboard.`
            });

        } catch (error: any) {
            console.error("Error promoting user:", error);
            setStatus({ type: "error", message: error.message || "Failed to update user." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-12 bg-slate-50 dark:bg-navy-900 transition-colors duration-500 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white dark:bg-navy-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-navy-700"
            >
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-400">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Setup</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Promote a user to Admin role</p>
                        </div>
                    </div>

                    <form onSubmit={handleMakeAdmin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                User Email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter registered email..."
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-navy-600 bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all"
                            />
                        </div>

                        {status && (
                            <div className={`p-4 rounded-xl flex items-start gap-3 ${status.type === "success" ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" :
                                status.type === "error" ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400" :
                                    "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                                }`}>
                                {status.type === "success" ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                                <p className="text-sm font-medium">{status.message}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-sky-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <ShieldCheck className="w-5 h-5" />
                                    Make Admin
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="bg-slate-50 dark:bg-navy-900/50 p-4 border-t border-slate-200 dark:border-navy-700 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
