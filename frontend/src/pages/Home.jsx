import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import ProductSkeleton, { ProductSkeletonGrid } from "../components/ProductSkeleton";
import { motion } from "framer-motion";
import ContentWrapper from "../components/ContentWrapper";
import CountdownTimer from "../components/CountdownTimer";

/* ── HERO ─────────────────────────────────────── */
const Hero = () => (
  <section className="flex flex-col md:flex-row w-full h-[90vh] min-h-[640px]">
    <div className="flex-1 relative overflow-hidden group">
      <img
        src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2000&auto=format&fit=crop"
        alt="Lifestyle"
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-16">
        <div className="text-white">
          <p className="text-[11px] tracking-[0.25em] font-bold uppercase mb-2 opacity-80">Sustainable & Light</p>
          <h2 className="text-[22px] font-normal" style={{ fontFamily: "serif" }}>For everyday living.</h2>
        </div>
      </div>
    </div>

    <div className="flex-1 relative overflow-hidden group">
      <img
        src="https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=2000&auto=format&fit=crop"
        alt="Fresh Air Shoe"
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-end justify-center pb-16 px-8">
        <div className="text-center text-white w-full">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4 opacity-80">Introducing Varsity Airy</p>
          <h2 className="text-4xl md:text-5xl lg:text-[56px] font-normal mb-10 tracking-tight leading-tight" style={{ fontFamily: "serif" }}>
            Fresh Air<br />For Your Feet
          </h2>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/shop?category=Men" className="px-10 py-3.5 bg-white text-[#1A1A1A] text-[11px] font-bold tracking-[0.18em] hover:bg-[#1A1A1A] hover:text-white transition-colors duration-300 rounded-[100px]">SHOP MEN</Link>
            <Link to="/shop?category=Women" className="px-10 py-3.5 bg-white text-[#1A1A1A] text-[11px] font-bold tracking-[0.18em] hover:bg-[#1A1A1A] hover:text-white transition-colors duration-300 rounded-[100px]">SHOP WOMEN</Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ── FLASH SALE BANNER ───────────────────────── */
const FlashSaleBanner = () => {
  // Set target to 2 days from now for demo
  const target = new Date();
  target.setDate(target.getDate() + 2);

  return (
    <section className="bg-white py-12 px-6 md:px-16 border-y border-[#E5E5E5]">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="w-16 h-16 bg-[#BC4749] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#BC4749]/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-serif text-[#212A2C] mb-1">Seasonal Flash Sale</h2>
            <p className="text-[13px] text-[#767676] uppercase tracking-[0.15em] font-bold">Up to 40% Off — Limited Quantities</p>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-3">
          <p className="text-[10px] font-bold text-[#BC4749] uppercase tracking-[0.2em]">Offer Ends In:</p>
          <CountdownTimer targetDate={target} />
        </div>

        <Link
          to="/shop"
          className="px-10 py-4 bg-[#212A2C] text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#1a2022] transition-all rounded-sm shadow-xl shadow-black/5"
        >
          Explore Sale
        </Link>
      </div>
    </section>
  );
};

/* ── CATEGORY CARDS ───────────────────────────── */
const CategoryCards = () => {
  const cards = [
    { title: "NEW ARRIVALS", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80", link: "/shop", bg: "bg-[#7a7d50]" },
    { title: "MENS", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80", link: "/shop", bg: "bg-[#755640]" },
    { title: "WOMENS", image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80", link: "/shop", bg: "bg-[#87534f]" },
    { title: "BESTSELLERS", image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80", link: "/shop", bg: "bg-[#60302c]" },
  ];

  return (
    <section className="bg-[#f5f4ef] py-20 px-6 md:px-12">
      <div className="max-w-[1500px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-5 items-center">
        {cards.map((card, i) => (
          <Link
            key={i}
            to={card.link}
            className={`relative group overflow-hidden ${card.bg} flex items-center justify-center shadow-sm rounded-[28px] h-[480px]`}
          >
            <img
              src={card.image}
              alt={card.title}
              className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90 transform transition-transform duration-700 group-hover:scale-[1.06]"
            />
            <span className="relative z-10 px-8 py-2.5 border border-white/80 text-white text-[11px] font-bold tracking-[0.22em] rounded-[100px] bg-white/10 backdrop-blur-[2px] group-hover:bg-white group-hover:text-[#1A1A1A] transition-colors duration-300">
              {card.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

/* ── BIG BANNER ───────────────────────────────── */
const BigBanner = () => (
  <section className="w-full py-28 bg-[#f5f4ef] flex flex-col items-center overflow-hidden">
    <p className="text-[11px] font-bold tracking-[0.22em] uppercase border-b border-[#1A1A1A] pb-1 mb-20 text-[#1A1A1A]">New Arrivals</p>

    <div className="relative w-full max-w-[900px] h-[360px] md:h-[480px] flex items-center justify-center mb-16">
      <img
        src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=80"
        alt="Shoe Left"
        className="absolute left-0 md:left-4 w-[42%] md:w-[38%] object-contain mix-blend-multiply opacity-85 -rotate-12 translate-y-4"
      />
      <img
        src="https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=900&q=80"
        alt="Shoe Center"
        className="relative z-10 w-[58%] md:w-[50%] object-contain mix-blend-multiply drop-shadow-2xl"
      />
      <img
        src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=700&q=80"
        alt="Shoe Right"
        className="absolute right-0 md:right-4 w-[42%] md:w-[38%] object-contain mix-blend-multiply opacity-85 rotate-12 translate-y-4 scale-x-[-1]"
      />
    </div>

    <h1 className="text-4xl md:text-6xl lg:text-[72px] font-normal text-[#1A1A1A] mb-4 tracking-tight" style={{ fontFamily: "serif" }}>Cruiser Terralux™</h1>
    <p className="text-[13px] text-gray-600 mb-10 tracking-wide">Anthracite (Dark Gum Sole) — <strong className="text-[#1A1A1A]">₹4,999</strong></p>
    <div className="flex gap-4 flex-wrap justify-center">
      <Link to="/shop?category=Men" className="px-10 py-3 border border-[#1A1A1A] text-[#1A1A1A] text-[11px] font-bold tracking-[0.18em] hover:bg-[#1A1A1A] hover:text-white transition-colors duration-300 rounded-[100px]">SHOP MEN</Link>
      <Link to="/shop?category=Women" className="px-10 py-3 border border-[#1A1A1A] text-[#1A1A1A] text-[11px] font-bold tracking-[0.18em] hover:bg-[#1A1A1A] hover:text-white transition-colors duration-300 rounded-[100px]">SHOP WOMEN</Link>
    </div>
  </section>
);

/* ── PRODUCT CAROUSEL ─────────────────────────── */
const ProductCarousel = ({ title, products, isLoading }) => (
  <section className="py-24 bg-[#f5f4ef] overflow-hidden">
    <div className="flex justify-between items-center px-6 md:px-16 mb-10 border-b border-gray-300/70 pb-4">
      <p className="text-[12px] font-bold tracking-[0.18em] text-[#1A1A1A] uppercase">{title}</p>
      <div className="flex gap-3">
        <button className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] transition-colors duration-300">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] transition-colors duration-300">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>
    </div>

    <div className="px-6 md:px-16">
      {isLoading ? (
        <ProductSkeletonGrid count={4} />
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-10 snap-x no-scrollbar">
          {products?.filter(p => p && p._id).map((p, i) => (
            <Link
              key={p._id || i}
              to={`/product/${p._id}`}
              className="min-w-[280px] w-[280px] md:min-w-[340px] md:w-[340px] snap-start group cursor-pointer bg-white flex flex-col shrink-0"
            >
              <div className="w-full h-[320px] relative overflow-hidden">
                <span className="absolute top-4 left-4 bg-white text-[#1a1a1a] text-[9px] uppercase font-bold px-3 py-1 tracking-[0.1em] z-10 shadow-sm">NEW</span>
                <img
                  src={p.image || p.images?.[0] || "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600"}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
                />
              </div>
              <div className="px-6 py-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-[12px] font-bold text-[#1A1A1A] uppercase tracking-[0.06em] pr-2">{p.name || 'Everyday Sneaker'}</h3>
                  <span className="font-bold text-[12px] shrink-0">₹{p.price?.toLocaleString("en-IN") || '4,999'}</span>
                </div>
                <p className="text-[11px] text-gray-500 mb-6 capitalize">{p.category?.name || 'Classic Color'}</p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                  <div className="flex gap-2 items-center">
                    <span className="w-4 h-4 rounded-full bg-[#827a4d] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] block"></span>
                    <span className="w-4 h-4 rounded-full bg-[#e8e0d4] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] block"></span>
                    <span className="w-4 h-4 rounded-full bg-[#1A1A1A] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] block"></span>
                    <span className="text-[10px] text-gray-400 ml-1">+2</span>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 group-hover:bg-[#1A1A1A] group-hover:text-white group-hover:border-[#1A1A1A] transition-colors duration-300">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 5v14M5 12h14" /></svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  </section>
);

/* ── SPLIT GRID ───────────────────────────────── */
const SplitGrid = ({ title, subtitle, bgImage, products, reverse, fallbackImages = [], isLoading }) => (
  <section className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} w-full`}>
    <div className="w-full md:w-[45%] relative min-h-[600px] md:min-h-[820px]">
      <img src={bgImage} alt={title} className="w-full h-full object-cover absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-transparent"></div>
      <div className="absolute top-16 left-0 right-0 text-center px-8">
        <h2 className="text-3xl md:text-4xl text-white mb-3 tracking-wide" style={{ fontFamily: "serif" }}>{title}</h2>
        <p className="text-[12px] text-white/80 tracking-wide">{subtitle}</p>
      </div>
    </div>

    <div className="flex-1 grid grid-cols-2 gap-px bg-[#E5E4E0] border-[#E5E4E0] border-l md:border-l-0">
      {isLoading ? (
        <div className="col-span-2 grid grid-cols-2 gap-px">
          {[...Array(4)].map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      ) : (
        Array.from({ length: 4 }).map((_, i) => {
          const p = products?.[i] || {};
          return (
            <Link
              key={p._id || i}
              to={p._id ? `/product/${p._id}` : "/shop"}
              className="group relative flex flex-col overflow-hidden bg-white"
            >
              <span className="absolute top-5 left-5 bg-white text-[#1a1a1a] text-[9px] font-bold px-2.5 py-1 tracking-[0.12em] z-10 shadow-sm">NEW</span>
              <div className="w-full h-[260px] md:h-[380px] overflow-hidden">
                <img
                  src={p.image || p.images?.[0] || fallbackImages[i] || "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600"}
                  alt={p.name || "Product"}
                  className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
                />
              </div>
              <div className="px-6 py-5 flex flex-col pt-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-[12px] font-bold text-[#1A1A1A] uppercase tracking-[0.05em] pr-2 line-clamp-1">{p.name || 'Everyday Shoe'}</h3>
                  <p className="text-[12px] font-bold shrink-0">₹{p.price?.toLocaleString("en-IN") || '4,999'}</p>
                </div>
                <p className="text-[11px] text-gray-500 mb-4 capitalize">{p.category?.name || 'Classic'}</p>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
                  <div className="flex gap-1.5 items-center">
                    <div className="w-3 h-3 rounded-full bg-[#1a1a1a]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#dccfb4]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#6a6652]"></div>
                    <span className="text-[10px] text-gray-400 ml-1">+2</span>
                  </div>
                  <div className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 group-hover:bg-[#1A1A1A] group-hover:text-white group-hover:border-[#1A1A1A] transition-colors duration-300">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 5v14M5 12h14" /></svg>
                  </div>
                </div>
              </div>
            </Link>
          );
        })
      )}
    </div>
  </section>
);

/* ── COLLECTION VERTICALS ─────────────────────── */
const CollectionVerticals = () => (
  <section className="w-full flex flex-col md:flex-row h-auto md:h-[820px]">
    {[
      { title: "Dasher NZ Collection", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&q=80", link: "/shop" },
      { title: "Varsity Collection", img: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1000&q=80", link: "/shop" },
      { title: "Terralux™ Collection", img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1000&q=80", link: "/shop" },
    ].map(({ title, img, link }, i) => (
      <div key={i} className="flex-1 relative group overflow-hidden border-r border-[#f0efea] last:border-r-0">
        <img src={img} alt={title} className="w-full h-[60vh] md:h-full object-cover group-hover:scale-[1.04] transition-transform duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>

        <div className="absolute inset-0 flex items-end justify-center pb-12 group-hover:opacity-0 transition-opacity duration-500 pointer-events-none">
          <h2 className="text-white text-[28px] md:text-[34px] text-center tracking-wide" style={{ fontFamily: "serif" }}>{title}</h2>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 gap-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 px-8">
          <h2 className="text-white text-[28px] md:text-[34px] text-center tracking-wide transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500" style={{ fontFamily: "serif" }}>{title}</h2>
          <div className="flex gap-3 w-full max-w-[280px] flex-col transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
            <Link to="/shop?category=Men" className="bg-white/10 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold tracking-[0.2em] text-center py-4 hover:bg-white hover:text-black transition-all duration-300 rounded-full">SHOP MEN</Link>
            <Link to="/shop?category=Women" className="bg-white/10 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold tracking-[0.2em] text-center py-4 hover:bg-white hover:text-black transition-all duration-300 rounded-full">SHOP WOMEN</Link>
          </div>
        </div>
      </div>
    ))}
  </section>
);

/* ── HOME PAGE ────────────────────────────────── */
const RecentlyViewed = () => {
  const [viewed, setViewed] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    setViewed(data);
  }, []);

  if (viewed.length === 0) return null;

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="px-6 md:px-16 mb-14 text-center">
        <h2 className="text-[32px] md:text-[42px] font-normal mb-6 tracking-tight text-[#212A2C]" style={{ fontFamily: "serif" }}>Recently Viewed</h2>
        <div className="w-20 h-[1.5px] bg-[#212A2C] mx-auto mb-8 opacity-10"></div>
        <p className="text-[11px] font-bold text-[#767676] tracking-[0.2em] uppercase">Pick up where you left off</p>
      </div>
      <div className="px-6 md:px-16 overflow-x-auto pb-10 no-scrollbar">
        <div className="flex gap-6">
          {viewed.map((p) => (
            <Link key={p._id} to={`/product/${p._id}`} className="min-w-[180px] group">
              <div className="aspect-square bg-[#f5f5f2] overflow-hidden mb-3 md:mb-4">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="text-[11px] font-bold uppercase tracking-tight line-clamp-1 mb-1">{p.name}</h3>
              <p className="text-[11px] text-gray-600">₹{p.price?.toLocaleString("en-IN")}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });
  const products = data?.products || [];

  const menProducts = products?.filter(p =>
    p && p._id && (p.category?.name?.toLowerCase() === 'men' || p.category === 'Men')
  ).slice(0, 4);

  const womenProducts = products?.filter(p =>
    p && p._id && (p.category?.name?.toLowerCase() === 'women' || p.category === 'Women')
  ).slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-[#f5f4ef] overflow-hidden"
    >
      <Hero />
      <FlashSaleBanner />
      <CategoryCards />
      <BigBanner />
      <ProductCarousel
        title="New Arrivals"
        products={products.slice(0, 10)}
        isLoading={isLoading}
      />
      <div className="flex flex-col gap-16 md:gap-24 my-16 md:my-24">
        <SplitGrid
          title="Men's New Arrivals"
          subtitle="Warm, refined, and wildly comfortable."
          bgImage="https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1200&q=80"
          products={menProducts}
          isLoading={isLoading}
          fallbackImages={[
            "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=85",
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=85",
            "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=85",
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=85",
          ]}
        />
        <SplitGrid
          title="Women's New Arrivals"
          subtitle="Start the season with style and versatility."
          bgImage="https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=1200&q=80"
          products={womenProducts}
          isLoading={isLoading}
          fallbackImages={[
            "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=85",
            "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=85",
            "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&q=85",
            "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&q=85",
          ]}
          reverse
        />
      </div>
      <div className="mt-20 md:mt-32">
        <CollectionVerticals />
      </div>

      <RecentlyViewed />
    </motion.div>
  );
};

export default Home;
