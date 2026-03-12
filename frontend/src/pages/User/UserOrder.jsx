import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiPackage,
  FiChevronRight,
  FiChevronLeft,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiShoppingBag,
} from "react-icons/fi";

import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  /* ── stats ── */
  const totalOrders = orders?.length || 0;
  const paidOrders = orders?.filter((o) => o.isPaid).length || 0;
  const deliveredOrders = orders?.filter((o) => o.isDelivered).length || 0;
  const totalSpent =
    orders?.reduce((acc, o) => acc + (o.totalPrice || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* ═══ Header ═══ */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-1">
            <Link
              to="/profile"
              className="flex items-center gap-1 text-gray-400 hover:text-[#212A2C] transition-colors text-sm"
            >
              <FiChevronLeft className="w-4 h-4" />
              Profile
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#212A2C] tracking-tight">
                My Orders
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Track, manage, and review your purchases
              </p>
            </div>

            {/* mini stats */}
            {orders && orders.length > 0 && (
              <div className="flex gap-5">
                {[
                  { label: "Total", value: totalOrders, icon: FiPackage },
                  { label: "Paid", value: paidOrders, icon: FiCheckCircle },
                  { label: "Delivered", value: deliveredOrders, icon: FiTruck },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-lg font-bold text-[#212A2C]">
                      {s.value}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══ Content ═══ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader />
          </div>
        ) : error ? (
          <Message variant="danger">
            {error?.data?.error || error?.data?.message || error.error}
          </Message>
        ) : !orders || orders.length === 0 ? (
          /* empty state */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-5">
              <FiShoppingBag className="w-9 h-9 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-[#212A2C]">
              No orders yet
            </h3>
            <p className="text-gray-400 text-sm mt-1 max-w-sm">
              Looks like you haven't made any purchases yet. Start exploring our
              collection!
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-flex items-center gap-2 bg-[#212A2C] text-white text-sm font-semibold px-7 py-3 rounded-xl hover:bg-[#2C3639] transition-colors"
            >
              Browse Shop
              <FiChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          /* ── orders list ── */
          <div className="space-y-4">
            {/* total spent banner */}
            <div className="bg-gradient-to-r from-[#212A2C] to-[#2C3639] rounded-2xl p-5 sm:p-6 flex items-center justify-between text-white">
              <div>
                <p className="text-white/50 text-xs uppercase tracking-wider">
                  Total Spent
                </p>
                <p className="text-2xl sm:text-3xl font-bold mt-1">
                  ₹{totalSpent.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white/50 text-xs uppercase tracking-wider">
                  Across
                </p>
                <p className="text-2xl sm:text-3xl font-bold mt-1">
                  {totalOrders}{" "}
                  <span className="text-base font-normal text-white/50">
                    orders
                  </span>
                </p>
              </div>
            </div>

            {/* order cards */}
            {orders.filter((order) => order && order._id).map((order, i) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  to={`/order/${order._id}`}
                  className="block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group"
                >
                  <div className="p-5 sm:p-6">
                    {/* top row */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-[#212A2C]">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${order.isPaid
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-amber-50 text-amber-600"
                              }`}
                          >
                            {order.isPaid ? (
                              <FiCheckCircle className="w-3 h-3" />
                            ) : (
                              <FiClock className="w-3 h-3" />
                            )}
                            {order.isPaid ? "Paid" : "Pending"}
                          </span>
                          {order.isDelivered ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-blue-50 text-blue-600">
                              <FiTruck className="w-3 h-3" />
                              Delivered
                            </span>
                          ) : order.isPaid ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-purple-50 text-purple-600">
                              <FiTruck className="w-3 h-3" />
                              In Transit
                            </span>
                          ) : null}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Placed on{" "}
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-bold text-[#212A2C]">
                          ₹{order.totalPrice?.toLocaleString("en-IN")}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {order.orderItems?.length || 0}{" "}
                          {order.orderItems?.length === 1 ? "item" : "items"}
                        </p>
                      </div>
                    </div>

                    {/* product thumbnails */}
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {order.orderItems?.slice(0, 4).map((item, idx) => (
                          <div
                            key={idx}
                            className="w-12 h-12 rounded-xl bg-gray-100 border-2 border-white overflow-hidden flex-shrink-0"
                            style={{ zIndex: 4 - idx }}
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FiPackage className="w-4 h-4 text-gray-300" />
                              </div>
                            )}
                          </div>
                        ))}
                        {order.orderItems?.length > 4 && (
                          <div className="w-12 h-12 rounded-xl bg-gray-100 border-2 border-white flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-gray-400">
                            +{order.orderItems.length - 4}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 ml-2">
                        <p className="text-xs text-gray-500 truncate">
                          {order.orderItems
                            ?.map((item) => item.name)
                            .join(", ")}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-medium text-gray-400 group-hover:text-[#212A2C] transition-colors flex-shrink-0">
                        View Details
                        <FiChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Review Section (Only if Paid) */}
                    {order.isPaid && (
                      <div className="mt-4 pt-4 border-t border-gray-50 overflow-x-auto">
                        <div className="flex gap-2 pb-1">
                          {order.orderItems?.map((item, idx) => (
                            <Link
                              key={idx}
                              to={`/product/${item.product}`}
                              onClick={(e) => e.stopPropagation()} // Prevent card click
                              className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-2 bg-gray-50 text-gray-600 hover:bg-[#212A2C] hover:text-white transition-all rounded-lg whitespace-nowrap border border-gray-100"
                            >
                              <FiCheckCircle className="w-3 h-3" />
                              Review {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrder;
