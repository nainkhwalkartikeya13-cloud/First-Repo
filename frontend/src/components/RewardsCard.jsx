import { motion } from "framer-motion";
import { FiTriangle, FiAward, FiStar, FiZap } from "react-icons/fi";

const RewardsCard = ({ points = 0 }) => {
    // Tier logic
    const getTier = (pts) => {
        if (pts >= 1000) return { name: "Platinum", color: "from-slate-400 to-slate-200", icon: FiZap };
        if (pts >= 500) return { name: "Gold", color: "from-amber-400 to-yellow-600", icon: FiStar };
        return { name: "Bronze", color: "from-orange-400 to-orange-700", icon: FiAward };
    };

    const tier = getTier(points);
    const nextTier = points < 500 ? 500 : points < 1000 ? 1000 : null;
    const progress = nextTier ? (points / nextTier) * 100 : 100;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-xl bg-gradient-to-br ${tier.color}`}
        >
            {/* Decorative patterns */}
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-black/10 rounded-full blur-3xl" />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 mb-1">
                            LuxeClub Member
                        </p>
                        <h3 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <tier.icon className="w-6 h-6" />
                            {tier.name} Tier
                        </h3>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md rounded-lg p-2 px-3 text-right">
                        <p className="text-[10px] uppercase font-bold tracking-wider opacity-90">Points</p>
                        <p className="text-xl font-black">{points.toLocaleString()}</p>
                    </div>
                </div>

                {nextTier && (
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider">
                            <span>Progress to Gold</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-black/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                            />
                        </div>
                        <p className="text-[10px] text-white/70 italic">
                            Earn {nextTier - points} more points to reach Gold status.
                        </p>
                    </div>
                )}

                {!nextTier && (
                    <div className="pt-4 mt-4 border-t border-white/10">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-center">
                            Ultimate VIP Status Achieved
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default RewardsCard;
