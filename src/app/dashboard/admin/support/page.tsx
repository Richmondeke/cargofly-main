'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getAllTickets, updateTicketStatus, Ticket } from '@/lib/ticket-service';
import StatusDropdown from '@/components/dashboard/StatusDropdown';

export default function AdminSupportPage() {
    const { userProfile } = useAuth();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'open' | 'in-progress' | 'resolved'>('all');

    useEffect(() => {
        loadTickets();
    }, []);

    async function loadTickets() {
        try {
            const data = await getAllTickets();
            setTickets(data);
        } catch (error) {
            console.error('Error loading tickets:', error);
        } finally {
            setLoading(false);
        }
    }

    const filteredTickets = tickets.filter(t => {
        if (filter === 'all') return true;
        return t.status === filter;
    });



    const getPriorityBadge = (priority: Ticket['priority']) => {
        switch (priority) {
            case 'high': return <span className="px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded text-xs font-medium">High</span>;
            case 'medium': return <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded text-xs font-medium">Medium</span>;
            case 'low': return <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded text-xs font-medium">Low</span>;
        }
    };

    const handleStatusChange = async (ticketId: string, status: Ticket['status']) => {
        try {
            await updateTicketStatus(ticketId, status);
            loadTickets();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    // Stats
    const openCount = tickets.filter(t => t.status === 'open').length;
    const inProgressCount = tickets.filter(t => t.status === 'in-progress').length;
    const unreadCount = tickets.filter(t => t.unreadByAdmin).length;

    if (userProfile?.role !== 'admin') {
        return (
            <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-background-dark">
                <p className="text-slate-500">Access denied</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-8 h-full bg-slate-50 dark:bg-background-dark">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Support Tickets</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Manage customer support requests</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">{tickets.length}</div>
                    <div className="text-sm text-slate-500">Total Tickets</div>
                </div>
                <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <div className="text-3xl font-bold text-red-500">{openCount}</div>
                    <div className="text-sm text-slate-500">Open</div>
                </div>
                <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <div className="text-3xl font-bold text-yellow-500">{inProgressCount}</div>
                    <div className="text-sm text-slate-500">In Progress</div>
                </div>
                <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <div className="text-3xl font-bold text-primary">{unreadCount}</div>
                    <div className="text-sm text-slate-500">Unread</div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6">
                {(['all', 'open', 'in-progress', 'resolved'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === f
                            ? 'bg-primary text-white'
                            : 'bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
                    </button>
                ))}
            </div>

            {/* Ticket Table */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                        ))}
                    </div>
                ) : filteredTickets.length === 0 ? (
                    <div className="p-12 text-center">
                        <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4 block">
                            inbox
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No tickets found</h3>
                        <p className="text-slate-500 dark:text-slate-400">
                            {filter === 'all' ? 'No support tickets yet.' : `No ${filter} tickets.`}
                        </p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ticket</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Updated</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {filteredTickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {ticket.unreadByAdmin && (
                                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
                                            )}
                                            <div>
                                                <span className="text-xs font-mono text-slate-400">#{ticket.id}</span>
                                                <p className="font-medium text-slate-900 dark:text-white truncate max-w-[200px]">
                                                    {ticket.subject}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">{ticket.userName}</p>
                                            <p className="text-xs text-slate-500">{ticket.userEmail}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-600 dark:text-slate-300 capitalize">{ticket.category}</span>
                                    </td>
                                    <td className="px-6 py-4">{getPriorityBadge(ticket.priority)}</td>
                                    <td className="px-6 py-4">
                                        <StatusDropdown
                                            status={ticket.status}
                                            onChange={(s) => handleStatusChange(ticket.id, s)}
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-500">{ticket.updatedAt?.toLocaleDateString()}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/dashboard/admin/support/${ticket.id}`}
                                            className="text-primary hover:underline flex items-center gap-1 text-sm font-medium"
                                        >
                                            View
                                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
