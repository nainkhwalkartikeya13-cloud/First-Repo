import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { selectFavoriteProduct, removeFromFavorites } from "../../redux/features/favorites/favoriteSlice";
import { addToCart } from "../../redux/features/cart/cartSlice";
import ProductCard from "./ProductCard";
import ContentWrapper from "../../components/ContentWrapper";
import { FiHeart, FiShoppingBag, FiArrowRight } from "react-icons/fi";

const Favorites = () => {
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavoriteProduct);

  const handleMoveAllToCart = () => {
    favorites.forEach(product => {
      dispatch(addToCart({ ...product, qty: 1 }));
      dispatch(removeFromFavorites({ _id: product._id }));
    });
    toast.success(`Success! ${favorites.length} items moved to bag.`, {
      position: "bottom-right",
      autoClose: 3000,
    });
  };

  const handleMoveToCart = (product) => {
    dispatch(addToCart({ ...product, qty: 1 }));
    dispatch(removeFromFavorites({ _id: product._id }));
    toast.success(`${product.name} moved to bag`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header Section */}
      <div className="bg-[#F5F5F2] py-20 px-5 mb-12">
        <ContentWrapper>
          <div className="max-w-[800px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 text-[#767676] text-[11px] font-bold uppercase tracking-[0.2em] mb-4"
            >
              <FiHeart className="w-4 h-4 fill-current text-[#BC4749]" />
              Your Collection
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-light text-[#212A2C] tracking-tight mb-6"
              style={{ fontFamily: "serif" }}
            >
              The LuxeList
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[14px] text-[#555] max-w-[500px] leading-relaxed"
            >
              Your curated selection of sustainable essentials. Save them for later or add them to your next journey.
            </motion.p>
          </div>
        </ContentWrapper>
      </div>

      <ContentWrapper>
        <AnimatePresence mode="wait">
          {favorites.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 bg-[#F5F5F2] rounded-full flex items-center justify-center mb-6">
                <FiHeart className="w-8 h-8 text-[#999]" />
              </div>
              <h2 className="text-xl font-medium text-[#212A2C] mb-3">Your LuxeList is empty</h2>
              <p className="text-[#767676] text-sm mb-8 max-w-xs mx-auto">
                Discover our collection and save your favorite sustainable essentials here.
              </p>
              <Link
                to="/shop"
                className="bg-[#212A2C] text-white px-10 py-4 text-[12px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-colors"
              >
                Start Exploring
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Actions Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-8 border-b border-[#E5E5E5]">
                <p className="text-[13px] text-[#767676]">
                  Showing <span className="font-bold text-[#212A2C]">{favorites.length}</span> curated items
                </p>
                <button
                  onClick={handleMoveAllToCart}
                  className="flex items-center justify-center gap-3 bg-[#212A2C] text-white px-8 py-4 text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-black transition-all"
                >
                  <FiShoppingBag className="w-4 h-4" />
                  Move All to Bag
                </button>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                {favorites.map((product, idx) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex flex-col h-full"
                  >
                    <ProductCard p={product} />
                    <button
                      onClick={() => handleMoveToCart(product)}
                      className="mt-4 w-full py-3 bg-[#F5F5F2] text-[#212A2C] text-[10px] font-bold uppercase tracking-[0.15em] border border-gray-100 hover:bg-[#212A2C] hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <FiShoppingBag className="w-3.5 h-3.5" />
                      Move to Bag
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Footer Link */}
              <div className="mt-24 text-center">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 group text-[12px] font-bold uppercase tracking-[0.2em] text-[#212A2C]"
                >
                  Back to Collection
                  <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </ContentWrapper>
    </div>
  );
};

export default Favorites;
