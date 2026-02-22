'use client';

export default function NetworkLoading() {
    return (
        <div className="flex-1 overflow-y-auto p-8 h-full bg-slate-50 dark:bg-background-dark animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <div className="h-9 w-44 bg-slate-200 dark:bg-slate-700 rounded-lg mb-2"></div>
                    <div className="h-4 w-72 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden h-[500px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
            </div>
        </div>
    );
}
