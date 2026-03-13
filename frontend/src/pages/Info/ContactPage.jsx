import { useState } from "react";
import { motion } from "framer-motion";
import { BsChatDots, BsEnvelope, BsTelephone } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL, CONTACT_URL } from "../../redux/constants";

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        orderNumber: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${BASE_URL}${CONTACT_URL}`, formData);
            toast.success(res.data.message || "Message sent successfully!");
            setFormData({ name: "", email: "", orderNumber: "", message: "" });
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Failed to send message. Please try again later."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-[#F9F9F8]"
        >
            <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-20">

                {/* Left Column: Contact Methods */}
                <div className="flex flex-col justify-center">
                    <h1
                        className="text-[#212A2C] text-5xl md:text-6xl mb-8 leading-tight"
                        style={{ fontFamily: "Source Serif 4, Georgia, serif", fontWeight: 300 }}
                    >
                        Get In Touch
                    </h1>
                    <p className="text-[15px] md:text-[16px] text-[#555] mb-12 leading-relaxed max-w-md">
                        Whether you have a question about sizing, materials, or an existing order, our team is ready to help you out. Wait times are usually under 24 hours.
                    </p>

                    <div className="space-y-10">
                        <div className="flex items-start gap-5">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-[#E5E5E5]">
                                <BsEnvelope size={20} className="text-[#212A2C]" />
                            </div>
                            <div>
                                <h3 className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#767676] mb-1">
                                    Email Us
                                </h3>
                                <p className="text-[15px] text-[#212A2C] font-medium mb-1">
                                    hello@aerolith.com
                                </p>
                                <p className="text-[13px] text-[#999]">
                                    Expect a reply within 24 hours.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-5">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-[#E5E5E5]">
                                <BsChatDots size={20} className="text-[#212A2C]" />
                            </div>
                            <div>
                                <h3 className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#767676] mb-1">
                                    Live Chat
                                </h3>
                                <p className="text-[15px] text-[#212A2C] font-medium mb-1">
                                    Available Weekdays
                                </p>
                                <p className="text-[13px] text-[#999]">
                                    9:00 AM - 6:00 PM IST
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-5">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-[#E5E5E5]">
                                <BsTelephone size={20} className="text-[#212A2C]" />
                            </div>
                            <div>
                                <h3 className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#767676] mb-1">
                                    Call Us
                                </h3>
                                <p className="text-[15px] text-[#212A2C] font-medium mb-1">
                                    1-800-555-0199
                                </p>
                                <p className="text-[13px] text-[#999]">
                                    Standard toll-free rates apply.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Contact Form */}
                <div className="bg-white p-8 md:p-12 lg:p-14 rounded-md shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-[#E5E4E0]">
                    <h2 className="text-[22px] text-[#212A2C] mb-8" style={{ fontFamily: "Source Serif 4, Georgia, serif" }}>
                        Send a Message
                    </h2>
                    <form onSubmit={submitHandler} className="space-y-8 text-[14px]">
                        {/* Minimalist Bottom Border Inputs */}
                        <div className="relative">
                            <input
                                type="text"
                                name="name"
                                id="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder=" "
                                className="block w-full px-0 py-3 bg-transparent border-0 border-b border-[#D9D9D9] appearance-none focus:outline-none focus:ring-0 focus:border-[#212A2C] peer transition-colors"
                            />
                            <label
                                htmlFor="name"
                                className="absolute text-[#767676] duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#212A2C] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 pointer-events-none"
                            >
                                Name
                            </label>
                        </div>

                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder=" "
                                className="block w-full px-0 py-3 bg-transparent border-0 border-b border-[#D9D9D9] appearance-none focus:outline-none focus:ring-0 focus:border-[#212A2C] peer transition-colors"
                            />
                            <label
                                htmlFor="email"
                                className="absolute text-[#767676] duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#212A2C] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 pointer-events-none"
                            >
                                Email Address
                            </label>
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                name="orderNumber"
                                id="orderNumber"
                                value={formData.orderNumber}
                                onChange={handleChange}
                                placeholder=" "
                                className="block w-full px-0 py-3 bg-transparent border-0 border-b border-[#D9D9D9] appearance-none focus:outline-none focus:ring-0 focus:border-[#212A2C] peer transition-colors"
                            />
                            <label
                                htmlFor="orderNumber"
                                className="absolute text-[#767676] duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#212A2C] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 pointer-events-none"
                            >
                                Order Number (Optional)
                            </label>
                        </div>

                        <div className="relative">
                            <textarea
                                name="message"
                                id="message"
                                required
                                rows="4"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder=" "
                                className="block w-full px-0 py-3 bg-transparent border-0 border-b border-[#D9D9D9] appearance-none focus:outline-none focus:ring-0 focus:border-[#212A2C] peer transition-colors resize-none"
                            />
                            <label
                                htmlFor="message"
                                className="absolute text-[#767676] duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#212A2C] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 pointer-events-none"
                            >
                                How can we help?
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4 py-4 bg-[#212A2C] text-white text-[12px] font-bold uppercase tracking-[0.15em] hover:bg-[#1a2022] active:scale-[0.99] transition-all disabled:opacity-50 flex justify-center items-center"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </>
                            ) : (
                                "Submit Request"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default ContactPage;
