import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiMail, FiCheck } from "react-icons/fi";
import { toast } from "react-toastify";

const NewsletterPopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        const hasSeenPopup = localStorage.getItem("hasSeenNewsletter");
        if (!hasSeenPopup) {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 3000); // 3-second delay
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem("hasSeenNewsletter", "true");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
            localStorage.setItem("hasSeenNewsletter", "true");
            toast.success("Welcome to the AEROLITH inner circle!");
            setTimeout(() => setIsOpen(false), 3000);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-[500px] bg-white overflow-hidden shadow-2xl"
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 text-[#767676] hover:text-[#212A2C] z-10 p-2"
                        >
                            <FiX size={20} />
                        </button>

                        <div className="flex flex-col">
                            <div className="h-48 bg-[#F5F5F2] flex items-center justify-center p-10 text-center relative overflow-hidden">
                                <div className="absolute inset-0 opacity-10">
                                    {/* Background pattern placeholder */}
                                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="gray" strokeWidth="0.5" />
                                            </pattern>
                                        </defs>
                                        <rect width="100%" height="100%" fill="url(#grid)" />
                                    </svg>
                                </div>
                                <div className="relative z-10">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#767676] block mb-2">Member Exclusive</span>
                                    <h2 className="text-3xl font-serif text-[#212A2C]">Unlock 10% Off</h2>
                                    <p className="text-[13px] text-[#767676] mt-2 italic px-4">Join our community for early access to limited collections and sustainable style tips.</p>
                                </div>
                            </div>

                            <div className="p-8 md:p-10">
                                {!isSubscribed ? (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="relative">
                                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#767676]" />
                                            <input
                                                type="email"
                                                required
                                                placeholder="Enter your email"
                                                className="w-full bg-[#F9F9F8] border border-[#E5E5E5] pl-10 pr-4 py-4 text-[14px] outline-none focus:border-[#212A2C] transition-colors"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full py-4 bg-[#212A2C] text-white text-[12px] font-bold uppercase tracking-[0.15em] hover:bg-[#1a2022] transition-colors"
                                        >
                                            Instant Discount
                                        </button>
                                        <p className="text-[11px] text-[#767676] text-center leading-relaxed">
                                            By signing up, you agree to receive AEROLITH marketing emails. <br />
                                            No spam, just style. Unsubscribe anytime.
                                        </p>
                                    </form>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-4"
                                    >
                                        <div className="w-16 h-16 bg-[#2D5233] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FiCheck size={30} />
                                        </div>
                                        <h3 className="text-xl font-bold text-[#212A2C] mb-2">You're In!</h3>
                                        <p className="text-[14px] text-[#767676] mb-4">
                                            Use code <span className="font-bold text-[#212A2C] text-lg bg-[#F5F5F2] px-2 py-1 rounded">SAVE10</span> at checkout.
                                        </p>
                                        <p className="text-[12px] text-[#767676]">Check your inbox for your official welcome gift.</p>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default NewsletterPopup;
