export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
            {/* Breadcrumb skeleton */}
            <div className="flex gap-2 mb-6">
                <div className="h-4 bg-gray-200 rounded w-12" />
                <div className="h-4 bg-gray-200 rounded w-4" />
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-4 bg-gray-200 rounded w-4" />
                <div className="h-4 bg-gray-200 rounded w-48" />
            </div>

            <div className="flex gap-8">
                {/* Sidebar skeleton */}
                <div className="hidden md:block w-60 flex-shrink-0">
                    <div className="bg-gray-100 rounded-xl p-4 space-y-3">
                        <div className="h-3 bg-gray-200 rounded w-24 mb-4" />
                        <div className="h-10 bg-gray-200 rounded" />
                        <div className="h-10 bg-gray-200 rounded" />
                        <div className="h-10 bg-gray-200 rounded" />
                    </div>
                </div>

                {/* Content skeleton */}
                <div className="flex-1 space-y-6">
                    <div className="h-9 bg-gray-200 rounded w-3/4" />

                    {/* Tabs skeleton */}
                    <div className="flex gap-1 border-b border-gray-200 pb-0">
                        {[80, 70, 80, 72, 56].map((w, i) => (
                            <div key={i} className="h-10 bg-gray-200 rounded-t" style={{ width: w }} />
                        ))}
                    </div>

                    {/* Card skeletons */}
                    {[1, 2].map(i => (
                        <div key={i} className="bg-gray-100 rounded-xl p-7 space-y-3">
                            <div className="h-6 bg-gray-200 rounded w-1/2" />
                            <div className="h-4 bg-gray-200 rounded w-full" />
                            <div className="h-4 bg-gray-200 rounded w-5/6" />
                            <div className="h-4 bg-gray-200 rounded w-4/6" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
