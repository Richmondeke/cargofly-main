'use client';

export default function NewBookingLoading() {
    return (
        <div className="flex-1 overflow-y-auto p-8 h-full bg-slate-50 dark:bg-background-dark animate-pulse">
            {/* Header Skeleton */}
            <div className="mb-8">
                <div className="h-9 w-40 bg-slate-200 dark:bg-slate-700 rounded-lg mb-2"></div>
                <div className="h-4 w-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-4 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                        <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded hidden md:block"></div>
                        {i < 4 && <div className="h-1 w-12 bg-slate-200 dark:bg-slate-700 rounded hidden md:block"></div>}
                    </div>
                ))}
            </div>

            {/* Form Card */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-8 border border-slate-200 dark:border-slate-700 max-w-3xl">
                <div className="h-6 w-40 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i}>
                            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                            <div className="h-12 w-full bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-3">
                    <div className="h-11 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                    <div className="h-11 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
}
