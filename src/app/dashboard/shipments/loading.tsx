'use client';

export default function ShipmentsLoading() {
    return (
        <div className="flex-1 overflow-y-auto p-8 h-full bg-slate-50 dark:bg-background-dark animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <div className="h-9 w-56 bg-slate-200 dark:bg-slate-700 rounded-lg mb-2"></div>
                    <div className="h-4 w-80 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
                <div className="flex gap-2 bg-white dark:bg-surface-dark p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-9 w-24 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                    ))}
                </div>
            </div>

            {/* Table Skeleton */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {/* Table Header */}
                <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex gap-8">
                    {['w-28', 'w-40', 'w-20', 'w-32', 'w-20'].map((w, i) => (
                        <div key={i} className={`h-4 ${w} bg-slate-200 dark:bg-slate-600 rounded`}></div>
                    ))}
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="px-6 py-5 flex items-center gap-8">
                            <div className="h-5 w-28 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            <div className="h-5 w-40 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                            <div className="flex items-center gap-2 flex-1">
                                <div className="h-2 w-32 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                                <div className="h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            </div>
                            <div className="flex gap-2">
                                <div className="h-9 w-9 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                                <div className="h-9 w-9 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="flex gap-2">
                        <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                        <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
