import { motion } from "framer-motion";

const ProductSkeleton = () => (
    <div className="bg-white border border-[#E5E4E0] rounded-none overflow-hidden h-full">
        {/* Image placeholder - Allbirds style square */}
        <div className="aspect-square bg-[#F5F5F2] relative overflow-hidden">
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{
                    x: ['-100%', '100%']
                }}
                transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "linear"
                }}
            />
        </div>

        {/* Content placeholder */}
        <div className="p-4 space-y-3">
            <div className="h-4 bg-[#F5F5F2] rounded-none w-3/4 animate-pulse" />
            <div className="h-3 bg-[#F5F5F2] rounded-none w-1/2 animate-pulse" />
            <div className="flex gap-1 py-1">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-2.5 w-2.5 bg-[#F5F5F2] rounded-full animate-pulse" />
                ))}
            </div>
            <div className="h-5 bg-[#F5F5F2] rounded-none w-1/4 animate-pulse" />
        </div>
    </div>
);

export const ProductSkeletonGrid = ({ count = 8 }) => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#E5E4E0] border border-[#E5E4E0]">
        {[...Array(count)].map((_, i) => (
            <ProductSkeleton key={i} />
        ))}
    </div>
);

export default ProductSkeleton;
