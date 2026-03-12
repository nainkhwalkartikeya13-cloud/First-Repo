import { motion } from "framer-motion";
import { FiCheck, FiPackage, FiTruck, FiHome } from "react-icons/fi";
import { MdOutlinePayment } from "react-icons/md";
import moment from "moment";

const OrderTimeline = ({ order }) => {
    const steps = [
        {
            id: "placed",
            label: "Order Placed",
            icon: FiPackage,
            isCompleted: true, // Always true if order exists
            date: order.createdAt,
        },
        {
            id: "paid",
            label: "Payment",
            icon: MdOutlinePayment,
            isCompleted: order.isPaid,
            date: order.paidAt,
        },
        {
            id: "processing",
            label: "Processing",
            icon: FiPackage,
            isCompleted: order.isProcessing,
            date: order.processedAt,
        },
        {
            id: "shipped",
            label: "Shipped",
            icon: FiTruck,
            isCompleted: order.isShipped,
            date: order.shippedAt,
        },
        {
            id: "delivered",
            label: "Delivered",
            icon: FiHome,
            isCompleted: order.isDelivered,
            date: order.deliveredAt,
        },
    ];

    return (
        <div className="py-8 px-4">
            <div className="relative flex justify-between">
                {/* Progress Line */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0" />

                {/* Active Progress Line */}
                <motion.div
                    className="absolute top-1/2 left-0 h-0.5 bg-[#212A2C] -translate-y-1/2 z-0 origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{
                        scaleX: (steps.filter(s => s.isCompleted).length - 1) / (steps.length - 1)
                    }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    style={{ width: "100%" }}
                />

                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = step.isCompleted;

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center group">
                            {/* Step Circle */}
                            <motion.div
                                initial={false}
                                animate={{
                                    backgroundColor: isCompleted ? "#212A2C" : "#FFFFFF",
                                    borderColor: isCompleted ? "#212A2C" : "#E5E5E5",
                                    scale: isCompleted ? 1 : 0.9,
                                }}
                                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors duration-300 shadow-sm`}
                            >
                                {isCompleted ? (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    >
                                        <FiCheck className="text-white text-lg" />
                                    </motion.div>
                                ) : (
                                    <Icon className="text-gray-400 text-lg" />
                                )}
                            </motion.div>

                            {/* Label */}
                            <div className="mt-3 text-center">
                                <p className={`text-[11px] font-bold uppercase tracking-wider ${isCompleted ? "text-[#212A2C]" : "text-gray-400"}`}>
                                    {step.label}
                                </p>
                                {isCompleted && step.date && (
                                    <motion.p
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-[10px] text-gray-500 mt-1"
                                    >
                                        {moment(step.date).format("MMM DD, HH:mm")}
                                    </motion.p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderTimeline;
