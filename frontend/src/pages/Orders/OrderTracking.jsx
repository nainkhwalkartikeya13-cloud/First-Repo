import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import moment from "moment";
import { useGetOrderDetailsQuery } from "../../redux/api/orderApiSlice";
import { FiPackage, FiTruck, FiCheck, FiMapPin, FiArrowLeft, FiShield } from "react-icons/fi";
import ContentWrapper from "../../components/ContentWrapper";
import Loader from "../../components/Loader";

const OrderTracking = () => {
    const { id } = useParams();
    const { data: order, isLoading, error } = useGetOrderDetailsQuery(id);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-rose-500">Order not found.</div>;

    const steps = [
        {
            title: "Order Placed",
            date: order.createdAt,
            icon: FiShield,
            status: "complete",
            desc: "We've received your order and it's being initialized."
        },
        {
            title: "Processing",
            date: order.paidAt,
            icon: FiPackage,
            status: order.isPaid ? (order.isProcessing ? "complete" : "current") : "pending",
            desc: "Expert hands are preparing your sustainable essentials."
        },
        {
            title: "Shipped",
            date: order.shippedAt,
            icon: FiTruck,
            status: order.isShipped ? "complete" : (order.isProcessing ? "current" : "pending"),
            desc: "Your package is on its journey to you."
        },
        {
            title: "Delivered",
            date: order.deliveredAt,
            icon: FiCheck,
            status: order.isDelivered ? "complete" : (order.isShipped ? "current" : "pending"),
            desc: "Enjoy your AEROLITH experience."
        }
    ];

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Minimal Header */}
            <div className="border-b border-gray-100 py-6 px-5 mb-12">
                <ContentWrapper>
                    <div className="flex items-center justify-between">
                        <Link to="/" className="text-xl font-bold tracking-tight text-[#212A2C]" style={{ fontFamily: "serif" }}>
                            AEROLITH
                        </Link>
                        <Link to={`/order/${id}`} className="text-[11px] font-bold uppercase tracking-widest text-[#767676] hover:text-[#212A2C] transition-colors flex items-center gap-2">
                            <FiArrowLeft /> Back to Order
                        </Link>
                    </div>
                </ContentWrapper>
            </div>

            <ContentWrapper>
                <div className="max-w-[800px] mx-auto">
                    <div className="mb-12">
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#767676] mb-3">
                            Track Your Journey
                        </p>
                        <h1 className="text-3xl md:text-4xl font-light text-[#212A2C] tracking-tight mb-4" style={{ fontFamily: "serif" }}>
                            Order #{id.slice(-8).toUpperCase()}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-[#555]">
                            <span className="flex items-center gap-2 bg-[#F5F5F2] px-3 py-1 rounded-full text-[12px]">
                                <FiMapPin className="text-[#999]" /> {order.shippingAddress.city}, {order.shippingAddress.country}
                            </span>
                            <span className="text-[#999]">|</span>
                            <span>Estimated arrival: <span className="font-bold text-[#212A2C]">{moment(order.createdAt).add(5, 'days').format('MMMM DD, YYYY')}</span></span>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="relative space-y-12 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[#F5F5F2]">
                        {steps.map((step, idx) => (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative pl-12"
                            >
                                {/* Circle Icon */}
                                <div className={`absolute left-0 top-0 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors z-10 ${step.status === "complete" ? "bg-[#212A2C] border-[#212A2C] text-white shadow-lg" :
                                        step.status === "current" ? "bg-white border-[#212A2C] text-[#212A2C] shadow-md" :
                                            "bg-white border-[#E5E5E5] text-[#999]"
                                    }`}>
                                    <step.icon className="w-4 h-4" />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className={`text-[15px] font-bold tracking-tight ${step.status === "pending" ? "text-[#999]" : "text-[#212A2C]"}`}>
                                            {step.title}
                                        </h3>
                                        {step.date && step.status === "complete" && (
                                            <span className="text-[11px] font-medium text-[#767676]">
                                                {moment(step.date).format('MMM DD, h:mm a')}
                                            </span>
                                        )}
                                    </div>
                                    <p className={`text-[13px] leading-relaxed ${step.status === "pending" ? "text-[#BDBDBD]" : "text-[#767676]"}`}>
                                        {step.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Pro Tip Card */}
                    <div className="mt-20 bg-[#212A2C] rounded-2xl p-8 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <FiShield size={120} />
                        </div>
                        <div className="relative z-10">
                            <h4 className="text-xl font-bold mb-4">AEROLITH Assurance</h4>
                            <p className="text-white/70 text-sm leading-relaxed max-w-[500px] mb-6">
                                Your order is protected by our sustainability guarantee. Every mile traveled is offset, and every material used is 100% ethically sourced.
                            </p>
                            <Link to="/sustainability" className="text-xs font-bold uppercase tracking-widest border-b border-white/30 pb-1 hover:border-white transition-all">
                                Learn about our impact
                            </Link>
                        </div>
                    </div>
                </div>
            </ContentWrapper>
        </div>
    );
};

export default OrderTracking;
