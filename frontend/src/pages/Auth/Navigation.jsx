import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
  AiOutlineClose,
} from "react-icons/ai";
import { RiAccountCircleLine, RiContactsLine } from "react-icons/ri";
import { MdLogout, MdOutlineSpaceDashboard, MdOutlineCategory, MdOutlineFavoriteBorder } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { CiCircleList } from "react-icons/ci";
import { FiPackage } from "react-icons/fi";
import { HiOutlineMenuAlt1 } from "react-icons/hi";

import { Link, useNavigate } from "react-router-dom";
import "./Navigation.css";

import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApislice.js";
import { logout } from "../../redux/features/auth/authSlice";

import ContentWrapper from "../../components/ContentWrapper.jsx";
import { toast } from "react-toastify";
import Logo from "../../assets/logo.png";
import AdminMenu from "../Admin/AdminMenu.jsx";
import FavoritesCount from "../Products/FavoritesCount.jsx";

import { motion, AnimatePresence } from "framer-motion";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const toggleMobileMenu = () => setMobileMenu((prev) => !prev);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const closeDropdown = () => setDropdownOpen(false);
  const closeMobileMenu = () => setMobileMenu(false);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      closeDropdown();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const cartCount = cartItems?.reduce((a, c) => a + c.qty, 0) || 0;

  // Reusable dropdown link item
  const DropdownItem = ({ to, icon: Icon, label, onClick, isBorder }) => (
    <li className={`flex items-center hover:bg-surface-hover transition-all duration-300 h-9 rounded-md mx-2 my-1 px-3 ${isBorder ? "border-b border-surface-border-light pb-3 mb-3" : ""}`}>
      {to ? (
        <Link to={to} className="flex gap-3 items-center w-full text-sm">
          <Icon size={20} />
          {label}
        </Link>
      ) : (
        <button onClick={onClick} className="flex gap-3 items-center w-full text-sm">
          <Icon size={20} />
          {label}
        </button>
      )}
    </li>
  );

  return (
    <div
      className={`fixed top-0 left-0 w-full h-[70px] z-50 transition-all duration-300 ${mobileMenu
          ? "bg-accent-orange"
          : "bg-brand-navy/80 backdrop-blur-xl border-b border-white/5"
        }`}
    >
      <ContentWrapper>
        <div className="flex justify-between items-center h-[70px]">
          {/* Left: Hamburger + Nav Links */}
          <div className="flex items-center gap-6">
            <button
              onClick={toggleMobileMenu}
              className="text-text-muted hover:text-text-primary transition-colors"
              aria-label={mobileMenu ? "Close menu" : "Open menu"}
            >
              {mobileMenu ? (
                <AiOutlineClose size={24} />
              ) : (
                <HiOutlineMenuAlt1 size={24} />
              )}
            </button>

            {/* Desktop nav icons */}
            <nav className="hidden md:flex items-center gap-5" aria-label="Main navigation">
              <Link to="/" className="text-text-muted hover:text-text-primary transition-colors" aria-label="Home">
                <AiOutlineHome size={24} />
              </Link>
              <Link to="/shop" className="text-text-muted hover:text-text-primary transition-colors" aria-label="Shop">
                <AiOutlineShopping size={24} />
              </Link>
              <Link to="/cart" className="relative text-text-muted hover:text-text-primary transition-colors" aria-label="Cart">
                <AiOutlineShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent-pink text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link to="/favorite" className="relative text-text-muted hover:text-text-primary transition-colors" aria-label="Favorites">
                <MdOutlineFavoriteBorder size={24} />
                <FavoritesCount />
              </Link>
            </nav>
          </div>

          {/* Center: Logo */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2">
            <motion.img
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src={Logo}
              alt="LuxeHaven"
              className="w-[120px] md:w-[140px]"
            />
          </Link>

          {/* Right: User / Auth */}
          <div className="flex items-center gap-3">
            {userInfo ? (
              <div className="relative flex items-center gap-2">
                {userInfo.isAdmin && (
                  <AdminMenu
                    setDropdownOpen={setDropdownOpen}
                    dropdownOpen={dropdownOpen}
                  />
                )}

                <button
                  onClick={toggleDropdown}
                  className="flex items-center gap-1 text-text-muted hover:text-text-primary transition-colors"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <span className="hidden sm:flex gap-1.5 text-sm font-medium capitalize">
                    <span className="text-text-secondary">Hello,</span>
                    {userInfo.username}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-[50px] right-0 bg-brand-deeper border border-surface-border rounded-lg w-48 lg:w-56 z-50 py-2 shadow-2xl"
                      onClick={closeDropdown}
                      role="menu"
                    >
                      <h2 className="text-sm font-semibold border-b border-surface-border px-4 py-2 mb-1">
                        My Account
                      </h2>

                      {userInfo.isAdmin && (
                        <>
                          <DropdownItem to="/admin/dashboard" icon={MdOutlineSpaceDashboard} label="Dashboard" />
                          <DropdownItem to="/admin/productlist" icon={BsBoxSeam} label="Products" />
                          <DropdownItem to="/admin/categorylist" icon={MdOutlineCategory} label="Categories" />
                          <DropdownItem to="/admin/orderlist" icon={CiCircleList} label="Orders" />
                          <DropdownItem to="/admin/userlist" icon={RiContactsLine} label="Users" isBorder />
                        </>
                      )}

                      <DropdownItem to="/profile" icon={RiAccountCircleLine} label="Profile" />
                      <DropdownItem to="/user-orders" icon={FiPackage} label="My Orders" />
                      <DropdownItem icon={MdLogout} label="Logout" onClick={logoutHandler} />
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-text-muted hover:text-text-primary transition-colors"
                  aria-label="Login"
                >
                  <AiOutlineLogin size={24} />
                </Link>
                <Link
                  to="/register"
                  className="text-text-muted hover:text-text-primary transition-colors"
                  aria-label="Register"
                >
                  <AiOutlineUserAdd size={24} />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mobile bg-accent-orange"
              onClick={closeMobileMenu}
            >
              <nav className="flex flex-col gap-1 px-4 py-6" aria-label="Mobile navigation">
                {[
                  { to: "/", label: "Home" },
                  { to: "/shop", label: "Shop" },
                  { to: "/cart", label: "Cart" },
                  { to: "/favorite", label: "Favorites" },
                  ...(userInfo ? [{ to: "/user-orders", label: "My Orders" }] : []),
                ].map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center transition-transform transform hover:translate-x-3"
                  >
                    <span className="text-2xl lg:text-5xl font-bold text-black pl-2">
                      {label}
                    </span>
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </ContentWrapper>
    </div>
  );
};

export default Navigation;