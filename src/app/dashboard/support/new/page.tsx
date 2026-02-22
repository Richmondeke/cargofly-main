'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { createTicket } from '@/lib/ticket-service';

export default function NewTicketPage() {
    const { user, userProfile } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        subject: '',
        category: 'general' as 'shipping' | 'billing' | 'technical' | 'general',
        priority: 'medium' as 'low' | 'medium' | 'high',
        description: '',
        shipmentId: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            const ticketId = await createTicket({
                userId: user.uid,
                userEmail: user.email || '',
                userName: userProfile?.displayName || user.displayName || 'Customer',
                subject: form.subject,
                category: form.category,
                priority: form.priority,
                description: form.description,
                shipmentId: form.shipmentId || undefined,
            });
            router.push(`/dashboard/support/${ticketId}`);
        } catch (error) {
            console.error('Error creating ticket:', error);
            alert('Failed to create ticket. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto p-8 h-full bg-slate-50 dark:bg-background-dark">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/dashboard/support"
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-primary mb-4 transition-colors"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to Support
                </Link>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">New Ticket</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Describe your issue and we&apos;ll help you out</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-8 space-y-6">
                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Subject *
                        </label>
                        <input
                            type="text"
                            required
                            value={form.subject}
                            onChange={(e) => setForm(prev => ({ ...prev, subject: e.target.value }))}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Brief description of your issue"
                        />
                    </div>

                    {/* Category & Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Category
                            </label>
                            <select
                                value={form.category}
                                onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value as typeof form.category }))}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                            >
                                <option value="general">General Inquiry</option>
                                <option value="shipping">Shipping Issue</option>
                                <option value="billing">Billing Question</option>
                                <option value="technical">Technical Problem</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Priority
                            </label>
                            <select
                                value={form.priority}
                                onChange={(e) => setForm(prev => ({ ...prev, priority: e.target.value as typeof form.priority }))}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                            >
                                <option value="low">🟢 Low</option>
                                <option value="medium">🟡 Medium</option>
                                <option value="high">🔴 High</option>
                            </select>
                        </div>
                    </div>

                    {/* Shipment ID (optional) */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Related Shipment ID (optional)
                        </label>
                        <input
                            type="text"
                            value={form.shipmentId}
                            onChange={(e) => setForm(prev => ({ ...prev, shipmentId: e.target.value }))}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                            placeholder="e.g. SHP-1234"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Description *
                        </label>
                        <textarea
                            required
                            rows={6}
                            value={form.description}
                            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white resize-none"
                            placeholder="Please describe your issue in detail..."
                        />
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4 pt-4">
                        <Link
                            href="/dashboard/support"
                            className="flex-1 px-6 py-3 text-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading || !form.subject || !form.description}
                            className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-sm">send</span>
                                    Submit Ticket
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
