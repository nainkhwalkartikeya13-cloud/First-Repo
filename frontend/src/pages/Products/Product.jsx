import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <div className="group bg-surface-card border border-surface-border rounded-lg overflow-hidden hover:border-surface-border-light transition-all duration-300 w-full">
      <div className="relative h-48 lg:h-56 overflow-hidden">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
        <HeartIcon product={product} />
      </div>

      <div className="p-3">
        <Link to={`/product/${product._id}`}>
          <h4 className="text-sm lg:text-base text-text-primary hover:text-accent-pink transition-colors line-clamp-1 mb-2">
            {product.name}
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-text-primary">
              ${product.price}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};
export default Product;
