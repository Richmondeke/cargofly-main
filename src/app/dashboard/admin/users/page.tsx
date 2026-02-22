'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCustomers, TeamMember } from '@/lib/dashboard-service';
import { useAuth } from '@/contexts/AuthContext';
import RiveAnimation from '@/components/ui/RiveAnimation';

export default function AdminUsersPage() {
    const { userProfile } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<TeamMember[]>([]);
    const [debugInfo, setDebugInfo] = useState<string>("");
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setDebugInfo("Fetching customers...");
                const data = await getCustomers();
                setDebugInfo(`Fetched ${data.length} users`);
                setUsers(data);
            } catch (error: any) {
                console.error('Error loading users:', error);
                setError(error.message || "Unknown error");
                setDebugInfo(`Error: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (userProfile?.role === 'admin') {
            loadUsers();
        } else {
            setDebugInfo(`Not admin: ${userProfile?.role}`);
        }
    }, [userProfile]);

    const handleViewShipments = (userId: string) => {
        router.push(`/dashboard/shipments?userId=${userId}`);
    };

    if (userProfile?.role !== 'admin') {
        return (
            <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-background-dark">
                <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-slate-400 dark:text-slate-600 mb-4">lock</span>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Access Restricted</h2>
                    <p className="text-slate-500">You need admin privileges to access this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-8 h-full bg-slate-50 dark:bg-background-dark">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Registered Users</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and view customer activities</p>
                </div>
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase tracking-wider font-semibold text-xs">
                            <tr>
                                <th className="px-4 md:px-6 py-4">User</th>
                                <th className="hidden md:table-cell px-6 py-4">Email</th>
                                <th className="px-4 md:px-6 py-4">Status</th>
                                <th className="hidden lg:table-cell px-6 py-4">Joined</th>
                                <th className="px-4 md:px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {loading ? (
                                [1, 2, 3].map((i) => (
                                    <tr key={i}>
                                        <td colSpan={5} className="px-4 md:px-6 py-5">
                                            <div className="h-6 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-4 md:px-6 py-4">
                                            <div className="flex items-center gap-2 md:gap-3">
                                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-400 font-bold uppercase text-xs md:text-sm">
                                                    {user.displayName.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="font-semibold text-slate-900 dark:text-white text-sm md:text-base">{user.displayName}</p>
                                                    {/* Show email on mobile below name */}
                                                    <span className="md:hidden text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px]">{user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="hidden md:table-cell px-6 py-4 text-slate-600 dark:text-slate-300">{user.email}</td>
                                        <td className="px-4 md:px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2 md:px-2.5 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                                Active
                                            </span>
                                        </td>
                                        <td className="hidden lg:table-cell px-6 py-4 text-slate-500">
                                            {user.joinedAt?.toDate ? user.joinedAt.toDate().toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-4 md:px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleViewShipments(user.uid)}
                                                className="px-2 md:px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg text-xs font-bold transition-all whitespace-nowrap"
                                            >
                                                View
                                                <span className="hidden md:inline ml-1">Shipments</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-48 h-48">
                                                <RiveAnimation src="/icons/empty-state.riv" />
                                            </div>
                                            <p className="font-medium">No users found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Helper to manually create the Users type based on TeamMember but specifically for customer display
// No need for separate type def as TeamMember works fine for this view
