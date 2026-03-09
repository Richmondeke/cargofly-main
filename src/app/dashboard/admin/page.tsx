'use client';

import React, { useEffect, useState } from 'react';
import { getCustomers, getRecentActivities, formatActivityTime, TeamMember, Activity, getDashboardStats } from '@/lib/dashboard-service';
import { useAuth } from '@/contexts/AuthContext';
import RiveAnimation from '@/components/ui/RiveAnimation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { StatusPill } from '@/components/dashboard/StatusPill';
import {
    Truck,
    Activity as ActivityIcon,
    CheckCircle,
    CreditCard,
    Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminPage() {
    const { userProfile } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<TeamMember[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [stats, setStats] = useState({ totalShipments: 0, inTransit: 0, delivered: 0, totalRevenue: 0 });

    const loadData = async () => {
        setLoading(true);
        try {
            const [usersData, activityData, statsData] = await Promise.all([
                getCustomers(),
                getRecentActivities(undefined, 'admin', 10),
                getDashboardStats(),
            ]);
            setUsers(usersData);
            setActivities(activityData);
            setStats(statsData);
        } catch (error) {
            console.error('Error loading admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleViewShipments = (userId: string) => {
        router.push(`/dashboard/shipments?userId=${userId}`);
    };

    const isAdmin = userProfile?.role === 'admin';

    if (!isAdmin) {
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
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="text-left">
                    <h1 className="text-2xl sm:text-[32px] font-bold text-[#1e293b] dark:text-white leading-tight">Operations</h1>
                    <p className="text-[14px] text-[#64748b] dark:text-slate-400 mt-1">System administration and team management</p>
                </div>
            </div>

            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Shipments */}
                <Card variant="default">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                <Truck className="w-4 h-4 text-amber-500" />
                            </div>
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Shipments</span>
                        </div>
                        {loading ? (
                            <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                        ) : (
                            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.totalShipments.toLocaleString()}</p>
                        )}
                    </CardContent>
                </Card>

                {/* In Transit */}
                <Card variant="default">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-sky-50 dark:bg-sky-900/20 rounded-lg">
                                <ActivityIcon className="w-4 h-4 text-sky-500" />
                            </div>
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">In Transit</span>
                        </div>
                        {loading ? (
                            <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                        ) : (
                            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.inTransit.toLocaleString()}</p>
                        )}
                    </CardContent>
                </Card>

                {/* Delivered */}
                <Card variant="default">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                            </div>
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Delivered</span>
                        </div>
                        {loading ? (
                            <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                        ) : (
                            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.delivered.toLocaleString()}</p>
                        )}
                    </CardContent>
                </Card>

                {/* Total Revenue */}
                <Card variant="premium">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-white/10 rounded-lg">
                                <CreditCard className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-bold text-white/70 uppercase tracking-wider">Total Revenue</span>
                        </div>
                        {loading ? (
                            <div className="h-8 w-16 bg-white/10 rounded animate-pulse"></div>
                        ) : (
                            <p className="text-3xl font-black text-white tracking-tighter">
                                ${(stats.totalRevenue / 1000).toFixed(1)}k
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Registered Users */}
                <div className="lg:col-span-2 bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Registered Users</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase tracking-wider font-semibold text-xs border-y-0">
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
                                                <StatusPill status="success" />
                                            </td>
                                            <td className="hidden lg:table-cell px-6 py-4 text-slate-500">
                                                {user.joinedAt?.toDate ? user.joinedAt.toDate().toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-4 md:px-6 py-4 text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleViewShipments(user.uid)}
                                                    className="rounded-xl shadow-sm hover:bg-primary hover:text-white transition-all whitespace-nowrap"
                                                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                                                >
                                                    View <span className="hidden md:inline">Shipments</span>
                                                </Button>
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

                {/* Activity Log */}
                <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Activity Log</h3>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {loading ? (
                            [1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                            ))
                        ) : activities.length > 0 ? (
                            activities.map((activity) => (
                                <div key={activity.id} className="flex gap-3 items-start p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-sm text-slate-500">
                                            {activity.entityType === 'shipment' ? 'local_shipping' : activity.entityType === 'booking' ? 'add_box' : 'info'}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-900 dark:text-white">{activity.action}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-slate-500">{activity.userName}</span>
                                            <span className="text-slate-300">•</span>
                                            <span className="text-xs text-slate-400">{formatActivityTime(activity.timestamp)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 gap-3 text-slate-500">
                                <div className="w-32 h-32">
                                    <RiveAnimation src="/icons/empty-state.riv" />
                                </div>
                                <p>No activity yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
