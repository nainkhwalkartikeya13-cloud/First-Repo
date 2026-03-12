import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";
import { motion } from "framer-motion";
import { FaStar, FaStarHalf, FaRegStar } from "react-icons/fa";

const StarRating = ({ rating = 0 }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) stars.push(<FaStar key={i} className="text-yellow-400" size={10} />);
    else if (i === fullStars && hasHalf) stars.push(<FaStarHalf key={i} className="text-yellow-400" size={10} />);
    else stars.push(<FaRegStar key={i} className="text-gray-300 dark:text-gray-700" size={10} />);
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
};

const Product = ({ product }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (e) => {
    e.preventDefault();
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success("Added to cart", {
      position: "bottom-right",
      autoClose: 1500,
      hideProgressBar: true,
    });
  };

  const discount = product.discountPrice > 0 && product.price > product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null;
  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  return (
    <div className="group relative bg-white dark:bg-gray-900/50 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800/50 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 w-full flex flex-col h-full hover:shadow-soft dark:hover:shadow-none">
      {/* Discount badge */}
      {discount && (
        <div className="absolute top-3 left-3 z-10 bg-gray-900 dark:bg-indigo-600 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
          -{discount}%
        </div>
      )}

      {/* Heart */}
      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <HeartIcon product={product} />
      </div>

      {/* Image */}
      <Link to={`/product/${product._id}`} className="block overflow-hidden bg-[#F8FAFC] dark:bg-gray-900 aspect-square">
        <img
          src={product.images && product.images.length > 0 ? product.images[0] : product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Quick Add button */}
        <button
          onClick={addToCartHandler}
          className="absolute bottom-3 left-3 right-3 py-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white text-xs font-semibold rounded-lg translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900"
        >
          <AiOutlineShoppingCart size={14} />
          Add to Cart
        </button>
      </Link>

      {/* Details */}
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/product/${product._id}`} className="flex-1">
          <h4 className="text-[13px] font-medium text-gray-900 dark:text-white line-clamp-1 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors mb-1.5">
            {product.name}
          </h4>
        </Link>

        <div className="flex items-center gap-2 mb-2">
          <StarRating rating={product.rating || 0} />
          {product.numReviews > 0 && (
            <span className="text-[10px] text-gray-400 dark:text-gray-500">({product.numReviews})</span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              ₹{displayPrice?.toLocaleString("en-IN")}
            </span>
            {discount && (
              <span className="text-[11px] text-gray-400 dark:text-gray-600 line-through">
                ₹{product.price?.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
