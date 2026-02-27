import { Link } from "react-router-dom";
import { FaGithub, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import ContentWrapper from "../components/ContentWrapper";

const socialLinks = [
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
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-brand-deeper border-t border-surface-border">
      <ContentWrapper>
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-display font-bold text-text-primary mb-3">
                LuxeHaven
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
                Your destination for premium products. Curated collections, exceptional quality.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {[
                  { to: "/", label: "Home" },
                  { to: "/shop", label: "Shop" },
                  { to: "/cart", label: "Cart" },
                  { to: "/favorite", label: "Favorites" },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-text-muted hover:text-accent-pink transition-colors text-sm"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-4">
                Connect
              </h3>
              <div className="flex gap-3">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-10 h-10 rounded-lg bg-surface-card hover:bg-accent-pink flex items-center justify-center text-text-secondary hover:text-white transition-all duration-300"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-6 border-t border-surface-border flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-text-secondary text-sm">
              © {currentYear} LuxeHaven. Made with 🖤 by{" "}
              <a
                href="https://github.com/KartikeyaNainkhwal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-primary hover:text-accent-pink transition-colors font-medium"
              >
                Kartikeya Nainkhwal
              </a>
            </p>
            <p className="text-text-secondary text-xs">
              All rights reserved.
            </p>
          </div>
        </div>
      </ContentWrapper>
    </footer>
  );
};

export default Footer;
