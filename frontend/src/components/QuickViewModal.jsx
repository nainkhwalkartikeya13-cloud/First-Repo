import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaStar } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import { useState } from "react";

const QuickViewModal = ({ product, isOpen, onClose }) => {
    const dispatch = useDispatch();
    const [selectedSize, setSelectedSize] = useState(null);

    if (!product) return null;

    const addToCartHandler = () => {
        if (!selectedSize && product.sizes?.length > 0) {
            toast.error("Please select a size");
            return;
        }
        dispatch(addToCart({ ...product, qty: 1, selectedSize }));
        toast.success("Added to bag!");
        onClose();
    };

    const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full text-gray-400 hover:text-black transition-colors shadow-sm"
                        >
                            <FaTimes size={18} />
                        </button>

                        {/* Image Section */}
                        <div className="md:w-1/2 bg-[#F5F5F2] flex items-center justify-center p-8">
                            <img
                                src={product.image || product.images?.[0]}
                                alt={product.name}
                                className="w-full h-full object-contain max-h-[400px]"
                            />
                        </div>

                        {/* Content Section */}
                        <div className="md:w-1/2 p-8 overflow-y-auto">
                            <h2 className="text-[24px] font-normal text-[#212A2C] mb-2" style={{ fontFamily: "serif" }}>
                                {product.name}
                            </h2>
                            <p className="text-[13px] text-[#767676] mb-4">{product.material || product.brand}</p>

                            <div className="flex items-center gap-2 mb-6">
                                <span className="text-[20px] font-medium text-[#212A2C]">
                                    ₹{displayPrice?.toLocaleString("en-IN")}
                                </span>
                                {product.discountPrice > 0 && (
                                    <span className="text-[14px] text-[#999] line-through">
                                        ₹{product.price?.toLocaleString("en-IN")}
                                    </span>
                                )}
                            </div>

                            <p className="text-[14px] text-gray-600 mb-8 line-clamp-3">
                                {product.description}
                            </p>

                            {/* Size Selector */}
                            {product.sizes?.length > 0 && (
                                <div className="mb-8">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#212A2C] mb-3">
                                        Select Size
                                    </p>
                                    <div className="grid grid-cols-4 gap-2">
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`py-3 text-[12px] font-medium transition-all ${selectedSize === size
                                                        ? "bg-[#212A2C] text-white"
                                                        : "bg-white text-[#212A2C] border border-[#E5E4E0] hover:border-[#212A2C]"
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={addToCartHandler}
                                disabled={product.countInStock === 0}
                                className="w-full py-4 bg-[#212A2C] text-white text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-[#1a2022] transition-all disabled:opacity-40"
                            >
                                {product.countInStock === 0 ? "Sold Out" : "Add To Bag"}
                            </button>

                            <div className="mt-4 text-center">
                                <button
                                    onClick={() => {
                                        onClose();
                                        window.location.href = `/product/${product._id}`;
                                    }}
                                    className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#767676] hover:text-[#212A2C] underline underline-offset-4"
                                >
                                    View Full Details
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default QuickViewModal;
