import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Added to cart", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  return (
    <div className="group bg-surface-card border border-surface-border rounded-lg overflow-hidden hover:border-surface-border-light transition-all duration-300 flex flex-col h-full">
      {/* Image */}
      <section className="relative h-48 lg:h-56 overflow-hidden">
        <Link to={`/product/${p._id}`}>
          <img
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={p.image}
            alt={p.name}
            loading="lazy"
          />
          <span className="absolute bottom-2 right-2 bg-brand-navy/80 backdrop-blur-sm text-text-primary text-xs font-medium px-2 py-1 rounded-md">
            {p?.brand}
          </span>
        </Link>
        <HeartIcon product={p} />
      </section>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/product/${p._id}`}>
            <h5 className="text-sm font-medium text-text-primary hover:text-accent-pink transition-colors line-clamp-1">
              {p?.name}
            </h5>
          </Link>
          <p className="font-semibold text-accent-pink text-sm whitespace-nowrap ml-2">
            {p?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>

        <div className="flex justify-between items-center mt-auto pt-2">
          <Link
            to={`/product/${p._id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-accent-pink hover:bg-accent-pink-hover rounded-md transition-colors"
          >
            View Details
            <svg className="w-3 h-3" fill="none" viewBox="0 0 14 10" aria-hidden="true">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 5h12m0 0L9 1m4 4L9 9" />
            </svg>
          </Link>

          <button
            className="p-2 rounded-full text-text-secondary hover:text-accent-pink hover:bg-surface-card-hover transition-all"
            onClick={() => addToCartHandler(p, 1)}
            aria-label={`Add ${p.name} to cart`}
          >
            <AiOutlineShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
