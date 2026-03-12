import { Link } from "react-router-dom";
import {
  FaGithub,
  FaLinkedinIn,
  FaInstagram,
  FaTwitter,
  FaPinterest,
} from "react-icons/fa";
import { useState } from "react";
import { toast } from "react-toastify";

const footerCols = [
  {
    title: "Shop",
    links: [
      { label: "Men's Shoes", to: "/shop" },
      { label: "Women's Shoes", to: "/shop" },
      { label: "Running", to: "/shop" },
      { label: "Trail", to: "/shop" },
      { label: "New Arrivals", to: "/shop" },
      { label: "Sale", to: "/shop" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "FAQs", to: "/" },
      { label: "Sizing Guide", to: "/" },
      { label: "Shipping & Returns", to: "/" },
      { label: "Care Instructions", to: "/" },
      { label: "Contact Us", to: "/" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Story", to: "/" },
      { label: "Sustainability", to: "/" },
      { label: "B Corp Certification", to: "/" },
      { label: "Careers", to: "/" },
      { label: "Blog", to: "/" },
    ],
  },
];

const socials = [
  {
    icon: FaGithub,
    href: "https://github.com/KartikeyaNainkhwal",
    label: "GitHub",
  },
  {
    icon: FaLinkedinIn,
    href: "https://www.linkedin.com/in/kartikeya-nainkhwal-6493402b0/",
    label: "LinkedIn",
  },
  {
    icon: FaInstagram,
    href: "https://www.instagram.com/kartikeya_nainkhwal/",
    label: "Instagram",
  },
  { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
  { icon: FaPinterest, href: "https://pinterest.com", label: "Pinterest" },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const year = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("Welcome to AEROLITH ✨");
    setEmail("");
  };

  return (
    <footer className="relative w-full text-[#2d2d2d] overflow-hidden">

      {/* SHINY BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fffefb] via-[#f7f2ea] to-[#efe7da]" />

      {/* LIGHT REFLECTION */}
      <div className="absolute -top-40 left-1/2 w-[800px] h-[400px] bg-white/40 blur-[120px] rounded-full -translate-x-1/2" />

      <div className="relative max-w-[1320px] mx-auto px-6 md:px-10 backdrop-blur-sm">

        {/* MAIN GRID */}
        <div className="py-20 grid grid-cols-2 md:grid-cols-5 gap-12">

          {/* BRAND */}
          <div className="col-span-2 flex flex-col">

            <Link to="/" className="flex items-center mb-4 group">
              <img
                src="/aerolith_icon.png"
                alt="Aerolith Logo"
                className="h-14 md:h-16 w-auto mr-4 transition-transform duration-700 group-hover:scale-110"
              />
              <span className="text-[28px] md:text-[34px] font-black tracking-[0.25em] text-black pr-1 uppercase translate-y-[2px]" style={{ fontFamily: "'Montserrat', 'Inter', sans-serif" }}>
                AEROLITH
              </span>
            </Link>

            <p className="text-[15px] text-black leading-relaxed mb-8 max-w-xs font-medium">
              Shoes and apparel crafted from natural materials for
              comfort, sustainability, and timeless style.
            </p>

            {/* NEWSLETTER */}
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-black mb-3">
              Join the Community
            </p>

            <form
              onSubmit={handleSubscribe}
              className="flex rounded-xl overflow-hidden border border-[#e6dfd4] shadow-sm bg-white/60 backdrop-blur"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-transparent text-[14px] text-black font-medium placeholder-gray-600 focus:outline-none"
              />

              <button
                type="submit"
                className="px-6 bg-[#1f1f1f] text-white text-[11px] uppercase tracking-[0.12em] hover:bg-black transition"
              >
                Join
              </button>
            </form>

            {/* SOCIALS */}
            <div className="flex gap-3 mt-7">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-black hover:text-black hover:shadow-md hover:bg-gray-100 transition"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>

          </div>

          {/* COLUMNS */}
          {footerCols.map((col) => (
            <div key={col.title}>
              <h3 className="text-[12px] font-bold uppercase tracking-[0.18em] text-black mb-6">
                {col.title}
              </h3>

              <ul className="space-y-3">
                {col.links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-[15px] font-medium text-black hover:text-black hover:underline transition"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* BOTTOM BAR */}
        <div className="py-8 border-t border-gray-300 flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] font-medium text-black">

          <div className="flex items-center gap-5">
            <span>&copy; {year} AEROLITH</span>

            <Link to="/" className="hover:text-black transition">
              Privacy Policy
            </Link>

            <Link to="/" className="hover:text-black transition">
              Terms
            </Link>

            <Link to="/" className="hover:text-black transition">
              Accessibility
            </Link>
          </div>

          <div className="flex gap-3">
            <span className="border border-[#e2dbd0] px-3 py-1 text-[10px] uppercase tracking-[0.14em]">
              Certified B Corp
            </span>

            <span className="border border-[#e2dbd0] px-3 py-1 text-[10px] uppercase tracking-[0.14em]">
              1% for the Planet
            </span>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;