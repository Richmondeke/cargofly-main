'use client';

import React, { useState } from 'react';
import { processSettlement, Wallet } from "@/lib/wallet-service";
import toast from 'react-hot-toast';

interface SettlementsModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    wallet: Wallet | null;
    onSuccess: () => void;
}

export default function SettlementsModal({ isOpen, onClose, userId, wallet, onSuccess }: SettlementsModalProps) {
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState('');
    const [vendor, setVendor] = useState('');
    const [description, setDescription] = useState('');
    const [currency, setCurrency] = useState<'USD' | 'NGN'>('USD');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !vendor) return toast.error('Please fill all required fields');

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) return toast.error('Invalid amount');

        setLoading(true);
        try {
            await processSettlement(userId, numAmount, currency, vendor, description);
            toast.success('Settlement processed successfully');
            onSuccess();
            onClose();
            // Reset form
            setAmount('');
            setVendor('');
            setDescription('');
        } catch (error: any) {
            toast.error(error.message || 'Settlement failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1e293b] w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-display font-medium text-[#1b1c1c] dark:text-white uppercase tracking-tight">Settlements</h3>
                        <p className="text-xs text-slate-500 mt-1">Process vendor & global payouts via Graph.finance</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Balance Info */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl flex justify-between items-center border border-slate-100 dark:border-slate-800">
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Available Pool</span>
                        <span className="font-display font-medium text-[#1b1c1c] dark:text-white">
                            {currency === 'USD' ? '$' : '₦'}{((currency === 'USD' ? wallet?.balanceUSD : wallet?.balanceNGN) || 0).toLocaleString()}
                        </span>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Beneficiary Vendor</label>
                            <input
                                type="text"
                                value={vendor}
                                onChange={(e) => setVendor(e.target.value)}
                                placeholder="e.g. Skyline Logistics LLC"
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#016FFF] focus:border-transparent transition-all outline-none"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Amount</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#016FFF] focus:border-transparent transition-all outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Currency</label>
                                <select
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value as 'USD' | 'NGN')}
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#016FFF] focus:border-transparent transition-all outline-none cursor-pointer"
                                >
                                    <option value="USD">USD ($)</option>
                                    <option value="NGN">NGN (₦)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Reference / Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="External payout reference..."
                                rows={2}
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#016FFF] focus:border-transparent transition-all outline-none resize-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#1b1c1c] text-white py-4 rounded-2xl font-display font-medium text-sm flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 mt-4 shadow-lg shadow-black/5"
                    >
                        {loading ? (
                            <span className="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full"></span>
                        ) : (
                            <span className="material-symbols-outlined text-sm">send</span>
                        )}
                        Authorize Settlement
                    </button>
                </form>
            </div>
        </div>
    );
}
