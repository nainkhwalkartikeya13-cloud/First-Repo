import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiMinus, FiPlus, FiX, FiArrowLeft, FiTruck, FiShield, FiRefreshCw } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { addToCart, removeFromCart, applyCoupon, removeCoupon } from "../redux/features/cart/cartSlice";
import {
  useValidateCouponMutation,
  useGetActiveCouponsQuery,
} from "../redux/api/couponApiSlice";
import { useState } from "react";
import { toast } from "react-toastify";
import { addToFavorites } from "../redux/features/favorites/favoriteSlice";
import { MdOutlineFavoriteBorder } from "react-icons/md";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const [couponCode, setCouponCode] = useState("");
  const [validateCoupon, { isLoading: isValidating }] = useValidateCouponMutation();
  const { data: coupons } = useGetActiveCouponsQuery();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  const moveToFavoritesHandler = (item) => {
    dispatch(addToFavorites(item));
    dispatch(removeFromCart(item._id));
    toast.success(`${item.name} moved to favorites`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  const applyCouponHandler = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await validateCoupon({ code: couponCode }).unwrap();
      dispatch(applyCoupon(res));
      toast.success(`Coupon applied! ${res.discount}% off.`);
      setCouponCode("");
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Invalid coupon code");
    }
  };

  const calculateTotal = () => {
    const itemsPrice = cartItems.reduce(
      (acc, item) => acc + (item.discountPrice > 0 ? item.discountPrice : item.price) * item.qty,
      0
    );
    const shippingPrice = itemsPrice >= 4999 ? 0 : 99;
    const taxPrice = Number(((0.15 * itemsPrice) / 1.15).toFixed(2));

    // Product savings (already included in itemsPrice via discountPrice)
    const originalItemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const productSavings = originalItemsPrice - itemsPrice;

    // Apply coupon discount if exists
    let discountAmount = 0;
    if (cart.appliedCoupon) {
      discountAmount = (itemsPrice * cart.appliedCoupon.discount) / 100;
    }

    const totalPrice = (itemsPrice - discountAmount + shippingPrice).toFixed(2);

    return {
      subtotal: itemsPrice,
      totalItems: cartItems.reduce((acc, item) => acc + item.qty, 0),
      shipping: shippingPrice,
      tax: taxPrice,
      total: Number(totalPrice),
      discountTotal: discountAmount,
      savings: productSavings // This reflects ONLY automatic product discounts now
    };
  };

  const { subtotal, totalItems, shipping, tax, total, discountTotal, savings } = calculateTotal();
  const freeShipping = shipping === 0;

  // Active coupons
  const activeCoupons = coupons?.filter(c => c.isActive && new Date(c.expiryDate) > new Date()) || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[calc(100vh-80px)] bg-white pb-20"
    >
      {/* Free shipping banner */}
      {!freeShipping && subtotal > 0 && (
        <div className="bg-[#F5F5F2] text-center py-2.5 text-[12px] text-[#212A2C] tracking-[0.04em]">
          You&apos;re <strong>₹{(4999 - subtotal).toLocaleString("en-IN")}</strong> away from free shipping!
        </div>
      )}
      {freeShipping && subtotal > 0 && (
        <div className="bg-[#2D5233] text-center py-2.5 text-[12px] text-white tracking-[0.04em]">
          You&apos;ve unlocked <strong>FREE shipping</strong>!
        </div>
      )}

      <div className="max-w-[1100px] mx-auto px-5 md:px-10 pt-8 pb-20">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-[13px] text-[#767676] hover:text-[#212A2C] transition-colors mb-5"
          >
            <FiArrowLeft size={15} />
            Continue Shopping
          </Link>
          <h1
            className="text-2xl md:text-3xl font-light text-[#212A2C]"
            style={{ fontFamily: "Source Serif 4, Georgia, serif" }}
          >
            Your Cart {totalItems > 0 && <span className="text-[#767676] text-lg">({totalItems})</span>}
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 border-2 border-[#E5E5E5] flex items-center justify-center mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#BDBDBD" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
            </div>
            <h3
              className="text-xl font-light text-[#212A2C] mb-2"
              style={{ fontFamily: "Source Serif 4, Georgia, serif" }}
            >
              Your cart is empty
            </h3>
            <p className="text-[14px] text-[#767676] mb-8 max-w-sm">
              Looks like you haven&apos;t added any sustainable essentials yet.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/shop"
                className="px-10 py-3.5 bg-[#212A2C] text-white text-[12px] font-bold uppercase tracking-[0.12em] hover:bg-[#1a2022] transition-colors"
              >
                Shop Now
              </Link>
            </motion.div>
          </div>
        ) : (
          /* ─── Cart Content ─── */
          <div className="flex flex-col lg:flex-row gap-10">

            {/* Items Column */}
            <div className="flex-1">
              {/* Column header */}
              <div className="hidden md:grid grid-cols-[1fr_130px_100px_36px] gap-4 pb-3 border-b border-[#E5E5E5] text-[10px] font-bold uppercase tracking-[0.15em] text-[#767676]">
                <span>Product</span>
                <span className="text-center">Quantity</span>
                <span className="text-right">Total</span>
                <span></span>
              </div>

              <AnimatePresence>
                {cartItems.map((item) => {
                  const hasDiscount = item.discountPrice > 0;
                  const itemPrice = hasDiscount ? item.discountPrice : item.price;

                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="grid grid-cols-[80px_1fr] md:grid-cols-[1fr_130px_100px_36px] gap-4 py-5 border-b border-[#E5E5E5]"
                    >
                      {/* Image + Info */}
                      <div className="md:col-span-1 col-span-2 flex gap-4">
                        <Link to={`/product/${item._id}`} className="shrink-0">
                          <div className="w-20 h-20 md:w-24 md:h-24 bg-[#F5F5F2] overflow-hidden">
                            <img
                              src={item.images?.length > 0 ? item.images[0] : item.image}
                              alt={item.name}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link to={`/product/${item._id}`}>
                            <h4 className="text-[14px] font-medium text-[#212A2C] hover:underline transition-colors line-clamp-2 mb-0.5">
                              {item.name}
                            </h4>
                          </Link>
                          {item.material && (
                            <p className="text-[12px] text-[#767676] mb-1">{item.material}</p>
                          )}
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[14px] font-medium text-[#212A2C]">
                              ₹{itemPrice.toLocaleString("en-IN")}
                            </span>
                            {hasDiscount && (
                              <span className="text-[12px] text-[#999] line-through">
                                ₹{item.price.toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>
                          {/* Mobile quantity + remove */}
                          <div className="flex items-center gap-4 md:hidden">
                            <div className="flex items-center border border-[#E5E5E5]">
                              <button
                                onClick={() =>
                                  item.qty > 1
                                    ? addToCartHandler(item, item.qty - 1)
                                    : removeFromCartHandler(item._id)
                                }
                                className="w-8 h-8 flex items-center justify-center hover:bg-[#F5F5F2] transition-colors"
                              >
                                <FiMinus size={12} />
                              </button>
                              <span className="w-8 h-8 flex items-center justify-center text-[13px] font-medium text-[#212A2C]">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => addToCartHandler(item, item.qty + 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-[#F5F5F2] transition-colors"
                              >
                                <FiPlus size={12} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCartHandler(item._id)}
                              className="text-[12px] text-[#767676] underline hover:text-[#212A2C] transition-colors"
                            >
                              Remove
                            </button>
                            <button
                              onClick={() => moveToFavoritesHandler(item)}
                              className="text-[12px] text-[#767676] underline hover:text-[#212A2C] transition-colors flex items-center gap-1"
                            >
                              <MdOutlineFavoriteBorder size={14} />
                              Move to Favorites
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Quantity */}
                      <div className="hidden md:flex items-center justify-center">
                        <div className="flex items-center border border-[#E5E5E5]">
                          <button
                            onClick={() =>
                              item.qty > 1
                                ? addToCartHandler(item, item.qty - 1)
                                : removeFromCartHandler(item._id)
                            }
                            className="w-9 h-9 flex items-center justify-center hover:bg-[#F5F5F2] transition-colors"
                          >
                            <FiMinus size={12} />
                          </button>
                          <span className="w-9 h-9 flex items-center justify-center text-[14px] font-medium text-[#212A2C] border-x border-[#E5E5E5]">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => addToCartHandler(item, item.qty + 1)}
                            className="w-9 h-9 flex items-center justify-center hover:bg-[#F5F5F2] transition-colors"
                          >
                            <FiPlus size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Desktop Total */}
                      <div className="hidden md:flex items-center justify-end">
                        <span className="text-[14px] font-medium text-[#212A2C]">
                          ₹{(itemPrice * item.qty).toLocaleString("en-IN")}
                        </span>
                      </div>

                      {/* Desktop Remove */}
                      <div className="hidden md:flex flex-col items-center justify-center gap-2">
                        <button
                          onClick={() => moveToFavoritesHandler(item)}
                          className="p-1 text-[#BDBDBD] hover:text-[#BC4749] transition-colors"
                          title="Move to Favorites"
                        >
                          <MdOutlineFavoriteBorder size={18} />
                        </button>
                        <button
                          onClick={() => removeFromCartHandler(item._id)}
                          className="p-1 text-[#BDBDBD] hover:text-[#212A2C] transition-colors"
                          title="Remove item"
                        >
                          <FiX size={18} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:w-[360px] shrink-0">
              <div className="bg-[#F5F5F2] p-6 lg:sticky lg:top-24">
                <h3
                  className="text-lg font-light text-[#212A2C] mb-5"
                  style={{ fontFamily: "Source Serif 4, Georgia, serif" }}
                >
                  Order Summary
                </h3>

                <div className="space-y-3 mb-5 text-[14px]">
                  <div className="flex justify-between text-[#767676]">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="text-[#212A2C] font-medium">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  {discountTotal > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Promo Discount ({cart.appliedCoupon.discount}%)</span>
                      <span>
                        -₹{discountTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                  {savings > 0 && (
                    <div className="flex justify-between text-[#2D5233]">
                      <span>Product Savings</span>
                      <span className="font-medium">
                        -₹{savings.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#767676]">
                    <span>Shipping</span>
                    <span className={`font-medium ${freeShipping ? "text-[#2D5233]" : "text-[#212A2C]"}`}>
                      {freeShipping ? "FREE" : "₹99"}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#6B7280]">
                    <span>Estimated GST (Included 15%)</span>
                    <span className="text-[#212A2C] font-medium">
                      ₹{tax.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="border-t border-[#E5E5E5] pt-3 flex justify-between text-[#212A2C] font-bold text-[18px]">
                    <span>Estimated Total</span>
                    <span>
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {(savings > 0 || discountTotal > 0) && (
                  <div className="bg-[#2D5233]/10 text-[#2D5233] text-[13px] font-medium px-4 py-2.5 mb-4">
                    You&apos;re saving ₹{(savings + discountTotal).toLocaleString("en-IN")} on this order!
                  </div>
                )}

                {/* Coupon Section */}
                <div className="mb-6 border-t border-[#E5E5E5] pt-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#212A2C]">
                      Promo Code
                    </span>
                  </div>

                  {!cart.appliedCoupon ? (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter code"
                          className="flex-1 bg-white border border-[#E5E5E5] px-3 py-2 text-[13px] outline-none focus:border-[#212A2C] transition-colors"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <button
                          onClick={applyCouponHandler}
                          disabled={isValidating}
                          className="px-4 py-2 bg-[#212A2C] text-white text-[11px] font-bold uppercase tracking-[0.1em] hover:bg-[#1a2022] transition-colors disabled:opacity-50"
                        >
                          {isValidating ? "..." : "Apply"}
                        </button>
                      </div>

                      {activeCoupons.length > 0 && (
                        <div className="bg-white border border-[#E5E5E5] p-3">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-[#767676] mb-2">
                            Available Offers
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {activeCoupons.map((coupon) => (
                              <button
                                key={coupon._id}
                                onClick={() => setCouponCode(coupon.code)}
                                className="flex items-center gap-2 border border-dashed border-[#212A2C] px-2 py-1.5 hover:bg-[#F9F9F8] transition-colors text-left group"
                              >
                                <span className="text-[12px] font-bold text-[#212A2C]">
                                  {coupon.code}
                                </span>
                                <span className="text-[11px] text-[#767676] border-l border-[#E5E5E5] pl-2 group-hover:text-[#212A2C]">
                                  {coupon.discount}% off
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 px-3 py-2 rounded">
                      <div className="flex flex-col">
                        <span className="text-[12px] font-bold text-emerald-700">
                          {cart.appliedCoupon.code}
                        </span>
                        <span className="text-[10px] text-emerald-600">
                          {cart.appliedCoupon.discount}% discount applied
                        </span>
                      </div>
                      <button
                        onClick={() => dispatch(removeCoupon())}
                        className="text-[#767676] hover:text-[#212A2C]"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={checkoutHandler}
                  className="w-full py-4 bg-[#212A2C] text-white text-[12px] font-bold uppercase tracking-[0.15em] hover:bg-[#1a2022] transition-all mb-4 shadow-lg shadow-black/5"
                >
                  Checkout
                </motion.button>

                {/* Trust signals */}
                <div className="space-y-2.5 text-[12px] text-[#767676]">
                  <div className="flex items-center gap-2.5">
                    <FiTruck size={14} className="text-[#999] shrink-0" />
                    Free shipping on orders over ₹4,999
                  </div>
                  <div className="flex items-center gap-2.5">
                    <FiRefreshCw size={14} className="text-[#999] shrink-0" />
                    30-day free returns
                  </div>
                  <div className="flex items-center gap-2.5">
                    <FiShield size={14} className="text-[#999] shrink-0" />
                    Secure checkout
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Cart;
