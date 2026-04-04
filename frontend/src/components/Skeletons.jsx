import { motion } from "framer-motion";

const Shimmer = () => (
    <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
    />
);

export const GenericSkeleton = ({ className = "h-4 w-full" }) => (
    <div className={`bg-[#F5F5F2] relative overflow-hidden ${className}`}>
        <Shimmer />
    </div>
);

export const OrderSkeleton = () => (
    <div className="max-w-[1200px] mx-auto flex flex-col-reverse lg:flex-row animate-pulse">
        <div className="flex-1 px-6 md:px-10 lg:pr-14 py-8 lg:py-12">
            <div className="mb-12">
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-full bg-[#F5F5F2]" />
                    <GenericSkeleton className="h-3 w-32" />
                </div>
                <GenericSkeleton className="h-10 w-3/4 mb-4" />
                <GenericSkeleton className="h-4 w-1/2" />
            </div>

            <div className="mb-10 h-40 bg-[#F9F9F8] rounded-xl border border-[#E5E5E5]/50" />

            <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="h-20 bg-[#F5F5F2] rounded-lg" />
                <div className="h-20 bg-[#F5F5F2] rounded-lg" />
            </div>

            <div className="space-y-4 mb-8">
                <GenericSkeleton className="h-16 rounded-lg" />
                <GenericSkeleton className="h-16 rounded-lg" />
            </div>
        </div>

        <aside className="lg:w-[440px] shrink-0 bg-[#FAFAFA] p-8 lg:p-10">
            <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                        <div className="w-16 h-16 bg-white rounded-lg border border-gray-100" />
                        <div className="flex-1 space-y-2">
                            <GenericSkeleton className="h-4 w-full" />
                            <GenericSkeleton className="h-3 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    </div>
);

export const DashboardSkeleton = () => (
    <div className="p-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <GenericSkeleton className="h-3 w-20 mb-3" />
                    <GenericSkeleton className="h-8 w-32" />
                </div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-80 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <GenericSkeleton className="h-6 w-48 mb-6" />
                <div className="h-full bg-[#F9F9F8] rounded-lg" />
            </div>
            <div className="h-80 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <GenericSkeleton className="h-6 w-48 mb-6" />
                <div className="h-full bg-[#F9F9F8] rounded-lg" />
            </div>
        </div>
    </div>
);

export const ProductDetailsSkeleton = () => (
    <div className="min-h-screen bg-white">
        <div className="max-w-[1400px] mx-auto animate-pulse">
            <div className="px-5 md:px-10 py-4">
                <GenericSkeleton className="h-3 w-48" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] xl:grid-cols-[1fr_480px]">
                <div className="aspect-square bg-[#F5F5F2]" />
                <div className="px-6 md:px-10 py-8 lg:py-10 space-y-6">
                    <div className="space-y-3">
                        <GenericSkeleton className="h-10 w-3/4" />
                        <GenericSkeleton className="h-4 w-1/4" />
                        <GenericSkeleton className="h-4 w-32" />
                    </div>
                    <div className="space-y-4 pt-6 border-t border-[#E5E4E0]">
                        <div className="flex gap-2">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="w-10 h-10 rounded-full bg-[#F5F5F2]" />
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4 pt-6 border-t border-[#E5E4E0]">
                        <div className="grid grid-cols-4 gap-2">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="h-12 bg-[#F5F5F2]" />
                            ))}
                        </div>
                    </div>
                    <GenericSkeleton className="h-14 w-full" />
                </div>
            </div>
        </div>
    </div>
);

