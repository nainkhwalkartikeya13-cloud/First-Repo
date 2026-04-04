// pages/Orders/Order.jsx — Allbirds-style order confirmation
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import moment from "moment";
import {
  useGetOrderDetailsQuery,
  useDeliverOrderMutation,
  useProcessOrderMutation,
  useShipOrderMutation,
} from "../../redux/api/orderApiSlice";
import Message from "../../components/Message";
import { OrderSkeleton } from "../../components/Skeletons";
import OrderTimeline from "../../components/OrderTimeline";
import { generateInvoice } from "../../utils/invoiceUtils";
import {
  FiCheck,
  FiPackage,
  FiMapPin,
  FiCreditCard,
  FiTruck,
  FiDownload,
} from "react-icons/fi";

const Order = () => {
  const { id } = useParams();
  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useGetOrderDetailsQuery(id);
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const [processOrder, { isLoading: loadingProcess }] =
    useProcessOrderMutation();
  const [shipOrder, { isLoading: loadingShip }] = useShipOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  if (isLoading) return <OrderSkeleton />;
  if (error)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Message variant="danger">Order not found</Message>
      </div>
    );

  const deliverHandler = async () => {
    try {
      await deliverOrder(id).unwrap();
      refetch();
      toast.success("Order marked as delivered");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  const processHandler = async () => {
    try {
      await processOrder(id).unwrap();
      refetch();
      toast.success("Order is now being processed");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  const shipHandler = async () => {
    try {
      await shipOrder(id).unwrap();
      refetch();
      toast.success("Order marked as shipped");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  const getStatusHero = () => {
    if (order.isDelivered) {
      return {
        title: "Delivered & Ready to Wear.",
        desc: "Your AEROLITH order has reached its destination. We hope you love your new sustainable items.",
        color: "bg-[#2D5233]",
        icon: <FiCheck size={24} />,
      };
    }
    if (order.isShipped) {
      return {
        title: "On the Way.",
        desc: "Your package is currently in transit. Follow its journey below.",
        color: "bg-[#212A2C]",
        icon: <FiTruck size={24} />,
      };
    }
    if (order.isProcessing) {
      return {
        title: "In Good Hands.",
        desc: "We're hand-packing your order with care. It will be on its way shortly.",
        color: "bg-[#212A2C]",
        icon: <FiPackage size={24} />,
      };
    }
    if (order.isPaid) {
      return {
        title: "Confirmed & Essential.",
        desc: "Thank you for your purchase. We've received your order and are starting work on it.",
        color: "bg-[#212A2C]",
        icon: <FiCheck size={24} />,
      };
    }
    return {
      title: "Taking Flight.",
      desc: "Your order is being initialized. We'll update you as soon as payment is confirmed.",
      color: "bg-[#767676]",
      icon: <FiPackage size={24} />,
    };
  };

  const statusHero = getStatusHero();

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
          {order.isPaid && (
            <button
              type="button"
              onClick={async (e) => {
                e.preventDefault();
                toast.info("Generating your invoice...");
                await generateInvoice(order);
              }}
              className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#212A2C] border border-[#212A2C] px-4 py-2 rounded-full hover:bg-[#212A2C] hover:text-white transition-all"
            >
              <FiDownload size={14} />
              Invoice
            </button>
          )}
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto flex flex-col-reverse lg:flex-row">
        {/* ════════════ LEFT — Confirmation ════════════ */}
        <div className="flex-1 px-6 md:px-10 lg:pr-14 py-8 lg:py-12 lg:border-r border-[#E5E5E5]">
          {/* Status Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${statusHero.color} shadow-lg`}>
                {statusHero.icon}
              </div>
              <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#999]">
                Order Confirmation
              </p>
            </div>
            <h1
              className="text-[32px] md:text-[40px] font-light text-[#212A2C] leading-tight mb-4"
              style={{ fontFamily: "Source Serif 4, Georgia, serif" }}
            >
              {statusHero.title}
            </h1>
            <p className="text-[16px] text-[#767676] max-w-[500px] leading-relaxed mb-6">
              {statusHero.desc}
            </p>
            <Link
              to={`/order-tracking/${id}`}
              className="inline-flex items-center gap-2 bg-[#212A2C] text-white px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-colors"
            >
              <FiTruck className="w-4 h-4" />
              Track Your Journey
            </Link>
          </motion.div>

          {/* Real-time Timeline */}
          <div className="mb-10 bg-[#F9F9F8] rounded-xl border border-[#E5E5E5]/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5E5E5]/50 flex justify-between items-center">
              <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#212A2C]">
                Order Status
              </h3>
              <span className="text-[11px] text-[#767676]">
                Estimated delivery: {moment(order.createdAt).add(5, 'days').format('MMM DD')}
              </span>
            </div>
            <OrderTimeline order={order} />
          </div>

          {/* Status badges */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div
              className={`rounded-lg border px-4 py-3.5 ${order.isPaid
                ? "border-[#2D5233]/30 bg-[#2D5233]/5"
                : "border-[#EAB308]/30 bg-[#EAB308]/5"
                }`}
            >
              <p className="text-[11px] uppercase tracking-[0.08em] text-[#999] mb-1">
                Payment
              </p>
              <p
                className={`text-[14px] font-medium ${order.isPaid ? "text-[#2D5233]" : "text-[#EAB308]"
                  }`}
              >
                {order.isPaid
                  ? `Paid · ${new Date(order.paidAt).toLocaleDateString(
                    "en-IN",
                    { month: "short", day: "numeric", year: "numeric" }
                  )}`
                  : "Pending"}
              </p>
            </div>
            <div
              className={`rounded-lg border px-4 py-3.5 ${order.isDelivered
                ? "border-[#2D5233]/30 bg-[#2D5233]/5"
                : "border-[#EAB308]/30 bg-[#EAB308]/5"
                }`}
            >
              <p className="text-[11px] uppercase tracking-[0.08em] text-[#999] mb-1">
                Delivery
              </p>
              <p
                className={`text-[14px] font-medium ${order.isDelivered ? "text-[#2D5233]" : "text-[#EAB308]"
                  }`}
              >
                {order.isDelivered
                  ? `Delivered · ${new Date(
                    order.deliveredAt
                  ).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}`
                  : "Not delivered yet"}
              </p>
            </div>
          </div>

          {/* ── Info cards ── */}
          <div className="rounded-lg border border-[#E5E5E5] divide-y divide-[#E5E5E5] mb-8">
            <div className="flex items-start gap-4 px-5 py-4">
              <FiMapPin className="text-[#999] shrink-0 mt-0.5" size={16} />
              <div>
                <p className="text-[12px] text-[#999] uppercase tracking-[0.08em] mb-1">
                  Ship to
                </p>
                {(order.shippingAddress?.firstName || order.shippingAddress?.lastName) && (
                  <p className="text-[14px] font-medium text-[#212A2C] mb-0.5">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                )}
                {order.shippingAddress?.phone && (
                  <p className="text-[13px] text-[#767676] mb-1">
                    {order.shippingAddress.phone}
                  </p>
                )}
                <p className="text-[14px] text-[#212A2C]">
                  {order.shippingAddress.address},{" "}
                  {order.shippingAddress.city}{" "}
                  {order.shippingAddress.postalCode},{" "}
                  {order.shippingAddress.country}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 px-5 py-4">
              <FiCreditCard
                className="text-[#999] shrink-0 mt-0.5"
                size={16}
              />
              <div>
                <p className="text-[12px] text-[#999] uppercase tracking-[0.08em] mb-1">
                  Payment method
                </p>
                <p className="text-[14px] text-[#212A2C]">
                  {order.paymentMethod || "Razorpay"}
                </p>
              </div>
            </div>
          </div>

          {/* ── Order items ── */}
          <h2 className="text-[16px] font-semibold text-[#212A2C] mb-4">
            Your items
          </h2>
          <div className="divide-y divide-[#E5E5E5] border border-[#E5E5E5] rounded-lg mb-8">
            {order.orderItems.map((item, index) => (
              <div key={index} className="flex items-center gap-4 px-5 py-4">
                <div className="w-16 h-16 rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] overflow-hidden shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-[#212A2C] line-clamp-1">
                    {item.name}
                  </p>
                  <p className="text-[12px] text-[#999]">
                    Qty: {item.qty} {item.size ? `| Size: ${item.size}` : ""}
                  </p>
                </div>
                <span className="text-[14px] font-medium text-[#212A2C] shrink-0">
                  ₹{(item.qty * item.price).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>

          {/* Admin status controls */}
          {userInfo && userInfo.isAdmin && order.isPaid && (
            <div className="space-y-3 mb-8">
              <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#212A2C] mb-2">
                Admin Controls
              </h3>

              {!order.isProcessing && (
                <button
                  onClick={processHandler}
                  disabled={loadingProcess}
                  className="w-full py-3 bg-white border border-[#212A2C] text-[#212A2C] text-[12px] font-bold uppercase tracking-[0.1em] rounded-md hover:bg-[#F9F9F8] transition-colors disabled:opacity-40"
                >
                  {loadingProcess ? "Updating..." : "Mark as Processing"}
                </button>
              )}

              {order.isProcessing && !order.isShipped && (
                <button
                  onClick={shipHandler}
                  disabled={loadingShip}
                  className="w-full py-3 bg-white border border-[#212A2C] text-[#212A2C] text-[12px] font-bold uppercase tracking-[0.1em] rounded-md hover:bg-[#F9F9F8] transition-colors disabled:opacity-40"
                >
                  {loadingShip ? "Updating..." : "Mark as Shipped"}
                </button>
              )}

              {order.isShipped && !order.isDelivered && (
                <button
                  onClick={deliverHandler}
                  disabled={loadingDeliver}
                  className="w-full py-3 bg-[#212A2C] text-white text-[12px] font-bold uppercase tracking-[0.1em] rounded-md hover:bg-[#1a2022] transition-colors disabled:opacity-40"
                >
                  {loadingDeliver ? "Updating..." : "Mark as Delivered"}
                </button>
              )}
            </div>
          )}

          {/* Continue shopping */}
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-[13px] text-[#6B7280] underline hover:text-[#212A2C] transition-colors"
          >
            Continue shopping
          </Link>
        </div>

        {/* ════════════ RIGHT — Summary ════════════ */}
        <aside className="lg:w-[440px] shrink-0 bg-[#FAFAFA] border-b lg:border-b-0 border-[#E5E5E5] px-6 md:px-10 py-8 lg:py-10">
          {/* items mini */}
          <div className="space-y-4 mb-6">
            {order.orderItems.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-lg border border-[#E5E5E5] bg-white overflow-hidden">
                    <img
                      src={item.image}
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
                  {item.size && (
                    <p className="text-[11px] text-[#999]">Size: {item.size}</p>
                  )}
                </div>
                <span className="text-[14px] font-medium text-[#212A2C] shrink-0">
                  ₹{(item.qty * item.price).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>

          <hr className="border-[#E5E5E5] mb-4" />

          {/* Totals */}
          <div className="space-y-2.5 text-[14px]">
            <div className="flex justify-between text-[#6B7280]">
              <span>Subtotal · {order.orderItems.reduce((acc, i) => acc + i.qty, 0)} items</span>
              <span className="text-[#212A2C] font-medium">
                ₹{Number(order.itemsPrice).toLocaleString("en-IN")}
              </span>
            </div>

            {order.discountPrice > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Promo Discount</span>
                <span>-₹{Number(order.discountPrice).toLocaleString("en-IN")}</span>
              </div>
            )}

            <div className="flex justify-between text-[#6B7280]">
              <span>Shipping</span>
              <span
                className={`font-medium ${Number(order.shippingPrice) === 0
                  ? "text-[#2D5233]"
                  : "text-[#212A2C]"
                  }`}
              >
                {Number(order.shippingPrice) === 0
                  ? "FREE"
                  : `₹${Number(order.shippingPrice).toLocaleString("en-IN")}`}
              </span>
            </div>
            <div className="flex justify-between text-[#6B7280]">
              <span>GST (Included 15%)</span>
              <span className="text-[#212A2C] font-medium">
                ₹{Number(order.taxPrice).toLocaleString("en-IN")}
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
                ₹{Number(order.totalPrice).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Trust */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2 text-[12px] text-[#767676]">
              <FiTruck size={14} className="text-[#999] shrink-0" />
              Free shipping on orders over ₹4,999
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Order;
