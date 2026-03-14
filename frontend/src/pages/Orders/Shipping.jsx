import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";
import {
  FiLock,
  FiTruck,
  FiRefreshCw,
  FiChevronDown,
  FiTag,
} from "react-icons/fi";

/* ─── shared input style ─── */
const inputCls =
  "w-full px-4 py-3 bg-white border border-[#D9D9D9] text-[14px] text-[#212A2C] placeholder-[#999] outline-none transition-all duration-200 focus:border-[#212A2C] focus:ring-1 focus:ring-[#212A2C] rounded-md";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress, cartItems } = cart;
  const { userInfo } = useSelector((state) => state.auth);

  const [address, setAddress] = useState(shippingAddress.address || "");
  const [apartment, setApartment] = useState(shippingAddress.apartment || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "India");
  const [state, setState] = useState(shippingAddress.state || "");
  const [firstName, setFirstName] = useState(shippingAddress.firstName || "");
  const [lastName, setLastName] = useState(shippingAddress.lastName || "");
  const [email, setEmail] = useState(userInfo?.email || "");
  const [phone, setPhone] = useState(shippingAddress.phone || "");
  const [saveInfo, setSaveInfo] = useState(true);
  const [promoCode, setPromoCode] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      saveShippingAddress({
        address,
        apartment,
        city,
        postalCode,
        country,
        state,
        firstName,
        lastName,
        phone,
      })
    );
    dispatch(savePaymentMethod("Razorpay"));
    navigate("/placeorder");
  };

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

  // Inclusive tax (15%)
  const taxPrice = (itemsPrice * 0.15) / 1.15;
  const totalPrice = subtotalAfterPromo + shippingCost;

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
          <ProgressSteps step1 step2 />
          <FiLock className="text-[#999] hidden sm:block" size={16} />
        </div>
      </header>

      {/* ─── Main layout ─── */}
      <div className="max-w-[1200px] mx-auto flex flex-col-reverse lg:flex-row">
        {/* ════════════ LEFT — Form ════════════ */}
        <div className="flex-1 px-6 md:px-10 lg:pr-14 py-8 lg:py-10 lg:border-r border-[#E5E5E5]">
          <form onSubmit={submitHandler}>
            {/* ── Contact ── */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[18px] font-semibold text-[#212A2C]">
                Contact
              </h2>
              {!userInfo && (
                <Link
                  to="/login?redirect=/shipping"
                  className="text-[13px] text-[#6B7280] underline hover:text-[#212A2C]"
                >
                  Sign in
                </Link>
              )}
            </div>
            <input
              type="email"
              className={inputCls}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className="flex items-center gap-2 mt-3 mb-8 cursor-pointer text-[13px] text-[#6B7280]">
              <input
                type="checkbox"
                className="w-4 h-4 accent-[#212A2C] rounded"
                defaultChecked
              />
              Email me with news and offers
            </label>

            {/* ── Delivery ── */}
            <h2 className="text-[18px] font-semibold text-[#212A2C] mb-3">
              Delivery
            </h2>

            {/* Country */}
            <div className="relative mb-3">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={`${inputCls} appearance-none pr-10 cursor-pointer`}
              >
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
              </select>
              <FiChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] pointer-events-none"
                size={16}
              />
            </div>

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                className={inputCls}
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                className={inputCls}
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <input
              type="text"
              className={`${inputCls} mb-3`}
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            <input
              type="text"
              className={`${inputCls} mb-3`}
              placeholder="Apartment, suite, etc. (optional)"
              value={apartment}
              onChange={(e) => setApartment(e.target.value)}
            />

            {/* City · State · PIN */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              <input
                type="text"
                className={inputCls}
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              <div className="relative">
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className={`${inputCls} appearance-none pr-10 cursor-pointer`}
                  required
                >
                  <option value="" disabled>
                    State
                  </option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <FiChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] pointer-events-none"
                  size={16}
                />
              </div>
              <input
                type="text"
                className={inputCls}
                placeholder="PIN code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </div>

            <input
              type="tel"
              className={`${inputCls} mb-4`}
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <label className="flex items-center gap-2 mb-8 cursor-pointer text-[13px] text-[#6B7280]">
              <input
                type="checkbox"
                className="w-4 h-4 accent-[#212A2C] rounded"
                checked={saveInfo}
                onChange={() => setSaveInfo(!saveInfo)}
              />
              Save this information for next time
            </label>

            {/* ── Shipping method ── */}
            <h2 className="text-[18px] font-semibold text-[#212A2C] mb-3">
              Shipping method
            </h2>
            <div
              className={`rounded-md border px-4 py-3.5 mb-8 text-[14px] flex items-center justify-between ${address && city && postalCode
                ? "border-[#212A2C] bg-[#F5F5F2]"
                : "border-[#D9D9D9] bg-[#FAFAFA] text-[#999]"
                }`}
            >
              {address && city && postalCode ? (
                <>
                  <div className="flex items-center gap-2">
                    <FiTruck size={16} className="text-[#212A2C]" />
                    <span className="text-[#212A2C] font-medium">
                      {freeShipping ? "Free Shipping" : "Standard Shipping"}
                    </span>
                  </div>
                  <span className="font-semibold text-[#212A2C]">
                    {freeShipping ? "FREE" : "₹99"}
                  </span>
                </>
              ) : (
                <span>
                  Enter your shipping address to view available shipping methods.
                </span>
              )}
            </div>

            {/* ── Payment ── */}
            <h2 className="text-[18px] font-semibold text-[#212A2C] mb-1">
              Payment
            </h2>
            <p className="text-[13px] text-[#6B7280] mb-3">
              All transactions are secure and encrypted.
            </p>

            <div className="rounded-md border border-[#212A2C] overflow-hidden mb-8">
              {/* Razorpay option — selected */}
              <div className="flex items-center justify-between px-4 py-3.5 bg-[#F5F5F2] border-b border-[#E5E5E5]">
                <label className="flex items-center gap-3 cursor-pointer">
                  <span className="w-[18px] h-[18px] rounded-full border-[5px] border-[#212A2C] bg-white inline-block" />
                  <span className="text-[14px] font-medium text-[#212A2C]">
                    Razorpay
                  </span>
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 bg-[#072654] text-white text-[10px] font-bold rounded-sm">
                    VISA
                  </span>
                  <span className="px-1.5 py-0.5 bg-[#EB001B] text-white text-[10px] font-bold rounded-sm">
                    MC
                  </span>
                  <span className="px-1.5 py-0.5 bg-[#5A31F4] text-white text-[10px] font-bold rounded-sm">
                    UPI
                  </span>
                </div>
              </div>
              <div className="px-4 py-5 bg-[#FAFAFA] text-[13px] text-[#6B7280] text-center">
                <FiLock className="inline-block mr-1 -mt-0.5" size={14} />
                After clicking "Pay now", you will be redirected to Razorpay to
                complete your purchase securely.
              </div>
            </div>

            {/* ── Submit ── */}
            <button
              type="submit"
              className="w-full py-4 bg-[#212A2C] text-white text-[13px] font-bold uppercase tracking-[0.12em] rounded-md hover:bg-[#1a2022] active:scale-[0.995] transition-all duration-150"
            >
              Continue to Review
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
          </form>
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
                          item.images?.length > 0 ? item.images[0] : item.image
                        }
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Qty badge */}
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

          {/* Discount code */}
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <FiTag
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#BDBDBD]"
                size={15}
              />
              <input
                type="text"
                placeholder="Discount code or gift card"
                className="w-full pl-9 pr-3 py-3 border border-[#D9D9D9] rounded-md text-[13px] text-[#212A2C] placeholder-[#999] outline-none focus:border-[#212A2C] transition-colors bg-white"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="px-5 py-3 border border-[#D9D9D9] rounded-md text-[13px] font-medium text-[#767676] bg-[#F5F5F2] hover:bg-[#EBEBEB] transition-colors"
            >
              Apply
            </button>
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
                {address && city && postalCode
                  ? freeShipping
                    ? "FREE"
                    : "₹99"
                  : "Enter shipping address"}
              </span>
            </div>

            <div className="flex justify-between text-[#6B7280]">
              <span>GST (Included 15%)</span>
              <span className="text-[#212A2C] font-medium">
                ₹{taxPrice.toLocaleString("en-IN")}
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
                ₹{totalPrice.toLocaleString("en-IN")}
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

export default Shipping;
