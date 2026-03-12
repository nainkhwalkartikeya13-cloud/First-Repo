import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiLock,
  FiCheck,
  FiPackage,
  FiHeart,
  FiMapPin,
  FiShield,
  FiChevronRight,
  FiEdit3,
  FiEye,
  FiEyeOff,
  FiLogOut,
} from "react-icons/fi";

import { useProfileMutation } from "../../redux/api/usersApislice";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useLogoutMutation } from "../../redux/api/usersApislice";
import { logout as logoutAction } from "../../redux/features/auth/authSlice";

import Loader from "../../components/Loader";
import RewardsCard from "../../components/RewardsCard";

/* ─────────── tiny helpers ─────────── */
const getInitials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const getMemberSince = () => {
  const d = new Date();
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

/* ─────────── animated tab indicator ─────────── */
const tabs = [
  { id: "profile", label: "Profile", icon: FiUser },
  { id: "orders", label: "Orders", icon: FiPackage },
  { id: "security", label: "Security", icon: FiShield },
];

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* ── state ── */
  const [activeTab, setActiveTab] = useState("profile");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();
  const { data: orders } = useGetMyOrdersQuery();
  const [logoutApiCall] = useLogoutMutation();

  useEffect(() => {
    if (userInfo) {
      setUsername(userInfo.username);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  /* ── handlers ── */
  const submitHandler = async (e) => {
    e.preventDefault();
    if (activeTab === "security") {
      if (!password) return toast.error("Please enter a new password");
      if (password !== confirmPassword)
        return toast.error("Passwords do not match");
      if (password.length < 6)
        return toast.error("Password must be at least 6 characters");
    }

    try {
      const payload = { _id: userInfo._id };
      if (activeTab === "profile") {
        payload.username = username;
        payload.email = email;
      }
      if (activeTab === "security" && password) {
        payload.password = password;
      }

      const res = await updateProfile(payload).unwrap();
      dispatch(setCredentials({ ...res }));
      setPassword("");
      setConfirmPassword("");
      setIsEditing(false);
      toast.success(
        activeTab === "security"
          ? "Password updated successfully"
          : "Profile updated successfully"
      );
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Update failed");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logoutAction());
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  /* ── quick stats ── */
  const totalOrders = orders?.length || 0;
  const totalSpent =
    orders?.reduce((acc, o) => acc + (o.totalPrice || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* ═══ Hero banner ═══ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#212A2C] via-[#2C3639] to-[#1a1a2e]">
        {/* decorative circles */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/[0.03]" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/[0.03]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            {/* avatar */}
            <div className="relative group">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-3xl md:text-4xl font-bold shadow-xl ring-4 ring-white/10">
                {getInitials(userInfo?.username)}
              </div>
              {userInfo?.isAdmin && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-amber-400 text-[#212A2C] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                  Admin
                </span>
              )}
            </div>

            {/* info */}
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                {userInfo?.username || "User"}
              </h1>
              <p className="text-white/50 text-sm mt-1">{userInfo?.email}</p>
              <p className="text-white/30 text-xs mt-1">
                Member since {getMemberSince()}
              </p>
            </div>

            {/* quick stat cards */}
            <div className="flex gap-3 md:ml-auto mt-4 md:mt-0">
              {[
                {
                  label: "Orders",
                  value: totalOrders,
                  icon: FiPackage,
                  color: "from-blue-500/20 to-blue-600/20",
                },
                {
                  label: "Spent",
                  value: `₹${totalSpent.toLocaleString("en-IN")}`,
                  icon: FiHeart,
                  color: "from-rose-500/20 to-pink-600/20",
                },
                {
                  label: "In Cart",
                  value: cartItems.length,
                  icon: FiMapPin,
                  color: "from-emerald-500/20 to-teal-600/20",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className={`bg-gradient-to-br ${s.color} backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 min-w-[90px] text-center`}
                >
                  <s.icon className="w-4 h-4 text-white/60 mx-auto mb-1" />
                  <p className="text-white font-bold text-lg leading-none">
                    {s.value}
                  </p>
                  <p className="text-white/40 text-[10px] mt-0.5 uppercase tracking-wider">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Tab bar ═══ */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsEditing(false);
                }}
                className={`relative flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors ${activeTab === tab.id
                  ? "text-[#212A2C]"
                  : "text-gray-400 hover:text-gray-600"
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#212A2C] rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* ═══ Content ═══ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <AnimatePresence mode="wait">
          {/* ───── PROFILE TAB ───── */}
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* left — form */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                      <div>
                        <h3 className="text-lg font-semibold text-[#212A2C]">
                          Personal Information
                        </h3>
                        <p className="text-gray-400 text-xs mt-0.5">
                          Manage your account details
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsEditing(!isEditing)}
                        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${isEditing
                          ? "bg-gray-100 text-gray-500"
                          : "bg-[#212A2C] text-white hover:bg-[#2C3639]"
                          }`}
                      >
                        <FiEdit3 className="w-3 h-3" />
                        {isEditing ? "Cancel" : "Edit"}
                      </button>
                    </div>

                    <form onSubmit={submitHandler} className="p-6 space-y-5">
                      {/* username */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                          Full Name
                        </label>
                        <div className="relative">
                          <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={!isEditing}
                            className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all ${isEditing
                              ? "bg-white border-2 border-[#212A2C]/10 focus:border-[#212A2C]/30 text-[#212A2C] outline-none"
                              : "bg-gray-50 border border-gray-100 text-gray-600 cursor-default"
                              }`}
                          />
                        </div>
                      </div>

                      {/* email */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                          Email Address
                        </label>
                        <div className="relative">
                          <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={!isEditing}
                            className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all ${isEditing
                              ? "bg-white border-2 border-[#212A2C]/10 focus:border-[#212A2C]/30 text-[#212A2C] outline-none"
                              : "bg-gray-50 border border-gray-100 text-gray-600 cursor-default"
                              }`}
                          />
                        </div>
                      </div>

                      {/* save */}
                      {isEditing && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <button
                            type="submit"
                            disabled={loadingUpdateProfile}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#212A2C] hover:bg-[#2C3639] text-white text-sm font-semibold px-8 py-3 rounded-xl transition-colors disabled:opacity-50"
                          >
                            {loadingUpdateProfile ? (
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <FiCheck className="w-4 h-4" />
                            )}
                            Save Changes
                          </button>
                        </motion.div>
                      )}
                    </form>
                  </div>
                </div>

                {/* right — sidebar quick links */}
                <div className="space-y-4">
                  {/* quick links card */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Quick Links
                    </h4>
                    <div className="space-y-1">
                      {[
                        {
                          label: "My Orders",
                          icon: FiPackage,
                          to: "/user-orders",
                          count: totalOrders,
                        },
                        {
                          label: "Favorites",
                          icon: FiHeart,
                          to: "/favorite",
                        },
                        {
                          label: "Addresses",
                          icon: FiMapPin,
                          to: "/shipping",
                        },
                      ].map((link) => (
                        <Link
                          key={link.label}
                          to={link.to}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-[#212A2C] transition-colors group"
                        >
                          <link.icon className="w-4 h-4 text-gray-300 group-hover:text-[#212A2C] transition-colors" />
                          <span className="flex-1">{link.label}</span>
                          {link.count !== undefined && (
                            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                              {link.count}
                            </span>
                          )}
                          <FiChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-400 transition-colors" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Loyalty Status */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Loyalty Status
                    </h4>
                    <RewardsCard points={userInfo?.points || 0} />
                  </div>

                  {/* danger zone */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Session
                    </h4>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors group"
                    >
                      <FiLogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ───── ORDERS TAB ───── */}
          {activeTab === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-[#212A2C]">
                    Recent Orders
                  </h3>
                  <p className="text-gray-400 text-xs mt-0.5">
                    Track and manage your orders
                  </p>
                </div>

                {!orders || orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <FiPackage className="w-7 h-7 text-gray-300" />
                    </div>
                    <p className="text-gray-400 text-sm font-medium">
                      No orders yet
                    </p>
                    <p className="text-gray-300 text-xs mt-1 max-w-[240px]">
                      When you place an order, it will appear here.
                    </p>
                    <Link
                      to="/shop"
                      className="mt-5 inline-flex items-center gap-2 bg-[#212A2C] text-white text-xs font-semibold px-6 py-2.5 rounded-lg hover:bg-[#2C3639] transition-colors"
                    >
                      Start Shopping
                      <FiChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {orders.slice(0, 8).map((order) => (
                      <Link
                        key={order._id}
                        to={`/order/${order._id}`}
                        className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors group"
                      >
                        {/* thumbnail */}
                        <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                          {order.orderItems?.[0]?.image ? (
                            <img
                              src={order.orderItems[0].image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FiPackage className="w-5 h-5 text-gray-300" />
                            </div>
                          )}
                        </div>

                        {/* details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-[#212A2C] truncate">
                              Order #{order._id.slice(-8).toUpperCase()}
                            </p>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${order.isPaid
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-amber-50 text-amber-600"
                                }`}
                            >
                              {order.isPaid ? "Paid" : "Pending"}
                            </span>
                            {order.isDelivered && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-blue-50 text-blue-600">
                                Delivered
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}{" "}
                            ·{" "}
                            {order.orderItems?.length || 0}{" "}
                            {order.orderItems?.length === 1 ? "item" : "items"}
                          </p>
                        </div>

                        {/* total */}
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold text-[#212A2C]">
                            ₹{order.totalPrice?.toLocaleString("en-IN")}
                          </p>
                        </div>

                        <FiChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors flex-shrink-0" />
                      </Link>
                    ))}
                  </div>
                )}

                {orders && orders.length > 0 && (
                  <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100 text-center">
                    <Link
                      to="/user-orders"
                      className="text-xs font-semibold text-[#212A2C] hover:underline"
                    >
                      View All Orders →
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ───── SECURITY TAB ───── */}
          {activeTab === "security" && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="max-w-xl">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-[#212A2C]">
                      Change Password
                    </h3>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Ensure your account stays secure
                    </p>
                  </div>

                  <form onSubmit={submitHandler} className="p-6 space-y-5">
                    {/* new password */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        New Password
                      </label>
                      <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="w-full pl-10 pr-10 py-3 rounded-xl text-sm bg-white border-2 border-gray-100 focus:border-[#212A2C]/30 text-[#212A2C] outline-none transition-all placeholder:text-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                        >
                          {showPassword ? (
                            <FiEyeOff className="w-4 h-4" />
                          ) : (
                            <FiEye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {password && (
                        <div className="mt-2 flex gap-1">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-colors ${password.length >= i * 3
                                ? password.length >= 12
                                  ? "bg-emerald-400"
                                  : password.length >= 8
                                    ? "bg-amber-400"
                                    : "bg-red-400"
                                : "bg-gray-100"
                                }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* confirm password */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                        <input
                          type={showConfirm ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className={`w-full pl-10 pr-10 py-3 rounded-xl text-sm bg-white border-2 outline-none transition-all placeholder:text-gray-300 ${confirmPassword && confirmPassword !== password
                            ? "border-red-200 focus:border-red-300"
                            : confirmPassword && confirmPassword === password
                              ? "border-emerald-200 focus:border-emerald-300"
                              : "border-gray-100 focus:border-[#212A2C]/30"
                            } text-[#212A2C]`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                        >
                          {showConfirm ? (
                            <FiEyeOff className="w-4 h-4" />
                          ) : (
                            <FiEye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {confirmPassword && confirmPassword !== password && (
                        <p className="text-red-400 text-xs mt-1.5">
                          Passwords don't match
                        </p>
                      )}
                      {confirmPassword && confirmPassword === password && (
                        <p className="text-emerald-500 text-xs mt-1.5 flex items-center gap-1">
                          <FiCheck className="w-3 h-3" /> Passwords match
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={
                        loadingUpdateProfile ||
                        !password ||
                        password !== confirmPassword
                      }
                      className="w-full flex items-center justify-center gap-2 bg-[#212A2C] hover:bg-[#2C3639] disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-semibold px-8 py-3 rounded-xl transition-colors"
                    >
                      {loadingUpdateProfile ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <FiShield className="w-4 h-4" />
                      )}
                      Update Password
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;
