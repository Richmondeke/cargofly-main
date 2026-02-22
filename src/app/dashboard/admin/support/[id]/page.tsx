'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    getTicketById,
    subscribeToMessages,
    addMessage,
    markTicketAsRead,
    updateTicketStatus,
    Ticket,
    Message
} from '@/lib/ticket-service';

export default function AdminTicketDetailPage() {
    const { id } = useParams();
    const { user, userProfile } = useAuth();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadTicket();
    }, [id]);

    async function loadTicket() {
        if (!id || typeof id !== 'string') return;
        try {
            const data = await getTicketById(id);
            setTicket(data);
            if (data) {
                markTicketAsRead(id, 'admin');
            }
        } catch (error) {
            console.error('Error loading ticket:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!id || typeof id !== 'string') return;
        const unsubscribe = subscribeToMessages(id, setMessages);
        return () => unsubscribe();
    }, [id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!newMessage.trim() || !user || !ticket) return;

        setSending(true);
        try {
            await addMessage(ticket.id, {
                senderId: user.uid,
                senderName: userProfile?.displayName || 'Support Team',
                senderRole: 'admin',
                content: newMessage.trim(),
            });
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    const handleStatusChange = async (status: Ticket['status']) => {
        if (!ticket) return;
        try {
            await updateTicketStatus(ticket.id, status);
            loadTicket();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const getStatusColor = (status: Ticket['status']) => {
        switch (status) {
            case 'open': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            case 'in-progress': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'resolved': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'closed': return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400';
        }
    };

    if (userProfile?.role !== 'admin') {
        return (
            <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-background-dark">
                <p className="text-slate-500">Access denied</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-background-dark">
                <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-background-dark">
                <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">error</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Ticket not found</h3>
                <Link href="/dashboard/admin/support" className="text-primary hover:underline">
                    Back to Tickets
                </Link>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-background-dark">
            {/* Header */}
            <div className="flex-shrink-0 p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark">
                <Link
                    href="/dashboard/admin/support"
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-primary mb-3 transition-colors text-sm"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to Tickets
                </Link>
                <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs font-mono text-slate-400">#{ticket.id}</span>
                            <select
                                value={ticket.status}
                                onChange={(e) => handleStatusChange(e.target.value as Ticket['status'])}
                                className={`px-3 py-1 rounded-lg text-xs font-medium border-0 cursor-pointer ${getStatusColor(ticket.status)}`}
                            >
                                <option value="open">Open</option>
                                <option value="in-progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{ticket.subject}</h2>
                    </div>
                    <div className="text-right text-sm">
                        <p className="font-medium text-slate-900 dark:text-white">{ticket.userName}</p>
                        <p className="text-slate-500">{ticket.userEmail}</p>
                        <p className="text-xs text-slate-400 mt-1">
                            {ticket.category} • {ticket.priority} priority
                        </p>
                        {ticket.shipmentId && (
                            <Link
                                href={`/dashboard/shipments/${ticket.shipmentId}`}
                                className="text-primary hover:underline text-xs mt-1 inline-block"
                            >
                                🚚 {ticket.shipmentId}
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[70%] rounded-2xl px-4 py-3 ${msg.senderRole === 'admin'
                                    ? 'bg-primary text-white rounded-br-md'
                                    : 'bg-white dark:bg-surface-dark text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-bl-md'
                                }`}
                        >
                            <div className={`text-xs mb-1 ${msg.senderRole === 'admin' ? 'text-white/70' : 'text-slate-500'}`}>
                                {msg.senderName}
                                {' • '}
                                {msg.createdAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex-shrink-0 p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                        placeholder="Type your reply..."
                        className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    />
                    <button
                        onClick={handleSend}
                        disabled={sending || !newMessage.trim()}
                        className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {sending ? (
                            <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-sm">send</span>
                                Send
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
