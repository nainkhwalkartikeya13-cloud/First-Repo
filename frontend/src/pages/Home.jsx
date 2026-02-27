import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Product from "./Products/Product";

import ContentWrapper from "../components/ContentWrapper";
import HeroBottom from "../components/HeroBottom";
import { LuxehavenLampHero } from "../components/ui/luxehaven-lamp-hero.jsx";
import { ContainerScroll } from "../components/ui/container-scroll-animation.jsx";
import { Interactive3DShowcase } from "../components/ui/interactive-3d-showcase.jsx";
import { PremiumProductShowcase } from "../components/ui/premium-product-showcase.jsx";
import { motion } from "framer-motion";
import { FiTrendingUp, FiShield, FiZap, FiAward } from "react-icons/fi";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center w-full h-[100vh] bg-slate-950">
          <Loader />
        </div>
      ) : isError ? (
        <Message variant="danger">
          {isError?.data?.message || isError.error}
        </Message>
      ) : (
        <div className="bg-slate-950">
          {/* 🎭 PROFESSIONAL LAMP HERO */}
          {!keyword && <LuxehavenLampHero />}

          {/* ✨ PREMIUM PRODUCT SHOWCASE WITH REAL IMAGES */}
          <PremiumProductShowcase />

          {/* 🎯 TRUST INDICATORS */}
          <TrustSection />

          {/* 🎭 3D CONTAINER SCROLL SECTION */}
          <div className="bg-gradient-to-b from-slate-950 to-slate-900 overflow-hidden">
            <ContainerScroll
              titleComponent={
                <div className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="inline-block px-8 py-3 bg-slate-800/50 border border-slate-700 rounded-full backdrop-blur-xl mb-6"
                  >
                    <span className="text-slate-300 font-semibold text-lg tracking-wide">
                      THE LUXEHAVEN DIFFERENCE
                    </span>
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-bold leading-tight"
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      background: 'linear-gradient(to bottom, #f8fafc 0%, #cbd5e1 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Experience
                    <br />
                    Excellence
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-light"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    Where cutting-edge technology meets timeless elegance
                  </motion.p>
                </div>
              }
            >
              <img
                src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=2832&auto=format&fit=crop"
                alt="Luxehaven Premium Experience"
                className="mx-auto rounded-2xl object-cover h-full w-full object-center"
                draggable={false}
              />
            </ContainerScroll>
          </div>

          {/* 🎮 INTERACTIVE 3D SHOWCASE */}
          <Interactive3DShowcase />

          {/* 💎 YOUR CURATED PRODUCTS */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 py-32">
            <ContentWrapper>
              <div className="space-y-16">
                {/* Section Header */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="flex flex-col md:flex-row justify-between items-center gap-8 mx-4"
                >
                  <div className="text-center md:text-left">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6 }}
                      className="inline-flex items-center gap-2 px-6 py-2 bg-slate-800/50 border border-slate-700 rounded-full backdrop-blur-xl mb-4"
                    >
                      <FiTrendingUp className="text-slate-400" />
                      <span className="text-slate-300 font-semibold tracking-wide">TRENDING NOW</span>
                    </motion.div>

                    <h2
                      className="text-4xl md:text-6xl font-bold mb-4"
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        background: 'linear-gradient(to bottom, #f8fafc 0%, #cbd5e1 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      Latest Arrivals
                    </h2>
                    <p className="text-slate-400 text-xl font-light" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      Handpicked selections for you
                    </p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Link to="/shop">
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="group px-10 py-5 bg-white text-slate-900 rounded-full font-bold text-lg overflow-hidden hover:bg-slate-100 transition-colors shadow-xl"
                      >
                        View All Products
                      </motion.button>
                    </Link>
                  </motion.div>
                </motion.div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mx-4">
                  {data?.products?.slice(0, 8).map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -8 }}
                    >
                      <Product product={product} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </ContentWrapper>
          </div>

          <HeroBottom />
        </div>
      )}
    </>
  );
};

export default Home;

// Trust Section Component
function TrustSection() {
  const features = [
    {
      icon: <FiShield />,
      title: "Secure Payment",
      description: "Bank-grade encryption for all transactions"
    },
    {
      icon: <FiZap />,
      title: "Fast Shipping",
      description: "Same-day dispatch on all orders"
    },
    {
      icon: <FiAward />,
      title: "Authentic Products",
      description: "100% genuine, warranty included"
    },
    {
      icon: <FiTrendingUp />,
      title: "24/7 Support",
      description: "Expert assistance anytime you need"
    }
  ];

  return (
    <div className="bg-slate-950 py-24 border-t border-b border-slate-800">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center space-y-4"
            >
              <div className="flex justify-center">
                <div className="text-4xl text-slate-400 bg-slate-900 p-6 rounded-2xl border border-slate-800">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {feature.title}
              </h3>
              <p className="text-slate-400 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}