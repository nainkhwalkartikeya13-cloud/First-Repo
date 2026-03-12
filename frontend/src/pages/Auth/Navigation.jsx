import { useState, useEffect, useRef, useCallback } from "react";
import {
  AiOutlineLogin,
  AiOutlineShoppingCart,
  AiOutlineClose,
  AiOutlineSearch,
} from "react-icons/ai";
import { RiAccountCircleLine, RiContactsLine } from "react-icons/ri";
import {
  MdLogout,
  MdOutlineSpaceDashboard,
  MdOutlineCategory,
  MdOutlineFavoriteBorder,
} from "react-icons/md";
import { BsBoxSeam, BsArrowRight } from "react-icons/bs";
import { CiCircleList } from "react-icons/ci";
import { FiPackage, FiSun, FiMoon } from "react-icons/fi";
import { HiOutlineMenuAlt1 } from "react-icons/hi";

import { Link, useNavigate } from "react-router-dom";
import "./Navigation.css";

import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApislice.js";
import { logout } from "../../redux/features/auth/authSlice";
import { useTheme } from "../../context/ThemeContext.jsx";

import { toast } from "react-toastify";
import AdminMenu from "../Admin/AdminMenu.jsx";
import FavoritesCount from "../Products/FavoritesCount.jsx";

import { motion, AnimatePresence } from "framer-motion";
import SearchOverlay from "../../components/SearchOverlay.jsx";

/* ══════════════════════════════════════════════
   ANNOUNCEMENT BAR
══════════════════════════════════════════════ */
const AnnouncementBar = () => {
  return (
    <div className="bg-gradient-to-r from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] text-white border-b border-[#2a2a2a] flex justify-center items-center py-2.5 text-[11px] font-bold tracking-[0.18em] uppercase z-50 relative w-full">
      <span>Free Shipping on Orders over ₹4,999 &nbsp;·&nbsp; Easy Returns</span>
    </div>
  );
};

