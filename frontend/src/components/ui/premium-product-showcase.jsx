import { motion } from 'framer-motion';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export function PremiumProductShowcase() {
  const products = [
    {
      id: 1,
      name: "MacBook Pro 16\"",
      category: "Laptops",
      price: "$2,399",
      rating: 4.9,
      image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQDw0ODxISDQ0ODg8ODg0OEBAODw4OFREXFhURFRMYHCggGBolGxMTITEhJSkrLi4uFx8/ODMsNy0wLisBCgoKDg0NDxAPFSsZFRktKystLSsrKys3KysrLSsrKy0rNysrLSsrKy0rKysrKy0rKystKysrKysrKysrKysrK//AABEIAKMBNQMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAQIDBAUGB//EAD4QAAIBAQQFCQYEBQUBAAAAAAABAgMEESFREhQxQZMFE1NhcZGSodEGFTJSgdIig7HBI0KCwuFDY6Ky8Rb/xAAWAQEBAQAAAAAAAAAAAAAAAAAAAQL/xAAYEQEBAQEBAAAAAAAAAAAAAAAAEQEhMf/aAAwDAQACEQMRAD8A+GgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzUJpJrRjKUnFKUsdFY34bMcMeo39TrfJDhxOXE3I2+pd8UvEwNnVa3R0+HElWat0dPhRNb3hU+aXiY941Pml4mXg2tWrdHT4USVZq3RU+FE1o2+q9jm+xyZljaLQ9iqd8hwZlY6/RU+FH0J1G0dFT4UfQxc9asqnil6k6xav8Ac8UvUDJqNo6Gnwo+hDsNp6Gm/wAqPoY9atWdXxy9Rrdqzq+OXqBfUrT0EOFH0GpWnoIcKPoU1u1fNV8cvUjW7V81Xxy9QMrsdo6GnwY+hilRrL/Sp8KPoTG1Wm/4qvjl6no+Rp2lJym9KklfPnfxRUc73ihEeTnaJRwlTprtpRKa4/kpcKB0+WbTGo27kuw5/J1BTmk8VeFTCtOWynTf5UTJdU6Onwo+h6Ple0QslKlClCPPVYuTnJKXNwWGCzbv25HmZcoVJPGTb7cO4Cs5yW2FPhxMTrv5YcOJ2bPZecpznLBRhKV+/BHGrIQFXV0lKEHfF3NLRcXuaaNYs/1/QqQAAAAAAAAAAAAAAAAAAAAAAAACxUlAbNks0qktGPeens3IVnoU1WtU1GO6/wDFKTyjFbTk8hVVFq/Mv7RVpVK0m3eopRgt0Ypbv1+prBuVvaOhDCz2ZPKdd4+CPqasvai0P4Y0odUKMX/2vOTZKalNKWw9bWtNCyUabp0Y161RN31L+bglvaWLeOzAI4/v21ve/pSpr+0h8tWvr4dP7SantRaG8FRgsoUaf9yZT/6S0vfB9lCh9goPli1dfDh9pV8r2nr4cPQv76tT3LgUvtKPla05Lg0/tAj3vac3w4faPe9pzfDh9pD5UtGS4VP7R71r5LhU/tIp73tOb4cPQ1rTyhXnhUnOSX8rb0V/TsNunynXbxSf5UPQ69KuuabrUYLdGpG+N7yue36FHkpTb2nY9nqV849po8oKGlfBXdR1fZutGM46TuV6Jnoj2sr6VpnHdShCkvpG9+cpHEo/EjZ5SlKVWrJp3yqTk+1yb/c01FjR6a0VlGxyUcXOcIyu3Rxd/ekvqebq3mSFomldiY6tVvbu/UDEyACAAAAAAAAAAAAAAAAAAAAAAAAAAANmy1LmblrnpJPqxOdTi9qTe42NOV12i+8oxU5XSvOtXr6dKOcW19H/AOHIlGXysyRrSSa0WBjqbT0PIdoo003oRqVLvwRm7ouXWzzsr3/KwtJbmKPT263coJ/DCmt0aVGkl/yTfmaUrdbt6fCo/acynbK0VdGU4rJSkkX942jpKvjn6ijcla7XvT4dP7SjtdqyfDp+hq+8LR0lXxz9SNdr/PU8cxRsu12nrX9EPQwV5Wio75uc2tmk27uxbimuVvmqeKRGt1vmn4pAVdmqfKy0KFVbItDWq3zT8UhrVbOffIDK3V3pvtxKt1cvJFNYq5z75Dnqucu9gTLnN68kaknebM6lV4PSx3Xt3mqQAAAAAAAAAAAAAAAAAAAAAAFki0YAYybjZhSNmnZ0WDnKDN/k/kyVT8Uk401v3y6l6nSsdjhhKbSjfck2le8jpzrQSuUo9STQHHtCUWoxWxXLDCKNOVBZNt47Hj2s67qK/au9B1Fmu8DiOz3XYeV5eVnwvuu6viOtziz8yzqLPzA4zs/Vd24oRs9+667PFHVc8TJCsBydWWV3XtXcNWWy767u5nYdZByeT7gjjuzLK95rYvoyNXWV/Zu7zsaTyfcyL3k+5hXHdBJbL+pXkqzrK/Ld/g6zndtwIdQDkxoLHD9sf0I5lb19Lm/NYHUlULKoByFRx+HPan+xPMJbr/6b7jrc4sxziz8wOfRd10bndfenc74/4Mtt5L01p01dPa47pdnWbbqLNd5t2atHfJL6oDyLpNbVcV0Westlnp1MU46bya/EcipZ0IOVcQbtSgYJQIMILNEXAQAAAAAAAAAABJAAsmXjIxE3gbUKhsQrnOUiVMtG9VrzaSXwp6V2G2679kUUqnV5GuqpZVmBnvq5LyJ/i5LyMSrkq0AZbquS8iVGtku9GNWgsrSBfQrZLvQ0K2S70VVpJ1oC2jX6u9F9K05+Zj1oa0Bk0rTn5oaVpz80Y9aGtAWkq723PtaK6FbJd6GtEa0BOhWyXeiNGtku9DWirtIE3Vsl5Efxcl5EO0FXaALfxcl5EOVTq8ijrlXXYGanVqRkpLBrfgZXXNF1WVcwNqdUwSmYnIi8UWbKkAgAAAAAAAAAAAAAAAAAAASQAJvF5AAtpDSKgC2kTpFABfSGkUAF9IaRQAX0hpFABfSI0ioAtpEXkACbxeQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//2Q==",
      specs: "M3 Max • 36GB RAM • 1TB SSD"
    },
    {
      id: 2,
      name: "iPhone 15 Pro Max",
      category: "Smartphones",
      price: "$1,199",
      rating: 4.8,
      image: "https://helios-i.mashable.com/imagery/articles/06wnxZHwspHyshsLowZKos5/hero-image.fill.size_1248x702.v1694542951.png",
      specs: "Titanium • A17 Pro • 256GB"
    },
    {
      id: 3,
      name: "AirPods Pro (2nd gen)",
      category: "Audio",
      price: "$249",
      rating: 4.7,
      image: "https://www.techhive.com/wp-content/uploads/2023/04/AirPods-Pro-2nd-gen-hero.jpg?quality=50&strip=all&w=1024",
      specs: "Active Noise Cancellation"
    },
    {
      id: 4,
      name: "Apple Watch Ultra 2",
      category: "Wearables",
      price: "$799",
      rating: 4.9,
      image: "https://www.apple.com/newsroom/images/2024/09/apple-watch-ultra-2-now-available-in-black-titanium/article/Apple-Watch-Ultra-2-Alpine-Loop-240909_inline.jpg.large.jpg",
      specs: "Titanium • 49mm • GPS + Cellular"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-32">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-slate-400 uppercase tracking-wider text-sm mb-4 font-semibold">
            Curated Selection
          </p>
          <h2 
            className="text-4xl md:text-6xl font-bold mb-6"
            style={{
              fontFamily: "'Outfit', sans-serif",
              background: 'linear-gradient(to bottom, #f8fafc 0%, #cbd5e1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Featured Products
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Handpicked premium technology for discerning customers
          </p>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <div className="relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all duration-300">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-slate-800">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
            <button className="w-full bg-white text-slate-900 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
              <FiShoppingCart />
              Quick Add
            </button>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-slate-700">
            <FiStar className="text-yellow-400 fill-yellow-400 text-sm" />
            <span className="text-white text-sm font-semibold">{product.rating}</span>
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-700">
            <span className="text-slate-300 text-xs font-semibold uppercase tracking-wide">
              {product.category}
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6 space-y-3">
          <h3 className="text-xl font-bold text-white group-hover:text-slate-200 transition-colors" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {product.name}
          </h3>
          
          <p className="text-slate-400 text-sm">
            {product.specs}
          </p>

          <div className="flex justify-between items-center pt-2">
            <p className="text-2xl font-bold text-white">
              {product.price}
            </p>
            <Link to={`/product/${product.id}`}>
              <button className="text-slate-400 hover:text-white transition-colors text-sm font-semibold">
                View Details →
              </button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
