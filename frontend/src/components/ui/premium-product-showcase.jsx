import { motion } from 'framer-motion';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useGetProductsQuery } from '../../redux/api/productApiSlice';
import Loader from '../Loader';

export function PremiumProductShowcase() {
  const { data, isLoading, isError } = useGetProductsQuery({ keyword: '' });

  if (isLoading) return <div className="flex justify-center py-20"><Loader /></div>;
  if (isError) return null;

  const products = data?.products?.slice(0, 4) || [];

  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-32">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-slate-400 uppercase tracking-wider text-sm mb-4 font-semibold">
            Curated Selection
          </p>
          <h2
            className="text-4xl md:text-6xl font-bold mb-6"
            style={{
              fontFamily: "'Outfit', sans-serif",
              background: 'linear-gradient(to bottom, #f8fafc 0%, #cbd5e1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Featured Products
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Handpicked premium technology for discerning customers
          </p>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <div className="relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all duration-300">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-slate-800">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
            <button className="w-full bg-white text-slate-900 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
              <FiShoppingCart />
              Quick Add
            </button>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-slate-700">
            <FiStar className="text-yellow-400 fill-yellow-400 text-sm" />
            <span className="text-white text-sm font-semibold">{product.rating}</span>
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-700">
            <span className="text-slate-300 text-xs font-semibold uppercase tracking-wide">
              {product.brand}
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6 space-y-3">
          <h3 className="text-xl font-bold text-white group-hover:text-slate-200 transition-colors truncate" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {product.name}
          </h3>

          <p className="text-slate-400 text-sm truncate">
            {product.description}
          </p>

          <div className="flex justify-between items-center pt-2">
            <div className="flex flex-col">
              {product.discountPrice > 0 ? (
                <>
                  <span className="text-sm text-slate-500 line-through">${product.price}</span>
                  <span className="text-2xl font-bold text-white">${product.discountPrice}</span>
                </>
              ) : (
                <span className="text-2xl font-bold text-white">${product.price}</span>
              )}
            </div>
            <Link to={`/product/${product._id}`}>
              <button className="text-slate-400 hover:text-white transition-colors text-sm font-semibold">
                View Details →
              </button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
