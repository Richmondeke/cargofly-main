"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
    Wallet,
    Plus,
    ArrowUpRight,
    ArrowDownLeft,
    CreditCard,
    History,
    Loader2,
    AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { fundWallet, getWalletTransactions, WalletTransaction } from "@/lib/firestore";
import AnimatedCounter from "@/components/AnimatedCounter";

export default function WalletPage() {
    const { user, userProfile, loading: authLoading } = useAuth();
    const router = useRouter();
    const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
    const [loadingTransactions, setLoadingTransactions] = useState(true);
    const [isFundModalOpen, setIsFundModalOpen] = useState(false);
    const [fundAmount, setFundAmount] = useState("");
    const [processingPayment, setProcessingPayment] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login?redirect=/wallet");
        }
    }, [user, authLoading, router]);

    // Fetch transactions
    useEffect(() => {
        async function loadTransactions() {
            if (user?.uid) {
                try {
                    const txs = await getWalletTransactions(user.uid);
                    setTransactions(txs);
                } catch (err) {
                    console.error("Failed to load transactions", err);
                } finally {
                    setLoadingTransactions(false);
                }
            }
        }

        if (user?.uid) {
            loadTransactions();
        }
    }, [user?.uid]);

    const handleFundWallet = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setProcessingPayment(true);

        const amount = parseFloat(fundAmount);
        if (isNaN(amount) || amount <= 0) {
            setError("Please enter a valid amount");
            setProcessingPayment(false);
            return;
        }

        if (!user?.uid) return;

        try {
            // Simulate payment processing delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            await fundWallet(user.uid, amount, "manual_funding");

            // Refresh transactions
            const txs = await getWalletTransactions(user.uid);
            setTransactions(txs);

            setIsFundModalOpen(false);
            setFundAmount("");
            // Ideally show success toast here
        } catch (err: any) {
            setError(err.message || "Failed to fund wallet");
        } finally {
            setProcessingPayment(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50 dark:bg-slate-900">
                <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-slate-900 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Wallet</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Manage your logistics payments and transaction history
                        </p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <button
                            onClick={() => setIsFundModalOpen(true)}
                            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gold-500 text-navy-900 font-medium shadow-lg shadow-gold-500/20 hover:bg-gold-600 hover:shadow-xl transition-all active:scale-95"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Funds
                        </button>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Balance Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-1"
                    >
                        <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-2xl p-8 h-full">
                            {/* Background Glows */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

                            <div className="relative z-10 flex flex-col justify-between h-full min-h-[220px]">
                                <div>
                                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                                        <Wallet className="w-5 h-5" />
                                        <span className="font-medium text-sm tracking-wider uppercase">Available Balance</span>
                                    </div>
                                    <div className="text-4xl sm:text-5xl font-bold tracking-tight text-white mt-4">
                                        <span className="text-2xl sm:text-3xl font-normal text-slate-400 mr-1">$</span>
                                        <AnimatedCounter value={userProfile?.walletBalance || 0} />
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400 uppercase tracking-widest">Account Status</span>
                                        <span className="text-sm font-medium text-emerald-400 flex items-center gap-1.5 mt-1">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                            Active
                                        </span>
                                    </div>
                                    <CreditCard className="w-8 h-8 text-white/20" />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Transaction History */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                            <h3 className="font-semibold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                <History className="w-5 h-5 text-slate-400" />
                                Recent Transactions
                            </h3>
                        </div>

                        <div className="p-0">
                            {loadingTransactions ? (
                                <div className="p-8 space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center gap-4 animate-pulse">
                                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700" />
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                                                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                                            </div>
                                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20" />
                                        </div>
                                    ))}
                                </div>
                            ) : transactions.length === 0 ? (
                                <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mx-auto flex items-center justify-center mb-4">
                                        <History className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <p className="font-medium">No transactions yet</p>
                                    <p className="text-sm mt-1">Fund your wallet to get started</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {transactions.map((tx) => (
                                        <div key={tx.id} className="p-4 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center border",
                                                    tx.type === 'credit'
                                                        ? "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-900/50 dark:text-emerald-400"
                                                        : "bg-red-50 border-red-100 text-red-600 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400"
                                                )}>
                                                    {tx.type === 'credit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white">{tx.description}</p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                                        {tx.createdAt?.seconds ? new Date(tx.createdAt.seconds * 1000).toLocaleDateString(undefined, {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        }) : 'Just now'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={cn(
                                                "font-semibold tabular-nums",
                                                tx.type === 'credit' ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-white"
                                            )}>
                                                {tx.type === 'credit' ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Pagination placeholder if needed */}
                        {transactions.length > 5 && (
                            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-center">
                                <button className="text-sm text-gold-500 font-medium hover:text-gold-600 hover:underline">
                                    View All Transactions
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Fund Modal */}
            <AnimatePresence>
                {isFundModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFundModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8"
                        >
                            <div className="mb-6">
                                <div className="w-12 h-12 rounded-full bg-gold-50 dark:bg-gold-900/20 flex items-center justify-center mb-4 text-gold-600 dark:text-gold-400">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Fund Wallet</h3>
                                <p className="text-slate-500 dark:text-slate-400 mt-1">
                                    Add funds securely to your Cargofly wallet.
                                </p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleFundWallet} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Amount (USD)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                                            $
                                        </div>
                                        <input
                                            type="number"
                                            min="1"
                                            placeholder="0.00"
                                            value={fundAmount}
                                            onChange={(e) => setFundAmount(e.target.value)}
                                            className="block w-full pl-8 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all font-medium text-lg"
                                            disabled={processingPayment}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsFundModalOpen(false)}
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                        disabled={processingPayment}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processingPayment}
                                        className="flex-1 px-4 py-2.5 rounded-lg bg-gold-500 text-navy-900 font-medium shadow-lg shadow-gold-500/20 hover:bg-gold-600 hover:shadow-xl transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {processingPayment ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            "Add Funds"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