/* ══════════════════════════════════════════════
   MEGA MENU DATA
══════════════════════════════════════════════ */
const megaMenuData = {
  Men: {
    columns: [
      {
        heading: "Shoes",
        links: [
          { label: "All Men's Shoes", to: "/shop?category=Men", bold: true },
          { label: "New Arrivals", to: "/shop?category=Men&filter=new" },
          { label: "Bestsellers", to: "/shop?category=Men&filter=bestsellers" },
          { label: "Everyday Sneakers", to: "/shop?category=Men&collection=Everyday" },
          { label: "Active Shoes", to: "/shop?category=Men&collection=Active" },
          { label: "Weather Ready", to: "/shop?category=Men&collection=Weather" },
          { label: "Sale", to: "/shop?category=Men&filter=sale", highlight: true },
        ],
      },
      {
        heading: "Collections",
        links: [
          { label: "Wool Runners", to: "/shop?search=Wool+Runner" },
          { label: "Tree Runners", to: "/shop?search=Tree+Runner" },
          { label: "Tree Dashers", to: "/shop?search=Tree+Dasher" },
          { label: "Trail Runners", to: "/shop?category=Trail" },
          { label: "Pipers", to: "/shop?search=Piper" },
          { label: "Toppers", to: "/shop?search=Topper" },
        ],
      },
      {
        heading: "Socks & More",
        links: [
          { label: "Ankle Socks", to: "/shop?search=Ankle+Socks" },
          { label: "No-Show Socks", to: "/shop?search=No-Show+Socks" },
          { label: "Insoles", to: "/shop?search=Insoles" },
        ],
      },
    ],
    featured: {
      image:
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80",
      title: "Men's Tree Runners",
      subtitle: "Our everyday sneaker, made lighter",
      to: "/shop?category=Men&search=Tree+Runner",
    },
  },
  Women: {
    columns: [
      {
        heading: "Shoes",
        links: [
          { label: "All Women's Shoes", to: "/shop?category=Women", bold: true },
          { label: "New Arrivals", to: "/shop?category=Women&filter=new" },
          { label: "Bestsellers", to: "/shop?category=Women&filter=bestsellers" },
          { label: "Everyday Sneakers", to: "/shop?category=Women&collection=Everyday" },
          { label: "Flats", to: "/shop?category=Women&collection=Lifestyle" },
          { label: "Active Shoes", to: "/shop?category=Women&collection=Active" },
          { label: "Sale", to: "/shop?category=Women&filter=sale", highlight: true },
        ],
      },
      {
        heading: "Collections",
        links: [
          { label: "Wool Runners", to: "/shop?search=Wool+Runner" },
          { label: "Tree Runners", to: "/shop?search=Tree+Runner" },
          { label: "Tree Breezers", to: "/shop?search=Tree+Breezer" },
          { label: "Tree Dashers", to: "/shop?search=Tree+Dasher" },
          { label: "Pipers", to: "/shop?search=Piper" },
          { label: "Mizzles", to: "/shop?search=Mizzle" },
        ],
      },
      {
        heading: "Socks & More",
        links: [
          { label: "Ankle Socks", to: "/shop?search=Ankle+Socks" },
          { label: "No-Show Socks", to: "/shop?search=No-Show+Socks" },
          { label: "Insoles", to: "/shop?search=Insoles" },
        ],
      },
    ],
    featured: {
      image:
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
      title: "Women's Tree Runners",
      subtitle: "Naturally soft, incredibly light",
      to: "/shop?category=Women&search=Tree+Runner",
    },
  },
  Kids: {
    columns: [
      {
        heading: "Kids' Shoes",
        links: [
          { label: "All Kids' Shoes", to: "/shop?category=Kids", bold: true },
          { label: "Wool Runners", to: "/shop?category=Kids&search=Wool" },
          { label: "Tree Runners", to: "/shop?category=Kids&search=Tree" },
          { label: "New Arrivals", to: "/shop?category=Kids&filter=new" },
        ],
      },
      {
        heading: "By Age",
        links: [
          { label: "Toddlers (1–4)", to: "/shop?category=Kids&search=Toddler" },
          { label: "Little Kids (4–8)", to: "/shop?category=Kids&search=Little" },
          { label: "Big Kids (8–12)", to: "/shop?category=Kids&search=Big" },
        ],
      },
    ],
    featured: {
      image:
        "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=600&q=80",
      title: "Kids' Wool Runners",
      subtitle: "Mini versions of the legend",
      to: "/shop?category=Kids&search=Wool",
    },
  },
  Sale: {
    columns: [
      {
        heading: "On Sale",
        links: [
          { label: "All Sale Items", to: "/shop?filter=sale", bold: true },
          { label: "Men's Sale", to: "/shop?category=Men&filter=sale" },
          { label: "Women's Sale", to: "/shop?category=Women&filter=sale" },
          { label: "Kids' Sale", to: "/shop?category=Kids&filter=sale" },
        ],
      },
      {
        heading: "Top Picks",
        links: [
          { label: "Under ₹5,000", to: "/shop?maxPrice=5000" },
          { label: "Under ₹10,000", to: "/shop?maxPrice=10000" },
          { label: "Last Chance", to: "/shop?filter=sale&sort=price-asc", highlight: true },
        ],
      },
    ],
    featured: {
      image:
        "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80",
      title: "Tree Flyer 2",
      subtitle: "Now 15% off — our lightest shoe",
      to: "/shop?filter=sale&search=Tree+Flyer",
    },
  },
  Sustainability: {
    columns: [
      {
        heading: "Our Mission",
        links: [
          { label: "Sustainability Overview", to: "/sustainability", bold: true },
          { label: "Our Materials", to: "/sustainability#materials" },
          { label: "Carbon Footprint", to: "/sustainability#carbon" },
          { label: "Flight Plan", to: "/sustainability#timeline" },
        ],
      },
      {
        heading: "Natural Materials",
        links: [
          { label: "Merino Wool", to: "/shop?search=Wool" },
          { label: "Tree Fiber (TENCEL™)", to: "/shop?search=Tree" },
          { label: "SweetFoam™ (Sugarcane)", to: "/shop?search=SweetFoam" },
          { label: "Trino™ Blend", to: "/shop?search=Trino" },
        ],
      },
      {
        heading: "Impact",
        links: [
          { label: "B Corp Certified", to: "/sustainability#certifications" },
          { label: "1% for the Planet", to: "/sustainability#certifications" },
          { label: "Carbon Neutral", to: "/sustainability#carbon" },
        ],
      },
    ],
    featured: {
      image:
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80",
      title: "Better Things, In a Better Way",
      subtitle:
        "From materials to delivery, we're working to reduce our footprint",
      to: "/sustainability",
    },
  },
};

