'use client';

export default function FinancialLoading() {
    return (
        <div className="flex-1 overflow-y-auto p-8 h-full bg-slate-50 dark:bg-background-dark animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <div className="h-9 w-44 bg-slate-200 dark:bg-slate-700 rounded-lg mb-2"></div>
                    <div className="h-4 w-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
                <div className="h-10 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
            </div>

            {/* Financial Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-3"></div>
                        <div className="h-10 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                        <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    </div>
                ))}
            </div>

            {/* Invoices Table */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="px-6 py-4 flex items-center gap-6">
                            <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                            <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded ml-auto"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
