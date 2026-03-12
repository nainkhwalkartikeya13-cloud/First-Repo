import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";
import { FaStar, FaStarHalf, FaRegStar } from "react-icons/fa";
import { useState } from "react";
import { motion } from "framer-motion";
import QuickViewModal from "../../components/QuickViewModal";

const StarRating = ({ rating = 0, count }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-px">
        {[...Array(5)].map((_, i) => {
          if (i < full) return <FaStar key={i} size={10} className="text-[#2D2D2D]" />;
          if (i === full && half) return <FaStarHalf key={i} size={10} className="text-[#2D2D2D]" />;
          return <FaRegStar key={i} size={10} className="text-gray-300" />;
        })}
      </div>
      {count != null && (
        <span className="text-[10px] text-[#767676]">({count})</span>
      )}
    </div>
  );
};

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();
  const [showQuickView, setShowQuickView] = useState(false);

  const addToCartHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ ...p, qty: 1 }));
    toast.success("Added to bag", {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: true,
    });
  };

  const hasDiscount = p.discountPrice > 0 && p.price > p.discountPrice;
  const displayPrice = p.discountPrice > 0 ? p.discountPrice : p.price;

  // Variants for clean animations
  const overlayVariants = {
    initial: { opacity: 0 },
    hover: { opacity: 1 }
  };

  const actionsVariants = {
    initial: { opacity: 0, y: 20 },
    hover: { opacity: 1, y: 0 }
  };

  return (
    <>
      <motion.div
        className="group block relative cursor-pointer"
        initial="initial"
        whileHover="hover"
      >
        <Link to={`/product/${p._id}`}>
          {/* Image — Allbirds square, no border-radius */}
          <div className="relative overflow-hidden bg-[#F5F5F2] aspect-square mb-3">
            <motion.img
              variants={{
                initial: { scale: 1 },
                hover: { scale: 1.04 }
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full object-cover"
              src={p.images && p.images.length > 0 ? p.images[0] : p.image}
              alt={p.name}
              loading="lazy"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              {p.isNewArrival && (
                <span className="bg-white text-[#2D2D2D] text-[10px] font-bold uppercase tracking-[0.1em] px-3 py-1">
                  New
                </span>
              )}
              {p.isBestseller && !p.isNewArrival && (
                <span className="bg-white text-[#2D2D2D] text-[10px] font-bold uppercase tracking-[0.1em] px-3 py-1">
                  Bestseller
                </span>
              )}
              {hasDiscount && (
                <span className="bg-[#BC4749] text-white text-[10px] font-bold uppercase tracking-[0.1em] px-3 py-1">
                  Sale
                </span>
              )}
              {p.countInStock === 0 && (
                <span className="bg-white text-[#2D2D2D] text-[10px] font-bold uppercase tracking-[0.1em] px-3 py-1">
                  Sold Out
                </span>
              )}
            </div>

            {/* Heart Icon - using standard CSS group-hover for performance */}
            <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <HeartIcon product={p} />
            </div>

            {/* Tint Overlay */}
            <motion.div
              variants={overlayVariants}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/5 z-10 pointer-events-none"
            />

            {/* Quick Actions Buttons */}
            <motion.div
              variants={actionsVariants}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-0 left-0 right-0 z-20 flex flex-col"
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowQuickView(true);
                }}
                className="py-3 bg-white text-[#212A2C] text-[10px] font-bold uppercase tracking-[0.15em] border-t border-gray-100 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                Quick View
              </button>
              <button
                onClick={addToCartHandler}
                disabled={p.countInStock === 0}
                className="py-3 bg-[#212A2C] text-white text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-[#1a2022] active:bg-black transition-colors disabled:opacity-40"
              >
                {p.countInStock === 0 ? "Sold Out" : "Quick Add"}
              </button>
            </motion.div>
          </div>

          {/* Info Section */}
          <div className="space-y-1 px-1">
            <h3 className="text-[14px] font-medium text-[#212A2C] leading-tight group-hover:underline underline-offset-2">
              {p.name}
            </h3>
            <p className="text-[12px] text-[#767676]">{p.material || p.brand}</p>

            <div className="flex items-center gap-2">
              <span className="text-[14px] font-medium text-[#212A2C]">
                ₹{displayPrice?.toLocaleString("en-IN")}
              </span>
              {hasDiscount && (
                <span className="text-[13px] text-[#999] line-through">
                  ₹{p.price?.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {/* Color Swatches */}
            {p.colors?.length > 0 && (
              <div className="flex items-center gap-1.5 pt-1">
                {p.colors.slice(0, 5).map((c, i) => (
                  <span
                    key={i}
                    className="w-3 h-3 rounded-full border border-gray-200"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
                {p.colors.length > 5 && <span className="text-[10px] text-[#767676]">+{p.colors.length - 5}</span>}
              </div>
            )}
            <StarRating rating={p.rating || 0} count={p.numReviews} />
          </div>
        </Link>
      </motion.div>

      <QuickViewModal
        product={p}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  );
};

export default ProductCard;
