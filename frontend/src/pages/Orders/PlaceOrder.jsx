import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import ProgressSteps from "../../components/ProgressSteps";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import { BASE_URL } from "../../redux/constants";
import axios from "axios";
import {
  FiLock,
  FiTruck,
  FiRefreshCw,
  FiChevronLeft,
} from "react-icons/fi";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const { shippingAddress, cartItems } = cart;

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress.address, navigate]);

  /* ─── pricing helpers ─── */
  const itemsPrice = cartItems.reduce(
    (acc, item) =>
      acc +
      (item.discountPrice > 0 ? item.discountPrice : item.price) * item.qty,
    0
  );

  const discountAmount = cart.appliedCoupon ? (itemsPrice * cart.appliedCoupon.discount) / 100 : 0;
  const subtotalAfterPromo = itemsPrice - discountAmount;

  const freeShipping = itemsPrice >= 4999;
  const shippingCost = freeShipping ? 0 : 99;
  const tax = Math.round(((itemsPrice * 0.15) / 1.15) * 100) / 100;
  const total = subtotalAfterPromo + shippingCost;

  const placeOrderHandler = async () => {
    try {
      setPaymentLoading(true);

      const res = await createOrder({
        orderItems: cart.cartItems.map(item => ({ ...item, size: item.selectedSize })),
        shippingAddress: cart.shippingAddress,
        paymentMethod: "Razorpay",
        itemsPrice: itemsPrice, // Send original items total
        shippingPrice: shippingCost,
        taxPrice: tax,
        totalPrice: total,
      }).unwrap();

      if (!res || !res._id) {
        toast.error("Order creation failed. Please try again.");
        setPaymentLoading(false);
        return;
      }

      // Use the backend-calculated total so Razorpay amount matches the DB order
      const chargeAmount = Number(res.totalPrice) || total;

      const { data: razorpayOrder } = await axios.post(
        `${BASE_URL}/api/v1/razorpay/create-order`,
        { amount: chargeAmount, mongoOrderId: res._id },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "AEROLITH",
        description: `Order #${res._id}`,
        order_id: razorpayOrder.razorpayOrderId,
        handler: async function (response) {
          try {
            const { data } = await axios.post(
              `${BASE_URL}/api/v1/razorpay/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                mongoOrderId: res._id,
              },
              {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
              }
            );

            if (data.success) {
              dispatch(clearCartItems());
              toast.success("Payment successful!");
              navigate(`/order/${res._id}`);
            }
          } catch (error) {
            toast.error(
              error?.response?.data?.message || "Payment verification failed!"
            );
            setPaymentLoading(false);
          }
        },
        prefill: {
          name: `${shippingAddress.firstName || ""} ${shippingAddress.lastName || ""}`.trim() || userInfo?.username || "",
          email: userInfo?.email || "",
          contact: shippingAddress.phone || "",
        },
        notes: {
          address: `${shippingAddress.address}, ${shippingAddress.city}`,
        },
        theme: { color: "#212A2C" },
        modal: {
          ondismiss: function () {
            setPaymentLoading(false);
            toast.info("Payment cancelled");
          },
        },
      };

      if (typeof window.Razorpay === "undefined") {
        toast.error("Razorpay SDK not loaded. Please refresh the page.");
        setPaymentLoading(false);
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        toast.error(`Payment Failed: ${response.error.description}`);
        setPaymentLoading(false);
      });
      rzp.open();
    } catch (error) {
      console.error("PlaceOrder error:", error);
      const msg =
        error?.data?.message ||
        error?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Error creating order";
      toast.error(msg);
      setPaymentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Top bar ─── */}
      <header className="border-b border-[#E5E5E5]">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 py-5">
          <Link
            to="/"
            className="text-[22px] font-bold tracking-tight text-[#212A2C]"
            style={{ fontFamily: "Source Serif 4, Georgia, serif" }}
          >
            AEROLITH
          </Link>
          <ProgressSteps step1 step2 step3 />
          <FiLock className="text-[#999] hidden sm:block" size={16} />
        </div>
      </header>

      {/* ─── Main layout ─── */}
      <div className="max-w-[1200px] mx-auto flex flex-col-reverse lg:flex-row">
        {/* ════════════ LEFT — Review ════════════ */}
        <div className="flex-1 px-6 md:px-10 lg:pr-14 py-8 lg:py-10 lg:border-r border-[#E5E5E5]">
          {/* Back link */}
          <Link
            to="/shipping"
            className="inline-flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#212A2C] transition-colors mb-6"
          >
            <FiChevronLeft size={14} />
            Return to information
          </Link>

          <h1
            className="text-[24px] font-light text-[#212A2C] mb-8"
            style={{ fontFamily: "Source Serif 4, Georgia, serif" }}
          >
            Review Your Order
          </h1>

          {/* ── Info cards ── */}
          <div className="rounded-lg border border-[#E5E5E5] divide-y divide-[#E5E5E5] mb-8">
            {/* Contact */}
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-start gap-3 min-w-0">
                <span className="text-[12px] text-[#999] uppercase tracking-[0.08em] w-16 shrink-0 pt-0.5">
                  Contact
                </span>
                <span className="text-[14px] text-[#212A2C] truncate">
                  {userInfo?.email}
                </span>
              </div>
              <Link
                to="/shipping"
                className="text-[13px] text-[#6B7280] underline hover:text-[#212A2C] transition-colors shrink-0 ml-4"
              >
                Change
              </Link>
            </div>

            {/* Ship to */}
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-start gap-3 min-w-0">
                <span className="text-[12px] text-[#999] uppercase tracking-[0.08em] w-16 shrink-0 pt-0.5">
                  Ship to
                </span>
                <span className="text-[14px] text-[#212A2C] truncate">
                  {shippingAddress.address}
                  {shippingAddress.apartment
                    ? `, ${shippingAddress.apartment}`
                    : ""}
                  , {shippingAddress.city}{" "}
                  {shippingAddress.state
                    ? `${shippingAddress.state} `
                    : ""}
                  {shippingAddress.postalCode}, {shippingAddress.country}
                </span>
              </div>
              <Link
                to="/shipping"
                className="text-[13px] text-[#6B7280] underline hover:text-[#212A2C] transition-colors shrink-0 ml-4"
              >
                Change
              </Link>
            </div>

            {/* Method */}
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-start gap-3 min-w-0">
                <span className="text-[12px] text-[#999] uppercase tracking-[0.08em] w-16 shrink-0 pt-0.5">
                  Method
                </span>
                <span className="text-[14px] text-[#212A2C]">
                  {freeShipping
                    ? "Free Shipping"
                    : "Standard Shipping · ₹99"}
                </span>
              </div>
            </div>

            {/* Payment */}
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-start gap-3 min-w-0">
                <span className="text-[12px] text-[#999] uppercase tracking-[0.08em] w-16 shrink-0 pt-0.5">
                  Payment
                </span>
                <span className="text-[14px] text-[#212A2C]">Razorpay</span>
              </div>
            </div>
          </div>

          {/* ── Order items ── */}
          <h2 className="text-[16px] font-semibold text-[#212A2C] mb-4">
            Items in your order
          </h2>

          <div className="space-y-0 divide-y divide-[#E5E5E5] border border-[#E5E5E5] rounded-lg mb-8">
            {cartItems.map((item) => {
              const price =
                item.discountPrice > 0 ? item.discountPrice : item.price;
              const hasDiscount =
                item.discountPrice > 0 && item.price > item.discountPrice;
              return (
                <div
                  key={item._id}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] overflow-hidden">
                      <img
                        src={
                          item.images?.length > 0
                            ? item.images[0]
                            : item.image
                        }
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#767676] text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                      {item.qty}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-[#212A2C] leading-snug line-clamp-1">
                      {item.name}
                    </p>
                    {item.selectedSize && (
                      <p className="text-[11px] text-[#999]">Size: {item.selectedSize}</p>
                    )}
                    {hasDiscount && (
                      <p className="text-[12px] text-[#999] line-through">
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>
                    )}
                  </div>
                  <span className="text-[14px] font-medium text-[#212A2C] shrink-0">
                    ₹{(price * item.qty).toLocaleString("en-IN")}
                  </span>
                </div>
              );
            })}
          </div>

          {/* ── Pay Now ── */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-md text-[14px] text-red-700">
              {error?.data?.message || "Something went wrong"}
            </div>
          )}

          <button
            type="button"
            disabled={
              cartItems.length === 0 || isLoading || paymentLoading
            }
            onClick={placeOrderHandler}
            className="w-full py-4 bg-[#212A2C] text-white text-[13px] font-bold uppercase tracking-[0.12em] rounded-md hover:bg-[#1a2022] active:scale-[0.995] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading || paymentLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Processing…
              </>
            ) : (
              <>
                <FiLock size={14} />
                Pay now
              </>
            )}
          </button>

          {/* Policies */}
          <div className="flex items-center justify-center gap-4 mt-5 text-[11px] text-[#999]">
            <span className="underline cursor-pointer hover:text-[#212A2C] transition-colors">
              Refund policy
            </span>
            <span className="underline cursor-pointer hover:text-[#212A2C] transition-colors">
              Privacy policy
            </span>
            <span className="underline cursor-pointer hover:text-[#212A2C] transition-colors">
              Terms of service
            </span>
          </div>
        </div>

        {/* ════════════ RIGHT — Order Summary ════════════ */}
        <aside className="lg:w-[440px] shrink-0 bg-[#FAFAFA] border-b lg:border-b-0 border-[#E5E5E5] px-6 md:px-10 py-8 lg:py-10">
          {/* Cart items */}
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => {
              const price =
                item.discountPrice > 0 ? item.discountPrice : item.price;
              return (
                <div key={item._id} className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-lg border border-[#E5E5E5] bg-white overflow-hidden">
                      <img
                        src={
                          item.images?.length > 0
                            ? item.images[0]
                            : item.image
                        }
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#767676] text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                      {item.qty}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[#212A2C] leading-snug line-clamp-2">
                      {item.name}
                    </p>
                    {item.brand && (
                      <p className="text-[12px] text-[#999]">{item.brand}</p>
                    )}
                  </div>
                  <span className="text-[14px] font-medium text-[#212A2C] shrink-0">
                    ₹{(price * item.qty).toLocaleString("en-IN")}
                  </span>
                </div>
              );
            })}
          </div>

          <hr className="border-[#E5E5E5] mb-4" />

          {/* Totals */}
          <div className="space-y-2.5 text-[14px]">
            <div className="flex justify-between text-[#6B7280]">
              <span>
                Subtotal ·{" "}
                {cartItems.reduce((acc, i) => acc + i.qty, 0)} items
              </span>
              <span className="text-[#212A2C] font-medium">
                ₹{itemsPrice.toLocaleString("en-IN")}
              </span>
            </div>

            {cart.appliedCoupon && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Promo Discount ({cart.appliedCoupon.discount}%)</span>
                <span>
                  -₹{discountAmount.toLocaleString("en-IN")}
                </span>
              </div>
            )}

            <div className="flex justify-between text-[#6B7280]">
              <span>Shipping</span>
              <span
                className={`font-medium ${freeShipping ? "text-[#2D5233]" : "text-[#212A2C]"
                  }`}
              >
                {freeShipping ? "FREE" : "₹99"}
              </span>
            </div>
            <div className="flex justify-between text-[#6B7280]">
              <span>Estimated GST (Included 15%)</span>
              <span className="text-[#212A2C] font-medium">
                ₹{tax.toLocaleString("en-IN")}
              </span>
            </div>
            <hr className="border-[#E5E5E5]" />
            <div className="flex justify-between items-center pt-1">
              <span className="text-[16px] font-bold text-[#212A2C]">
                Total
              </span>
              <span className="text-[20px] font-bold text-[#212A2C]">
                <span className="text-[12px] font-normal text-[#999] mr-1">
                  INR
                </span>
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Trust signals */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2 text-[12px] text-[#767676]">
              <FiTruck size={14} className="text-[#999] shrink-0" />
              Free shipping on orders over ₹4,999
            </div>
            <div className="flex items-center gap-2 text-[12px] text-[#767676]">
              <FiRefreshCw size={14} className="text-[#999] shrink-0" />
              30-day free returns
            </div>
            <div className="flex items-center gap-2 text-[12px] text-[#767676]">
              <FiLock size={14} className="text-[#999] shrink-0" />
              Secure checkout
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PlaceOrder;
