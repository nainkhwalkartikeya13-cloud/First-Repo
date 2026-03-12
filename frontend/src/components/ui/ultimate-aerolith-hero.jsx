import { motion } from 'framer-motion';
import { FiShoppingBag, FiZap, FiTrendingUp, FiAward } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Badge } from './badge';
import { Card } from './card';

export default function UltimateAerolithHero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Liquid Metal Shader Background - CSS Gradient Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0118] via-[#0e1629] to-[#1a0b2e]">
        {/* Animated mesh gradient */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 -left-4 w-[600px] h-[600px] bg-purple-600 rounded-full mix-blend-screen filter blur-[120px] animate-blob"></div>
          <div className="absolute top-0 -right-4 w-[600px] h-[600px] bg-pink-600 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-[600px] h-[600px] bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-violet-600 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-6000"></div>
        </div>

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="container mx-auto px-6 lg:px-8 max-w-7xl relative z-10">
        <motion.div
          className="text-center space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Glowing Badge */}
          <motion.div
            className="flex justify-center"
            variants={itemVariants}
          >
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 animate-gradient-x"></div>
              <Badge className="relative px-8 py-3 bg-black/80 backdrop-blur-xl border-purple-500/30 text-purple-200 text-sm font-semibold tracking-wide">
                <FiZap className="inline mr-2" />
                AEROLITH PREMIUM COLLECTION 2024
              </Badge>
            </div>
          </motion.div>

          {/* Massive Typography */}
          <motion.div
            className="space-y-8"
            variants={itemVariants}
          >
            <motion.h1
              className="text-6xl sm:text-7xl lg:text-8xl xl:text-[10rem] font-black leading-[0.85] tracking-tighter"
              style={{
                fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                background: 'linear-gradient(135deg, #f5f5f5 0%, #a78bfa 50%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 120px rgba(192, 132, 252, 0.5)',
              }}
            >
              LUXE
              <br />
              TECH
            </motion.h1>

            <motion.div
              className="flex items-center justify-center gap-4"
              variants={itemVariants}
            >
              <div className="h-[2px] w-20 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
              <p
                className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-[0.2em] text-gray-300 uppercase"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Redefined
              </p>
              <div className="h-[2px] w-20 bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>
            </motion.div>

            <motion.p
              className="max-w-2xl mx-auto text-xl sm:text-2xl text-gray-400 leading-relaxed font-light"
              style={{ fontFamily: "'Outfit', sans-serif" }}
              variants={itemVariants}
            >
              Where cutting-edge innovation meets
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 font-semibold">
                unparalleled elegance
              </span>
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            variants={itemVariants}
          >
            <Link to="/shop">
              <motion.button
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-12 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-full text-white text-xl font-bold tracking-wide overflow-hidden shadow-2xl shadow-purple-500/50"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <FiShoppingBag className="text-2xl" />
                  Explore Collection
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                  <div className="h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent"></div>
                </div>
              </motion.button>
            </Link>

            <Link to="/shop">
              <motion.button
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-6 border-2 border-purple-500/50 rounded-full text-purple-200 text-xl font-bold tracking-wide backdrop-blur-xl hover:border-purple-400 hover:bg-purple-500/10 transition-all duration-300 shadow-xl"
              >
                View Offers
              </motion.button>
            </Link>
          </motion.div>

          {/* Feature Grid */}
          <motion.div
            className="pt-20"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.4 }}
              className="relative group"
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <Card className="relative bg-black/40 border border-purple-500/20 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-pink-900/10"></div>
                <div className="relative p-12">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <FeatureItem
                      icon={<FiZap />}
                      title="Lightning Fast"
                      description="Same-day delivery available"
                    />
                    <FeatureItem
                      icon={<FiAward />}
                      title="Premium Quality"
                      description="100% authentic products"
                    />
                    <FeatureItem
                      icon={<FiTrendingUp />}
                      title="Secure Payments"
                      description="Bank-grade encryption"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap');
        
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          25% {
            transform: translate(40px, -60px) scale(1.1);
          }
          50% {
            transform: translate(-40px, 40px) scale(0.95);
          }
          75% {
            transform: translate(60px, 20px) scale(1.05);
          }
        }
        
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-blob {
          animation: blob 12s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animation-delay-6000 {
          animation-delay: 6s;
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
          background-size: 200% 200%;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </section>
  );
}

const FeatureItem = ({ icon, title, description }) => (
  <motion.div
    className="text-center space-y-4 group/item"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-50 group-hover/item:opacity-75 transition-opacity"></div>
        <div className="relative text-5xl text-purple-400 group-hover/item:text-pink-400 transition-colors duration-300 bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-purple-500/30">
          {icon}
        </div>
      </div>
    </div>
    <h3 className="text-2xl font-bold text-white group-hover/item:text-purple-300 transition-colors" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {title}
    </h3>
    <p className="text-purple-300/80 text-base">{description}</p>
  </motion.div>
);
