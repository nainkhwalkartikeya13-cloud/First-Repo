import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { FiArrowRight } from "react-icons/fi";
import { useGetSearchSuggestionsQuery, useAllProductsQuery } from "../redux/api/productApiSlice";
import HeartIcon from "../pages/Products/HeartIcon";

/* ─────────── Trending / popular searches ─────────── */
const trendingSearches = [
  "Tree Runner",
  "Wool Runner",
  "Women's Shoes",
  "Men's Shoes",
  "Pipers",
  "Trail",
  "Kids",
  "Socks",
];

/* ─────────── SEARCH OVERLAY  ─────────── */
const SearchOverlay = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const { data: allProducts } = useAllProductsQuery();
  const { data: suggestions, isLoading: isSuggestionsLoading } = useGetSearchSuggestionsQuery(debouncedQuery, {
    skip: !debouncedQuery.trim(),
  });

  /* focus input when overlay opens */
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setDebouncedQuery("");
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  /* debounce logic */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);

    return () => clearTimeout(handler);
  }, [query]);

  /* ESC to close */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  /* lock body scroll */
  useEffect(() => {
    const body = document.body;
    if (isOpen) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "";
    }
    return () => {
      body.style.overflow = "";
    };
  }, [isOpen]);

  /* filtered results (suggestions from API) */
  const results = suggestions || [];

  /* submit search → go to shop with query */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const handleTrendingClick = (term) => {
    setQuery(term);
    navigate(`/shop?search=${encodeURIComponent(term)}`);
    onClose();
  };

  const handleProductClick = () => {
    onClose();
  };

  const hasDiscount = (p) => p.discountPrice > 0 && p.price > p.discountPrice;
  const displayPrice = (p) =>
    p.discountPrice > 0 ? p.discountPrice : p.price;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[100]"
            onClick={onClose}
          />

          {/* search panel — slides down from top */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-0 left-0 right-0 z-[101] bg-white max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {/* ── search bar area ── */}
            <div className="border-b border-[#E5E5E5]">
              <div className="max-w-[900px] mx-auto px-5 md:px-8 py-6 md:py-8">
                <form onSubmit={handleSubmit} className="relative">
                  <AiOutlineSearch
                    size={22}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999]"
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="What are you looking for?"
                    className="w-full pl-12 pr-12 py-4 text-[16px] md:text-[18px] bg-[#F5F5F2] rounded-none border border-[#E5E5E5] outline-none text-[#212A2C] placeholder:text-[#999] font-light"
                    autoComplete="off"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="absolute right-14 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#212A2C] transition-colors"
                    >
                      <AiOutlineClose size={16} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#212A2C] transition-colors"
                    aria-label="Close search"
                  >
                    <AiOutlineClose size={20} />
                  </button>
                </form>
              </div>
            </div>

            {/* ── results / trending ── */}
            <div className="max-w-[1320px] mx-auto px-5 md:px-10 py-8 md:py-10">
              {/* no query → trending */}
              {!query.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#767676] mb-5">
                    Trending Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleTrendingClick(term)}
                        className="px-5 py-2.5 border border-[#E5E5E5] text-[13px] text-[#212A2C] hover:bg-[#212A2C] hover:text-white hover:border-[#212A2C] transition-all duration-200"
                      >
                        {term}
                      </button>
                    ))}
                  </div>

                  {/* popular products */}
                  {allProducts && allProducts.length > 0 && (
                    <div className="mt-10">
                      <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#767676] mb-5">
                        Popular Products
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6">
                        {allProducts
                          .filter((p) => p.isBestseller)
                          .slice(0, 4)
                          .map((p) => (
                            <Link
                              key={p._id}
                              to={`/product/${p._id}`}
                              onClick={handleProductClick}
                              className="group block"
                            >
                              <div className="relative overflow-hidden bg-[#F5F5F2] aspect-square mb-2">
                                <img
                                  src={
                                    p.images?.length > 0
                                      ? p.images[0]
                                      : p.image
                                  }
                                  alt={p.name}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                  loading="lazy"
                                />
                                {p.isBestseller && (
                                  <span className="absolute top-2 left-2 bg-white text-[#2D2D2D] text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-0.5">
                                    Bestseller
                                  </span>
                                )}
                              </div>
                              <h4 className="text-[13px] font-medium text-[#212A2C] leading-tight">
                                {p.name}
                              </h4>
                              <p className="text-[12px] text-[#767676] mt-0.5">
                                {p.material || p.brand}
                              </p>
                              <p className="text-[13px] font-medium text-[#212A2C] mt-1">
                                ₹{displayPrice(p)?.toLocaleString("en-IN")}
                              </p>
                            </Link>
                          ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* has query → results */}
              {query.trim() && (
                <div>
                  {/* header */}
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-[13px] text-[#767676]">
                      {results.length === 0
                        ? "No results found"
                        : `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`}
                    </p>
                    {results.length > 0 && (
                      <button
                        onClick={handleSubmit}
                        className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-[#212A2C] hover:opacity-60 transition-opacity"
                      >
                        View All
                        <FiArrowRight size={13} />
                      </button>
                    )}
                  </div>

                  {/* no results */}
                  {results.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12"
                    >
                      <p className="text-[#767676] text-sm mb-4">
                        We couldn't find anything for "{query}"
                      </p>
                      <p className="text-[#999] text-xs mb-6">
                        Try checking your spelling or using more general terms
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {trendingSearches.slice(0, 4).map((term) => (
                          <button
                            key={term}
                            onClick={() => handleTrendingClick(term)}
                            className="px-4 py-2 border border-[#E5E5E5] text-[12px] text-[#212A2C] hover:bg-[#212A2C] hover:text-white hover:border-[#212A2C] transition-all duration-200"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* product grid */}
                  {results.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
                      {results.map((p, idx) => (
                        <motion.div
                          key={p._id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.04, duration: 0.4, ease: "easeOut" }}
                          whileHover={{ y: -5 }}
                        >
                          <Link
                            to={`/product/${p._id}`}
                            onClick={handleProductClick}
                            className="group block"
                          >
                            {/* image */}
                            <div className="relative overflow-hidden bg-[#F5F5F2] aspect-[4/5] mb-4">
                              <img
                                src={
                                  p.images?.length > 0
                                    ? p.images[0]
                                    : p.image
                                }
                                alt={p.name}
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                loading="lazy"
                              />
                              {/* badges */}
                              <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                                {p.isNewArrival && (
                                  <span className="bg-white text-[#2D2D2D] text-[9px] font-bold uppercase tracking-[0.1em] px-2.5 py-0.5">
                                    New
                                  </span>
                                )}
                                {p.isBestseller && !p.isNewArrival && (
                                  <span className="bg-white text-[#2D2D2D] text-[9px] font-bold uppercase tracking-[0.1em] px-2.5 py-0.5">
                                    Bestseller
                                  </span>
                                )}
                                {hasDiscount(p) && (
                                  <span className="bg-[#BC4749] text-white text-[9px] font-bold uppercase tracking-[0.1em] px-2.5 py-0.5">
                                    Sale
                                  </span>
                                )}
                              </div>
                              {/* heart */}
                              <div className="absolute top-2.5 right-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <HeartIcon product={p} />
                              </div>
                            </div>

                            {/* info */}
                            <div className="space-y-0.5">
                              <h3 className="text-[13px] font-medium text-[#212A2C] leading-tight">
                                {p.name}
                              </h3>
                              <p className="text-[11px] text-[#767676]">
                                {p.material || p.brand}
                              </p>
                              {/* color dots */}
                              {p.colors?.length > 0 && (
                                <div className="flex items-center gap-1.5 pt-0.5">
                                  {p.colors.slice(0, 5).map((c, i) => (
                                    <span
                                      key={i}
                                      className="w-2.5 h-2.5 rounded-full border border-gray-200"
                                      style={{ backgroundColor: c.hex }}
                                      title={c.name}
                                    />
                                  ))}
                                  {p.colors.length > 5 && (
                                    <span className="text-[9px] text-[#767676]">
                                      +{p.colors.length - 5}
                                    </span>
                                  )}
                                </div>
                              )}
                              {/* price */}
                              <div className="flex items-center gap-2 pt-0.5">
                                <span className="text-[13px] font-medium text-[#212A2C]">
                                  ₹{displayPrice(p)?.toLocaleString("en-IN")}
                                </span>
                                {hasDiscount(p) && (
                                  <span className="text-[12px] text-[#999] line-through">
                                    ₹{p.price?.toLocaleString("en-IN")}
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
