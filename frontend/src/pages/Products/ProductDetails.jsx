import { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
  useGetProductsQuery,
} from "../../redux/api/productApiSlice";
import { useCheckPurchaseQuery } from "../../redux/api/orderApiSlice";
import HeartIcon from "./HeartIcon";
import {
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaLeaf,
  FaChevronDown,
  FaChevronUp,
  FaCheck,
} from "react-icons/fa";
import {
  BsTruck,
  BsArrowRepeat,
  BsShieldCheck,
} from "react-icons/bs";
import { FiMinus, FiPlus } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { ProductDetailsSkeleton } from "../../components/Skeletons";
import Message from "../../components/Message";
import { addToCart } from "../../redux/features/cart/cartSlice";
import moment from "moment"; // Added

/* ───────────────────────────────────────────
   HELPERS
   ─────────────────────────────────────────── */

const StarRating = ({ rating = 0, count, size = 14 }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-px">
        {[...Array(5)].map((_, i) => {
          if (i < full)
            return <FaStar key={i} size={size} className="text-[#212A2C]" />;
          if (i === full && half)
            return (
              <FaStarHalfAlt key={i} size={size} className="text-[#212A2C]" />
            );
          return <FaRegStar key={i} size={size} className="text-[#D9D9D9]" />;
        })}
      </div>
      {count != null && (
        <button className="text-[13px] text-[#212A2C] underline underline-offset-2 hover:text-[#767676] transition-colors">
          {count} Review{count !== 1 ? "s" : ""}
        </button>
      )}
    </div>
  );
};

