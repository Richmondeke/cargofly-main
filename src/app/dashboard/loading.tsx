'use client';

export default function DashboardLoading() {
    return (
        <div className="flex-1 overflow-y-auto p-8 h-full bg-slate-50 dark:bg-background-dark animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <div className="h-9 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg mb-2"></div>
                    <div className="h-4 w-72 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700"></div>
                            <div className="flex-1">
                                <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                                <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Area Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-surface-dark rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                    <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                        ))}
                    </div>
                </div>
                <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                    <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
