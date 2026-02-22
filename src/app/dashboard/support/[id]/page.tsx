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
    Ticket,
    Message
} from '@/lib/ticket-service';

export default function TicketDetailPage() {
    const { id } = useParams();
    const { user, userProfile } = useAuth();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function loadTicket() {
            if (!id || typeof id !== 'string') return;
            try {
                const data = await getTicketById(id);
                setTicket(data);
                // Mark as read
                if (data && user) {
                    markTicketAsRead(id, 'user');
                }
            } catch (error) {
                console.error('Error loading ticket:', error);
            } finally {
                setLoading(false);
            }
        }
        loadTicket();
    }, [id, user]);

    // Subscribe to messages
    useEffect(() => {
        if (!id || typeof id !== 'string') return;

        const unsubscribe = subscribeToMessages(id, (msgs) => {
            setMessages(msgs);
        });

        return () => unsubscribe();
    }, [id]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!newMessage.trim() || !user || !ticket) return;

        setSending(true);
        try {
            await addMessage(ticket.id, {
                senderId: user.uid,
                senderName: userProfile?.displayName || user.displayName || 'Customer',
                senderRole: 'customer',
                content: newMessage.trim(),
            });
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
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
                <Link href="/dashboard/support" className="text-primary hover:underline">
                    Back to Support
                </Link>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-background-dark">
            {/* Header */}
            <div className="flex-shrink-0 p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark">
                <Link
                    href="/dashboard/support"
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-primary mb-3 transition-colors text-sm"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to Tickets
                </Link>
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs font-mono text-slate-400">#{ticket.id}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                {ticket.status.replace('-', ' ')}
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{ticket.subject}</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {ticket.category} • Created {ticket.createdAt?.toLocaleDateString()}
                        </p>
                    </div>
                    {ticket.shipmentId && (
                        <Link
                            href={`/dashboard/shipments/${ticket.shipmentId}`}
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-sm">local_shipping</span>
                            {ticket.shipmentId}
                        </Link>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.senderRole === 'customer' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[70%] rounded-2xl px-4 py-3 ${msg.senderRole === 'customer'
                                    ? 'bg-primary text-white rounded-br-md'
                                    : 'bg-white dark:bg-surface-dark text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-bl-md'
                                }`}
                        >
                            <div className={`text-xs mb-1 ${msg.senderRole === 'customer' ? 'text-white/70' : 'text-slate-500'}`}>
                                {msg.senderRole === 'admin' && (
                                    <span className="inline-flex items-center gap-1">
                                        <span className="material-symbols-outlined text-xs">support_agent</span>
                                        Support Team
                                    </span>
                                )}
                                {msg.senderRole === 'customer' && 'You'}
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
            {ticket.status !== 'closed' && (
                <div className="flex-shrink-0 p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                            placeholder="Type your message..."
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
                                <span className="material-symbols-outlined text-sm">send</span>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {ticket.status === 'closed' && (
                <div className="flex-shrink-0 p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-center text-slate-500">
                    This ticket has been closed.
                    <Link href="/dashboard/support/new" className="text-primary hover:underline ml-1">
                        Open a new ticket
                    </Link>
                </div>
            )}
        </div>
    );
}
