'use client';

export default function UsersLoading() {
    return (
        <div className="flex-1 overflow-y-auto p-8 h-full bg-slate-50 dark:bg-background-dark animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <div className="h-9 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg mb-2"></div>
                    <div className="h-4 w-56 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                            <div className="flex-1">
                                <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                                <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="h-8 flex-1 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                            <div className="h-8 flex-1 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
