'use client';

import React, { useState, useEffect } from 'react';
import { generateEInvoice, getEInvoices, EInvoice } from "@/lib/wallet-service";
import toast from 'react-hot-toast';

interface InvoicesModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
}

export default function InvoicesModal({ isOpen, onClose, userId }: InvoicesModalProps) {
    const [loading, setLoading] = useState(false);
    const [invoices, setInvoices] = useState<EInvoice[]>([]);
    const [isCreating, setIsCreating] = useState(false);

    // Form state
    const [amount, setAmount] = useState('');
    const [vendor, setVendor] = useState('');
    const [description, setDescription] = useState('');
    const [currency, setCurrency] = useState<'USD' | 'NGN'>('USD');

    useEffect(() => {
        if (isOpen && userId) {
            fetchInvoices();
        }
    }, [isOpen, userId]);

    const fetchInvoices = async () => {
        try {
            const data = await getEInvoices(userId);
            setInvoices(data);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        }
    };

    if (!isOpen) return null;

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await generateEInvoice(userId, parseFloat(amount), currency, vendor, description);
            toast.success('Invoice generated successfully');
            setIsCreating(false);
            fetchInvoices();
            // Reset
            setAmount('');
            setVendor('');
            setDescription('');
        } catch (error: any) {
            toast.error(error.message || 'Generation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1e293b] w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
                    <div>
                        <h3 className="text-2xl font-display font-medium text-[#1b1c1c] dark:text-white uppercase tracking-tight">E-Invoices</h3>
                        <p className="text-xs text-slate-500 mt-1">Digital billing & records Management</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {!isCreating && (
                            <button
                                onClick={() => setIsCreating(true)}
                                className="bg-[#016FFF] text-white px-4 py-2 rounded-xl text-xs font-medium shadow-sm hover:bg-[#005cd6] transition-all"
                            >
                                Generate New
                            </button>
                        )}
                        <button onClick={onClose} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                    {isCreating ? (
                        <div className="animate-in slide-in-from-right-4 duration-300">
                            <button
                                onClick={() => setIsCreating(false)}
                                className="mb-6 flex items-center gap-1 text-xs text-slate-500 hover:text-[#016FFF] transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                                Back to list
                            </button>

                            <form onSubmit={handleGenerate} className="space-y-6 bg-slate-50/50 dark:bg-slate-900/30 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Client / Vendor</label>
                                        <input
                                            type="text"
                                            value={vendor}
                                            onChange={(e) => setVendor(e.target.value)}
                                            placeholder="e.g. Global Trade Logistics"
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
                                                onChange={(e) => setCurrency(e.target.value as any)}
                                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#016FFF] focus:border-transparent transition-all outline-none cursor-pointer"
                                            >
                                                <option value="USD">USD ($)</option>
                                                <option value="NGN">NGN (₦)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Billing Description</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Purpose of invoice..."
                                            rows={2}
                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#016FFF] focus:border-transparent transition-all outline-none resize-none"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#1b1c1c] text-white py-4 rounded-2xl font-display font-medium text-sm flex items-center justify-center gap-2 hover:bg-black transition-all disabled:opacity-50"
                                >
                                    {loading ? (
                                        <span className="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full"></span>
                                    ) : (
                                        <span className="material-symbols-outlined text-sm">add_task</span>
                                    )}
                                    Confirm Generation
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {invoices.length === 0 ? (
                                <div className="text-center py-20 bg-slate-50/50 dark:bg-slate-900/20 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                                    <span className="material-symbols-outlined text-4xl text-slate-300 mb-3">receipt_long</span>
                                    <p className="text-sm text-slate-500">No active invoices found.</p>
                                </div>
                            ) : (
                                invoices.map((inv) => (
                                    <div key={inv.id} className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl hover:shadow-md transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-[#016FFF]/10 group-hover:text-[#016FFF] transition-colors">
                                                <span className="material-symbols-outlined text-sm">description</span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-[#1b1c1c] dark:text-white text-sm">{inv.vendor}</p>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">{inv.id.slice(0, 8)} · {inv.description}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-display font-medium text-sm text-[#1b1c1c] dark:text-white">
                                                {inv.currency} {inv.amount.toLocaleString()}
                                            </p>
                                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${inv.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                {inv.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
