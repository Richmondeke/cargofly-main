'use client';

import React, { useState, useEffect } from 'react';
import { convertCurrency, Wallet } from "@/lib/wallet-service";
import toast from 'react-hot-toast';

interface FXConversionModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    wallet: Wallet | null;
    onSuccess: () => void;
}

export default function FXConversionModal({ isOpen, onClose, userId, wallet, onSuccess }: FXConversionModalProps) {
    const [loading, setLoading] = useState(false);
    const [fromAmount, setFromAmount] = useState('');
    const [fromCurrency, setFromCurrency] = useState<'USD' | 'NGN'>('USD');
    const [toCurrency, setToCurrency] = useState<'NGN' | 'USD'>('NGN');

    // Fixed rate for mock implementation
    const rate = fromCurrency === 'USD' ? 1650 : 0.00061;

    useEffect(() => {
        if (fromCurrency === 'USD') setToCurrency('NGN');
        else setToCurrency('USD');
    }, [fromCurrency]);

    if (!isOpen) return null;

    const toAmount = fromAmount ? (parseFloat(fromAmount) * rate).toFixed(2) : '0.00';

    const handleConvert = async (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(fromAmount);
        if (isNaN(amount) || amount <= 0) return toast.error('Enter valid amount');

        setLoading(true);
        try {
            await convertCurrency(userId, amount, fromCurrency, toCurrency, rate);
            toast.success('Currency converted successfully');
            onSuccess();
            onClose();
            setFromAmount('');
        } catch (error: any) {
            toast.error(error.message || 'Conversion failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1e293b] w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-display font-medium text-[#1b1c1c] dark:text-white uppercase tracking-tight">FX Conversion</h3>
                        <p className="text-xs text-slate-500 mt-1">Live Mid-Market Swap Rates</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleConvert} className="p-8 space-y-8">
                    <div className="space-y-4">
                        {/* Sell Section */}
                        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">You Sell</span>
                                <span className="text-[10px] font-medium text-slate-400">Balance: {fromCurrency === 'USD' ? '$' : '₦'}{((fromCurrency === 'USD' ? wallet?.balanceUSD : wallet?.balanceNGN) || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex gap-4">
                                <input
                                    type="number"
                                    value={fromAmount}
                                    onChange={(e) => setFromAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="flex-1 bg-transparent font-display font-medium text-xl text-[#1b1c1c] dark:text-white outline-none"
                                />
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                                    <span className="text-lg">{fromCurrency === 'USD' ? '🇺🇸' : '🇳🇬'}</span>
                                    <select
                                        value={fromCurrency}
                                        onChange={(e) => setFromCurrency(e.target.value as any)}
                                        className="bg-transparent text-sm font-medium outline-none cursor-pointer"
                                    >
                                        <option value="USD">USD</option>
                                        <option value="NGN">NGN</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Arrows */}
                        <div className="flex justify-center -my-3 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-[#1b1c1c] text-white flex items-center justify-center border-4 border-white dark:border-[#1e293b] shadow-lg">
                                <span className="material-symbols-outlined text-sm">swap_vert</span>
                            </div>
                        </div>

                        {/* Buy Section */}
                        <div className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
                            <span className="block text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-2">You Receive</span>
                            <div className="flex gap-4">
                                <div className="flex-1 font-display font-medium text-xl text-[#1b1c1c] dark:text-white">
                                    {toAmount}
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl opacity-60">
                                    <span className="text-lg">{toCurrency === 'USD' ? '🇺🇸' : '🇳🇬'}</span>
                                    <span className="text-sm font-medium">{toCurrency}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rate info */}
                    <div className="flex justify-between items-center px-2">
                        <span className="text-xs text-slate-500">Indicative Rate</span>
                        <span className="text-xs font-medium text-[#1b1c1c] dark:text-white">1 {fromCurrency} = {rate} {toCurrency}</span>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !fromAmount}
                        className="w-full bg-[#1b1c1c] text-white py-4 rounded-2xl font-display font-medium text-sm flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-black/5"
                    >
                        {loading ? (
                            <span className="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full"></span>
                        ) : (
                            <span className="material-symbols-outlined text-sm">swap_horiz</span>
                        )}
                        Confirm Exchange
                    </button>

                    <p className="text-[10px] text-center text-slate-400 leading-relaxed px-4">
                        FX conversions are executed at the current market rate provided by Graph.finance partners. Processing may take a few moments.
                    </p>
                </form>
            </div>
        </div>
    );
}