const navLinks = [
  { label: "Men", to: "/shop?category=Men", display: "MEN" },
  { label: "Women", to: "/shop?category=Women", display: "WOMEN" },
  { label: "Kids", to: "/shop?category=Kids", display: "KIDS" },
  { label: "Sale", to: "/shop?filter=sale", display: "SALE" },
  { label: "Sustainability", to: "/sustainability", display: "SUSTAINABILITY" },
];

/* ══════════════════════════════════════════════
   MEGA MENU PANEL (desktop)
══════════════════════════════════════════════ */
const MegaMenuPanel = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="mega-menu-panel overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-8 py-10">
        <div className="flex gap-16">
          {/* ── Link Columns ── */}
          <div className="flex-1 flex gap-12">
            {data.columns.map((col, ci) => (
              <motion.div
                key={ci}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 + ci * 0.06, duration: 0.32 }}
                className="min-w-[160px]"
              >
                <h4 className="ab-eyebrow text-black mb-5 font-bold tracking-wider">
                  {col.heading}
                </h4>
                <ul className="space-y-3">
                  {col.links.map((link, li) => (
                    <li key={li}>
                      <Link
                        to={link.to}
                        onClick={onClose}
                        className={`mega-link group flex items-center gap-2 px-2 py-1.5 rounded-md text-[14px] transition-all duration-200 ${link.bold
                          ? "font-bold text-black "
                          : link.highlight
                            ? "font-bold text-red-600 hover:bg-red-50"
                            : "font-medium text-black hover:text-black hover:font-bold hover:bg-gray-100"
                          }`}
                      >
                        <span className="relative">
                          {link.label}
                          <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black group-hover:w-full transition-all duration-300" />
                        </span>
                        {link.bold && (
                          <BsArrowRight
                            size={12}
                            className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                          />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* ── Featured Image Card ── */}
          {data.featured && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.12, duration: 0.4 }}
              className="w-[320px] flex-shrink-0"
            >
              <Link to={data.featured.to} onClick={onClose} className="group block">
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={data.featured.image}
                    alt={data.featured.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-white text-[15px] font-semibold mb-0.5 drop-shadow-sm">
                      {data.featured.title}
                    </p>
                    <p className="text-white/80 text-[12px] drop-shadow-sm">
                      {data.featured.subtitle}
                    </p>
                  </div>
                </div>
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 text-black font-semibold transition-colors duration-200">
                  <span className="ab-eyebrow tracking-wider">Shop Now</span>
                  <BsArrowRight
                    size={12}
                    className="transition-transform duration-200 group-hover:translate-x-1.5"
                  />
                </div>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════
   MOBILE MEGA ACCORDION
══════════════════════════════════════════════ */
const MobileAccordion = ({ label, data, onClose }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-ab-border dark:border-gray-800/50">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between py-4 text-xl font-semibold text-ab-charcoal"
      >
        {label}
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-2xl leading-none select-none"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pb-5 pl-4 space-y-5">
              {data.columns.map((col, ci) => (
                <div key={ci}>
                  <p className="ab-eyebrow text-black mb-2.5 font-bold tracking-wider">
                    {col.heading}
                  </p>
                  <ul className="space-y-2">
                    {col.links.map((link, li) => (
                      <li key={li}>
                        <Link
                          to={link.to}
                          onClick={onClose}
                          className={`text-[15px] block py-0.5 ${link.bold
                            ? "font-bold text-black "
                            : link.highlight
                              ? "font-bold text-red-600 "
                              : "font-medium text-black hover:text-black hover:font-bold"
                            }`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {/* Featured image in mobile */}
              {data.featured && (
                <Link to={data.featured.to} onClick={onClose} className="block mt-3">
                  <div className="relative overflow-hidden aspect-[16/9] rounded-sm">
                    <img
                      src={data.featured.image}
                      alt={data.featured.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <p className="text-white text-sm font-semibold">
                        {data.featured.title}
                      </p>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ══════════════════════════════════════════════
   NAVIGATION COMPONENT
══════════════════════════════════════════════ */
const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuTimeout = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const toggleMobileMenu = () => setMobileMenu((p) => !p);
  const toggleDropdown = () => setDropdownOpen((p) => !p);
  const closeDropdown = () => setDropdownOpen(false);
  const closeMobileMenu = () => setMobileMenu(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 10);

      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleMenuEnter = useCallback((label) => {
    clearTimeout(menuTimeout.current);
    setActiveMenu(label);
  }, []);

  const handleMenuLeave = useCallback(() => {
    menuTimeout.current = setTimeout(() => setActiveMenu(null), 180);
  }, []);

  const handlePanelEnter = useCallback(() => {
    clearTimeout(menuTimeout.current);
  }, []);

  const handlePanelLeave = useCallback(() => {
    menuTimeout.current = setTimeout(() => setActiveMenu(null), 180);
  }, []);

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

  const DropdownItem = ({ to, icon: Icon, label, onClick, isBorder }) => (
    <li
      className={`flex items-center h-10 rounded-lg mx-2 my-0.5 px-3 hover:bg-ab-light-gray dark:hover:bg-white/5 transition-all ${isBorder ? "border-b border-ab-border dark:border-white/10 pb-3 mb-2" : ""
        }`}
    >
      {to ? (
        <Link
          to={to}
          className="flex gap-3 items-center w-full text-sm text-ab-charcoal"
        >
          <Icon size={17} className="text-black" />
          {label}
        </Link>
      ) : (
        <button
          onClick={onClick}
          className="flex gap-3 items-center w-full text-sm text-ab-charcoal"
        >
          <Icon size={17} className="text-black " />
          {label}
        </button>
      )}
    </li>
  );

  return (
    <>
      {/* ── Announcement Bar ── */}
      <AnnouncementBar />

      {/* ── Main Nav ── */}
      <nav
        className={`fixed left-4 right-4 z-50 transition-all duration-500 rounded-[20px] ${hidden ? "-translate-y-[150%] opacity-0" : "translate-y-0 opacity-100"
          } ${mobileMenu || activeMenu
            ? "bg-white border border-gray-200 top-[48px]"
            : scrolled
              ? "bg-white border border-gray-200/60 shadow-nav top-4"
              : "bg-white border border-transparent hover:border-gray-200 top-[48px]"
          }`}
        onMouseLeave={handleMenuLeave}
      >
        <div className="mx-auto px-6">
          <div className="flex items-center justify-between h-[60px]">
            {/* ── Left: hamburger + logo ── */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 text-ab-charcoal"
                aria-label="Menu"
              >
                {mobileMenu ? (
                  <AiOutlineClose size={20} />
                ) : (
                  <HiOutlineMenuAlt1 size={20} />
                )}
              </button>
              <Link
                to="/"
                onClick={() => {
                  closeMobileMenu();
                  setActiveMenu(null);
                }}
                className="flex items-center group"
              >
                <img
                  src="/aerolith_icon.png"
                  alt="AEROLITH Logo"
                  className="h-10 md:h-12 w-auto mr-3 transition-transform duration-700 group-hover:scale-110"
                />
                <span className="text-[22px] md:text-[26px] font-black text-black uppercase translate-y-[1px]" style={{ fontFamily: "'Montserrat', 'Inter', sans-serif", letterSpacing: "0.25em" }}>
                  AEROLITH
                </span>
              </Link>
            </div>

            {/* ── Center: nav links with mega-menu hover triggers ── */}
            <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
              {navLinks.map(({ label, to, display }) => (
                <div
                  key={label}
                  className="relative"
                  onMouseEnter={() => handleMenuEnter(label)}
                >
                  <button
                    className={`text-[13px] font-bold tracking-widest relative transition-colors duration-200 py-[20px] ${activeMenu === label
                      ? "text-black"
                      : "text-black hover:text-black"
                      }`}
                    onClick={() => navigate(to)}
                  >
                    {display}
                    {/* Animated underline indicator */}
                    <motion.span
                      className="absolute bottom-4 left-0 right-0 h-[2.5px] bg-black"
                      initial={false}
                      animate={{
                        scaleX: activeMenu === label ? 1 : 0,
                        opacity: activeMenu === label ? 1 : 0,
                      }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      style={{ originX: 0.5 }}
                    />
                  </button>
                </div>
              ))}
            </div>

            {/* ── Right: icons ── */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-6">
                <div className="relative group py-5">
                  <Link to="/about" className="text-[13px] font-medium text-[#1A1A1A] hover:underline">About</Link>
                  <div className="absolute top-full right-0 w-48 bg-white shadow-xl rounded-xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                    <Link to="/about" className="block px-3 py-2 text-sm text-black hover:bg-gray-50 rounded-lg">Our Story</Link>
                    <Link to="/sustainability" className="block px-3 py-2 text-sm text-black hover:bg-gray-50 rounded-lg">Sustainability</Link>
                    <Link to="/materials" className="block px-3 py-2 text-sm text-black hover:bg-gray-50 rounded-lg">Materials</Link>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 ml-2">
                {/* Favorites */}
                <Link
                  to="/favorite"
                  className="relative text-black hover:text-black transition-colors flex items-center"
                  aria-label="Favorites"
                >
                  <MdOutlineFavoriteBorder size={22} />
                  <FavoritesCount />
                </Link>

                {/* Search */}
                <button
                  onClick={() => {
                    setSearchOpen(true);
                    setActiveMenu(null);
                  }}
                  className="text-black hover:text-black transition-colors"
                  aria-label="Search"
                >
                  <AiOutlineSearch size={22} strokeWidth={1.5} />
                </button>

                {/* Account */}
                {userInfo ? (
                  <div className="relative flex items-center">
                    <button
                      onClick={toggleDropdown}
                      className="text-black hover:text-black transition-colors"
                      aria-expanded={dropdownOpen}
                    >
                      <RiAccountCircleLine size={22} />
                    </button>

                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.ul
                          initial={{ opacity: 0, y: -8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-[48px] right-0 bg-white border border-gray-100 rounded-2xl w-52 z-[60] py-2 shadow-2xl"
                          onClick={closeDropdown}
                        >
                          <div className="px-4 py-3 mb-1 border-b border-gray-100">
                            <p className="text-[10px] font-bold tracking-wider text-black mb-0.5 uppercase">
                              Account
                            </p>
                            <p className="text-sm font-semibold text-[#1A1A1A] truncate">
                              {userInfo.username}
                            </p>
                          </div>
                          {userInfo.isAdmin && (
                            <>
                              <DropdownItem
                                to="/admin/dashboard"
                                icon={MdOutlineSpaceDashboard}
                                label="Dashboard"
                              />
                              <DropdownItem
                                to="/admin/productlist"
                                icon={BsBoxSeam}
                                label="Products"
                              />
                              <DropdownItem
                                to="/admin/categorylist"
                                icon={MdOutlineCategory}
                                label="Categories"
                              />
                              <DropdownItem
                                to="/admin/orderlist"
                                icon={CiCircleList}
                                label="Orders"
                              />
                              <DropdownItem
                                to="/admin/allproductslist"
                                icon={CiCircleList}
                                label="All Products (Bulk)"
                              />
                              <DropdownItem
                                to="/admin/couponlist"
                                icon={MdOutlineFavoriteBorder}
                                label="Coupons"
                              />
                              <DropdownItem
                                to="/admin/userlist"
                                icon={RiContactsLine}
                                label="Users"
                                isBorder
                              />
                            </>
                          )}
                          <DropdownItem
                            to="/profile"
                            icon={RiAccountCircleLine}
                            label="Profile"
                          />
                          <DropdownItem to="/user-orders" icon={FiPackage} label="My Orders" />
                          <DropdownItem
                            icon={MdLogout}
                            label="Logout"
                            onClick={logoutHandler}
                          />
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="text-black hover:text-black transition-colors"
                    aria-label="Login"
                  >
                    <AiOutlineLogin size={22} />
                  </Link>
                )}

                {/* Help */}
                <div className="relative group hidden md:block py-5">
                  <button className="text-black hover:opacity-60 transition-opacity flex items-center">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  </button>
                  <div className="absolute top-full right-0 w-56 bg-white shadow-xl rounded-xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                    <p className="text-[10px] font-bold tracking-wider text-black mb-2 px-3 uppercase">Need Help?</p>
                    <Link to="/faq" className="block px-3 py-2 text-sm text-black hover:bg-gray-50 rounded-lg">FAQ & Returns</Link>
                    <Link to="/contact" className="block px-3 py-2 text-sm text-black hover:bg-gray-50 rounded-lg">Contact Us</Link>
                    <Link to="/shoe-care" className="block px-3 py-2 text-sm text-black hover:bg-gray-50 rounded-lg">Shoe Care</Link>
                  </div>
                </div>

                {/* Cart */}
                <Link
                  to="/cart"
                  className="relative text-black hover:text-black transition-colors flex items-center"
                >
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-[22px] h-[22px]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -bottom-1 -right-1.5 bg-[#1A1A1A] text-white text-[10px] h-[16px] w-[16px] flex items-center justify-center rounded-full font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── MEGA MENU DROPDOWN (desktop) ── */}
        <AnimatePresence>
          {activeMenu && megaMenuData[activeMenu] && (
            <div
              onMouseEnter={handlePanelEnter}
              onMouseLeave={handlePanelLeave}
              className="absolute top-[80px] left-0 right-0 mx-auto bg-transparent px-4 pb-4 w-full"
            >
              <div className="rounded-[24px] shadow-2xl overflow-hidden bg-white border border-gray-100">
                <MegaMenuPanel
                  data={megaMenuData[activeMenu]}
                  onClose={() => setActiveMenu(null)}
                />
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* ── Mobile menu ── */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-ab-border bg-white md:hidden"
            >
              <div className="flex flex-col px-6 py-4 max-h-[80vh] overflow-y-auto">
                {/* Mobile search bar */}
                <button
                  onClick={() => {
                    closeMobileMenu();
                    setSearchOpen(true);
                  }}
                  className="flex items-center gap-3 py-4 text-lg font-semibold text-ab-charcoal border-b border-ab-border"
                >
                  <AiOutlineSearch size={20} />
                  Search
                </button>

                <Link
                  to="/favorite"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 py-4 text-lg font-semibold text-ab-charcoal border-b border-ab-border"
                >
                  <MdOutlineFavoriteBorder size={20} />
                  Favorites
                </Link>

                {navLinks.map(({ label }) => (
                  <MobileAccordion
                    key={label}
                    label={label}
                    data={megaMenuData[label]}
                    onClose={closeMobileMenu}
                  />
                ))}

                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className="py-4 text-lg font-semibold text-ab-charcoal border-b border-ab-border"
                >
                  Home
                </Link>
                <Link
                  to="/cart"
                  onClick={closeMobileMenu}
                  className="py-4 text-lg font-semibold text-ab-charcoal border-b border-ab-border flex items-center gap-3"
                >
                  Cart
                  {cartCount > 0 && (
                    <span className="bg-ab-charcoal text-white text-[10px] h-5 w-5 flex items-center justify-center rounded-full font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/favorite"
                  onClick={closeMobileMenu}
                  className="py-4 text-lg font-semibold text-ab-charcoal border-b border-ab-border"
                >
                  Favorites
                </Link>
                {userInfo && (
                  <Link
                    to="/user-orders"
                    onClick={closeMobileMenu}
                    className="py-4 text-lg font-semibold text-ab-charcoal border-b border-ab-border"
                  >
                    My Orders
                  </Link>
                )}

                {!userInfo && (
                  <div className="flex flex-col gap-3 mt-8 pb-4">
                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="w-full py-3.5 text-center ab-nav-link border border-ab-charcoal rounded-full text-ab-charcoal"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={closeMobileMenu}
                      className="w-full py-3.5 text-center ab-btn-primary"
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Background Overlay ── */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/30 z-30 backdrop-blur-[2px]"
            onClick={() => setActiveMenu(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Search Overlay ── */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navigation;
