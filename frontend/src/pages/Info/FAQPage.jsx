import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import PropTypes from 'prop-types';

const faqData = [
    {
        category: "Orders & Shipping",
        questions: [
            {
                q: "How long will my order take to arrive?",
                a: "Standard shipping typically takes 3-5 business days. We also offer expedited 2-day shipping at checkout. Orders placed before 1 PM IST generally ship the same day.",
            },
            {
                q: "Do you offer free shipping?",
                a: "Yes! We offer free standard shipping on all orders over ₹4,999. For orders under ₹4,999, standard shipping is a flat rate of ₹99.",
            },
            {
                q: "How can I track my order?",
                a: "Once your order ships, you will receive a confirmation email with a tracking link. You can also view your order status in real-time by logging into your account and clicking 'Track Your Journey' on your order history.",
            },
        ],
    },
    {
        category: "Returns & Exchanges",
        questions: [
            {
                q: "What is your return policy?",
                a: "We offer a 30-day, no-questions-asked return policy. If you aren't completely in love with your AEROLITH items, simply return them unworn and in their original packaging for a full refund.",
            },
            {
                q: "How do I start a return?",
                a: "To start a return, visit our Returns Portal, enter your order number and email, and print your prepaid shipping label.",
            },
            {
                q: "Can I exchange for a different size?",
                a: "Absolutely. Exchanges are free within 30 days. Just select 'Exchange' instead of 'Return' in our portal and choose your new size.",
            },
        ],
    },
    {
        category: "Product & Sizing",
        questions: [
            {
                q: "Are AEROLITH shoes true to size?",
                a: "Our shoes are designed to fit true to size. If you are between sizes, we recommend sizing up for our Wool runners, and sizing down for our Tree loungers.",
            },
            {
                q: "Are the materials really sustainable?",
                a: "Yes. We are radically transparent about our supply chain. We use ethically sourced Merino Wool, FSC-certified Tree fiber, and SweetFoam® (made from sugarcane) to minimize our carbon footprint.",
            },
        ],
    },
];

const Accordion = ({ q, a }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-[#E5E5E5]">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between py-5 text-left group"
            >
                <span className="text-[15px] md:text-[16px] text-[#212A2C] font-medium group-hover:text-[#767676] transition-colors pr-6">
                    {q}
                </span>
                <span className="shrink-0 text-[#212A2C]">
                    {open ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                </span>
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-[14px] md:text-[15px] text-[#555] leading-relaxed">
                            {a}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

Accordion.propTypes = {
    q: PropTypes.string.isRequired,
    a: PropTypes.string.isRequired,
};

const FAQPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-white"
        >
            {/* Hero Section */}
            <section className="bg-[#F5F5F2] pt-24 pb-16 px-6 md:px-10 text-center">
                <h1
                    className="text-[#212A2C] text-4xl md:text-5xl lg:text-6xl mb-6"
                    style={{ fontFamily: "Source Serif 4, Georgia, serif", fontWeight: 300 }}
                >
                    We&apos;re Here to Help
                </h1>
                <p className="text-[15px] md:text-[16px] text-[#555] max-w-xl mx-auto leading-relaxed">
                    Find answers to common questions about shipping, returns, sizing, and our sustainable materials.
                </p>
            </section>

            {/* FAQ Content */}
            <section className="max-w-[800px] mx-auto px-6 md:px-10 py-16 md:py-24">
                {faqData.map((section, index) => (
                    <div key={index} className="mb-14 last:mb-0">
                        <h2 className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#767676] mb-4">
                            {section.category}
                        </h2>
                        <div className="border-t border-[#E5E5E5]">
                            {section.questions.map((faq, i) => (
                                <Accordion key={i} q={faq.q} a={faq.a} />
                            ))}
                        </div>
                    </div>
                ))}
            </section>

            {/* Still need help CTA */}
            <section className="bg-[#212A2C] text-center py-20 px-6">
                <h3
                    className="text-white text-3xl md:text-4xl mb-6"
                    style={{ fontFamily: "Source Serif 4, Georgia, serif", fontWeight: 300 }}
                >
                    Still Have Questions?
                </h3>
                <p className="text-[15px] text-[#BDBDBD] mb-8 max-w-lg mx-auto">
                    If you couldn&apos;t find the answer you were looking for, our customer experience team is always ready to assist you.
                </p>
                <Link
                    to="/contact"
                    className="inline-block px-10 py-4 bg-white text-[#212A2C] text-[12px] font-bold uppercase tracking-[0.15em] hover:bg-[#F5F5F2] transition-colors"
                >
                    Contact Us
                </Link>
            </section>
        </motion.div>
    );
};

export default FAQPage;