const Accordion = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-[#E5E4E0]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#212A2C]">
          {title}
        </span>
        {open ? (
          <FaChevronUp size={11} className="text-[#767676]" />
        ) : (
          <FaChevronDown size={11} className="text-[#767676]" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ───────────────────────────────────────────
   MAIN COMPONENT
   ─────────────────────────────────────────── */

const ProductDetails = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const reviewsRef = useRef(null);

  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(""); // Changed from null to ""
  const [selectedColor, setSelectedColor] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);
  const { data: allProductsData } = useGetProductsQuery({});
  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const { data: purchaseData, isLoading: isLoadingPurchase } = useCheckPurchaseQuery(productId, {
    skip: !userInfo,
  });

  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowSticky(true);
      } else {
        setShowSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      setRating(0);
      setComment("");
      toast.success("Review submitted!");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    if (!selectedSize && product?.sizes?.length > 0) {
      toast.error("Please select a size");
      return;
    }
    dispatch(
      addToCart({
        ...product,
        qty,
        selectedSize,
        selectedColor: product?.colors?.[selectedColor]?.name,
      })
    );
    toast.success("Added to bag!");
  };

  const scrollToReviews = () =>
    reviewsRef.current?.scrollIntoView({ behavior: "smooth" });

  const allImages = product
    ? [product.image, ...(product.images || [])].filter(Boolean)
    : [];
  const uniqueImages = [...new Set(allImages)];

  const relatedProducts = allProductsData?.products
    ?.filter((p) => {
      const pCatId = p.category?._id || p.category;
      const currentCatId = product?.category?._id || product?.category;
      const isMatch = p._id !== productId && pCatId === currentCatId && pCatId !== undefined;
      return isMatch;
    })
    ?.slice(0, 4);

  console.log("Current Product ID:", productId);
  console.log("Current Product Category ID:", product?.category?._id || product?.category);
  console.log("Total Products in Data:", allProductsData?.products?.length);
  console.log("Related Products Found:", relatedProducts?.length);

  const discount =
    product?.discountPrice > 0 && product?.price > product?.discountPrice
      ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
      )
      : null;

  const displayPrice =
    product?.discountPrice > 0 ? product.discountPrice : product?.price;

  const highlights = [
    product?.material &&
    `Made with ${product.material.toLowerCase()} for comfort`,
    "Lightweight & breathable for all-day wear",
    product?.sustainability || "Responsibly sourced materials",
    "Refined outsole built for everyday traction",
  ].filter(Boolean);

  const reviewCounts = product?.reviews
    ? [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: product.reviews.filter((r) => Math.floor(r.rating) === star)
        .length,
    }))
    : [];
  const totalReviews = product?.reviews?.length || 0;

  // Recently Viewed Logic
  useEffect(() => {
    if (product?._id) {
      const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      const updatedViewed = [
        product,
        ...recentlyViewed.filter((p) => p._id !== product._id),
      ].slice(0, 10);
      localStorage.setItem("recentlyViewed", JSON.stringify(updatedViewed));
    }
  }, [product]);

  if (isLoading) return <ProductDetailsSkeleton />;
  if (error)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Message variant="danger">
          {error?.data?.message || error?.message}
        </Message>
      </div>
    );

  // The original submitHandler for reviews was here, but it's now moved up.
  // This block is removed as per the instruction's implied change.

  const addBundleHandler = () => {
    // Add current product
    dispatch(addToCart({ ...product, qty: 1 }));
    // Add first related product as a bundle
    if (relatedProducts?.length > 0) {
      dispatch(addToCart({ ...relatedProducts[0], qty: 1 }));
      toast.success("Bundle added to bag!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white min-h-screen"
    >
      <div className="max-w-[1400px] mx-auto">
        <nav className="px-5 md:px-10 py-4 flex items-center gap-2 text-[12px] text-[#767676]">
          <Link to="/" className="hover:text-[#212A2C] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#212A2C] transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-[#212A2C]">{product?.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] xl:grid-cols-[1fr_480px]">
          <div className="bg-[#F5F5F2]">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative aspect-square overflow-hidden"
              >
                <img
                  src={uniqueImages[selectedImage] || product?.image}
                  alt={product?.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-5 right-5 z-10">
                  <HeartIcon product={product} />
                </div>
                {discount ? (
                  <div className="absolute top-5 left-5 bg-[#BC4749] text-white text-[11px] font-bold uppercase tracking-[0.1em] px-3 py-1.5">
                    Sale
                  </div>
                ) : product?.isNewArrival ? (
                  <div className="absolute top-5 left-5 bg-white text-[#212A2C] text-[11px] font-bold uppercase tracking-[0.1em] px-3 py-1.5 shadow-sm">
                    New
                  </div>
                ) : null}
              </motion.div>
            </AnimatePresence>

            {uniqueImages.length > 1 && (
              <div className="flex gap-1 p-2 overflow-x-auto bg-white">
                {uniqueImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-[72px] h-[72px] overflow-hidden transition-all ${selectedImage === index
                      ? "ring-2 ring-[#212A2C]"
                      : "ring-1 ring-transparent hover:ring-[#BDBDBD]"
                      }`}
                  >
                    <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="px-6 md:px-10 py-8 lg:py-10 lg:overflow-y-auto lg:max-h-[calc(100vh-120px)] lg:sticky lg:top-[104px] lg:self-start">
            <div className="mb-5">
              <h1
                className="text-[26px] md:text-[30px] text-[#212A2C] leading-tight mb-1"
                style={{ fontFamily: "serif", fontWeight: 400 }}
              >
                {product?.name}
              </h1>
              {product?.material && <p className="text-[13px] text-[#767676] mb-3">{product.material}</p>}
              <div onClick={scrollToReviews} className="cursor-pointer">
                <StarRating rating={product?.rating} count={product?.numReviews} />
              </div>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <span className="text-[22px] font-medium text-[#212A2C]">
                ₹{displayPrice?.toLocaleString("en-IN")}
              </span>
              {discount && (
                <>
                  <span className="text-[15px] text-[#999] line-through">
                    ₹{product?.price?.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[12px] font-bold text-[#BC4749]">{discount}% off</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3 px-4 py-3 bg-[#F5F5F2] rounded-md mb-5">
              <BsShieldCheck size={18} className="text-[#212A2C] shrink-0" />
              <div className="flex-1">
                <span className="text-[13px] font-medium text-[#212A2C]">Returns Protection</span>
                <span className="text-[12px] text-[#767676] ml-1">
                  — Hassle-free, 30-day returns.
                </span>
              </div>
            </div>

            {product?.colors?.length > 0 && (
              <div className="mb-5">
                <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#212A2C] mb-3">
                  {product.colors.length} Colors | {product.colors[selectedColor]?.name}
                </p>
                <div className="flex gap-2">
                  {product.colors.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(i)}
                      className={`w-9 h-9 rounded-full transition-all ${selectedColor === i ? "ring-2 ring-[#212A2C] ring-offset-2" : "ring-1 ring-gray-200"
                        }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {product?.sizes?.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#212A2C]">Select Size</p>
                  <button className="text-[12px] text-[#767676] underline underline-offset-2">Size Guide</button>
                </div>
                <div className="grid grid-cols-4 gap-[6px]">
                  {product.sizes.map((size) => {
                    const isOutOfStock = product?.outOfStockSizes?.includes(String(size));
                    return (
                      <button
                        key={size}
                        disabled={isOutOfStock}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 text-[13px] font-medium text-center rounded-[2px] transition-all relative ${isOutOfStock
                          ? "bg-[#F9F9F8] text-[#D9D9D9] border border-[#E5E4E0] cursor-not-allowed group"
                          : selectedSize === size
                            ? "bg-[#212A2C] text-white"
                            : "bg-white text-[#212A2C] border border-[#E5E4E0] hover:border-[#212A2C]"
                          }`}
                      >
                        <span className={isOutOfStock ? "opacity-50 line-through" : ""}>{size}</span>
                        {isOutOfStock && (
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[1px] bg-[#D9D9D9] -rotate-12 pointer-events-none"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {product?.countInStock > 0 && (
              <div className="flex items-center gap-4 mb-5">
                <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#212A2C]">Qty</p>
                <div className="flex items-center border border-[#E5E4E0]">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-[#212A2C]"><FiMinus size={14} /></button>
                  <span className="w-10 h-10 flex items-center justify-center text-[14px] font-medium text-[#212A2C]">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.countInStock, q + 1))} className="w-10 h-10 flex items-center justify-center text-[#212A2C]"><FiPlus size={14} /></button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between py-4 border-t border-b border-[#E5E4E0] mb-5">
              <div className="flex items-center gap-3">
                <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#767676]">Subtotal</span>
                <span className="text-[18px] font-medium text-[#212A2C]">₹{((displayPrice || 0) * qty).toLocaleString("en-IN")}</span>
              </div>
              <div className="text-right text-[13px] font-medium text-[#2D5233]">
                {((displayPrice || 0) * qty) >= 4999 ? "FREE SHIPPING" : "+ ₹99 SHIPPING"}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={addToCartHandler}
              disabled={product?.countInStock === 0}
              className="w-full py-4 bg-[#212A2C] text-white text-[12px] font-bold uppercase tracking-[0.15em] hover:bg-[#1a2022] transition-all disabled:opacity-40 mb-5 shadow-lg shadow-black/5"
            >
              {product?.countInStock === 0 ? "Sold Out" : "Add To Bag"}
            </motion.button>



            <div className="space-y-4 mt-8 pt-8 border-t border-[#E5E4E0]">
              <div className="flex items-center gap-3 text-[12px] text-[#767676]"><BsTruck size={14} /> Free shipping over ₹4,999</div>
              <div className="flex items-center gap-3 text-[12px] text-[#767676]"><BsArrowRepeat size={14} /> Free returns within 30 days</div>
              <div className="flex items-center gap-3 text-[12px] text-[#767676]"><FaLeaf size={14} /> {product?.sustainability || "Natural materials"}</div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-[90] md:hidden flex items-center justify-between gap-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-bold text-[#212A2C] truncate max-w-[150px]">{product?.name}</span>
                {discount && (
                  <span className="bg-[#BC4749] text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm">Sale</span>
                )}
              </div>
              <span className="text-[14px] font-medium text-[#212A2C]">₹{displayPrice?.toLocaleString("en-IN")}</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={addToCartHandler}
              className="px-8 py-3 bg-[#212A2C] text-white text-[11px] font-bold uppercase tracking-[0.15em] shrink-0 active:scale-95 transition-transform"
            >
              Add To Bag
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="max-w-[1400px] mx-auto px-5 md:px-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#767676] mb-4">Why We Love This</h2>
            <p className="text-[15px] text-[#212A2C] leading-relaxed mb-6">{product?.description}</p>
          </div>
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#767676] mb-5">Highlights</h3>
            <ul className="space-y-4">
              {highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-3">
                  <FaCheck size={10} className="text-[#2D5233] mt-1" />
                  <span className="text-[14px] text-[#212A2C]">{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 max-w-3xl">
          <Accordion title="Materials & Sustainability">
            <p className="text-[14px] text-[#767676]">{product?.sustainability || "Responsible materials."}</p>
          </Accordion>
          <Accordion title="Care Instructions">
            <p className="text-[14px] text-[#767676]">Machine wash cold, air dry.</p>
          </Accordion>
        </div>
      </section>

      {uniqueImages.length > 1 && (
        <section className="bg-white py-16 text-center">
          <h2 className="text-[#212A2C] mb-10 text-3xl" style={{ fontFamily: "serif" }}>Your New Daily MVP.</h2>
          <div className="flex flex-wrap justify-center gap-1 xl:gap-2">
            {uniqueImages.slice(0, 4).map((img, i) => (
              <div key={i} className="aspect-[4/5] overflow-hidden w-[calc(50%-4px)] md:w-[calc(33.33%-4px)] lg:w-[calc(25%-8px)] max-w-[400px]">
                <img src={img} alt="Lifestyle" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}

      <section ref={reviewsRef} className="max-w-[1000px] mx-auto px-5 md:px-10 py-24 border-t border-gray-100">
        <div className="flex flex-col md:flex-row gap-16">
          {/* Review Summary & Stats */}
          <div className="md:w-[30%]">
            <h2 className="text-3xl font-serif text-[#212A2C] mb-6">Customer Reviews</h2>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-4xl font-bold text-[#212A2C]">{product?.rating?.toFixed(1)}</span>
              <div className="flex flex-col">
                <StarRating rating={product?.rating} size={16} />
                <p className="text-[12px] text-[#767676] mt-1">Based on {totalReviews} reviews</p>
              </div>
            </div>

            {/* Rating Bars */}
            <div className="mt-8 space-y-2">
              {reviewCounts.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-[#212A2C] w-3">{star}</span>
                  <div className="flex-1 h-2 bg-[#F5F5F2] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: totalReviews > 0 ? `${(count / totalReviews) * 100}%` : 0 }}
                      className="h-full bg-[#212A2C]"
                    />
                  </div>
                  <span className="text-[11px] text-[#767676] w-6">{count}</span>
                </div>
              ))}
            </div>

            {userInfo ? (
              isLoadingPurchase ? (
                <div className="mt-12 p-6 bg-[#F9F9F8] text-center rounded-lg">
                  <p className="text-[13px] text-[#767676]">Verifying purchase status...</p>
                </div>
              ) : purchaseData?.purchased ? (
                <div className="mt-12 p-6 bg-[#F9F9F8] rounded-lg">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#212A2C] mb-4">Review this product</h3>
                  <p className="text-[13px] text-[#767676] mb-6">Share your thoughts with other customers</p>
                  <form onSubmit={submitHandler} className="space-y-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#767676]">Rating</label>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setRating(s)}
                            className="transition-transform active:scale-95 hover:scale-110"
                          >
                            {s <= rating ? (
                              <FaStar className="text-[#21A366]" size={22} />
                            ) : (
                              <FaRegStar className="text-[#D9D9D9] hover:text-[#999]" size={22} />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#767676]">Comment</label>
                      <textarea
                        placeholder="Share your experience (e.g., fit, comfort, style)..."
                        className="w-full bg-white border border-[#E5E5E5] p-4 text-[14px] outline-none focus:border-[#212A2C] transition-colors resize-none rounded-sm shadow-inner shadow-black/5"
                        rows="4"
                        required
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </div>
                    <button
                      disabled={loadingProductReview || rating === 0}
                      type="submit"
                      className="w-full py-4 bg-[#212A2C] text-white text-[12px] font-bold uppercase tracking-[0.14em] hover:bg-[#1a2022] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
                    >
                      {loadingProductReview ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="mt-12 p-6 bg-[#F9F9F8] text-center rounded-lg">
                  <p className="text-[13px] text-[#767676] mb-4">Only verified buyers can leave a review.</p>
                  <p className="text-[11px] text-[#999] uppercase tracking-wider">Purchase this item to share your experience</p>
                </div>
              )
            ) : (
              <div className="mt-12 p-6 bg-[#F9F9F8] text-center rounded-lg">
                <p className="text-[13px] text-[#767676] mb-4">Please log in to leave a review.</p>
                <Link
                  to="/login"
                  className="inline-block px-6 py-2 bg-[#212A2C] text-white text-[11px] font-bold uppercase tracking-[0.15em]"
                >
                  Log In
                </Link>
              </div>
            )}
          </div>

          {/* Review List */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#212A2C]">
                Showing {totalReviews} Review{totalReviews !== 1 ? "s" : ""}
              </h3>
            </div>

            {totalReviews === 0 ? (
              <div className="py-20 text-center">
                <p className="text-[15px] text-[#767676] italic">No reviews yet. Be the first to share your experience!</p>
              </div>
            ) : (
              <div className="space-y-12">
                {[...product.reviews].reverse().map((review) => (
                  <div key={review._id} className="group">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[13px] font-bold text-[#212A2C] uppercase tracking-tight block">
                            {review.name}
                          </span>
                          <span className="bg-[#F5F5F2] text-[#2D5233] text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                            Verified Buyer
                          </span>
                        </div>
                        <span className="text-[11px] text-[#999] font-medium">{moment(review.createdAt).format("MMMM D, YYYY")}</span>
                      </div>
                      <StarRating rating={review.rating} size={13} />
                    </div>
                    <p className="text-[15px] text-[#333] leading-relaxed font-light mt-3">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {product?.productCollection && (
        <section className="bg-[#212A2C] py-16 text-center">
          <h2
            className="text-white mb-3"
            style={{
              fontFamily: "serif",
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              fontWeight: 300,
            }}
          >
            The {product.productCollection} Collection
          </h2>
          <p className="text-[14px] text-[#BDBDBD] mb-6">
            Our boldest takes, your perfect match.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/shop"
              className="px-8 py-3 text-[11px] font-bold uppercase tracking-[0.15em] bg-white text-[#212A2C] hover:bg-[#F5F5F2] transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </section>
      )}

      <section className="relative overflow-hidden">
        <div className="bg-[#4A6741] py-20 px-5 text-center">
          <h2
            className="text-white max-w-xl mx-auto mb-4"
            style={{
              fontFamily: "serif",
              fontSize: "clamp(1.5rem, 3.5vw, 2.4rem)",
              fontWeight: 300,
            }}
          >
            {`Better Things in a Better Way`}
          </h2>
          <p className="text-[14px] text-white/80 max-w-md mx-auto mb-6">
            {`We believe comfort, design, and sustainability aren't mutually
            exclusive. That's why every product starts with natural materials.`}
          </p>
          <Link
            to="/shop"
            className="inline-block px-8 py-3 text-[11px] font-bold uppercase tracking-[0.15em] bg-white text-[#212A2C] hover:bg-[#F5F5F2] transition-colors"
          >
            Learn More
          </Link>
        </div>
      </section>


    </motion.div>
  );
};

export default ProductDetails;
