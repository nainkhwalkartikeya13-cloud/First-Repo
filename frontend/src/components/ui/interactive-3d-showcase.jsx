import { motion } from 'framer-motion';
import { FiShoppingCart, FiStar, FiHeart } from 'react-icons/fi';
import { SplineScene } from './spline-scene';
import { Card } from './card';
import { useState } from 'react';

export function Interactive3DShowcase() {
  return (
    <div className="bg-gradient-to-b from-[#0e1629] via-[#1a0b2e] to-[#0e1629] py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-[150px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600 rounded-full filter blur-[150px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        

        {/* Floating Feature Cards */}
        
      </div>
    </div>
  );
}

function Product3DCard({ title, price, rating, splineUrl, description }) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      whileHover={{ y: -8 }}
      className="group relative"
    >
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition duration-500"></div>
      
      <Card className="relative bg-black/40 border border-purple-500/20 backdrop-blur-2xl rounded-3xl overflow-hidden">
        {/* 3D Spline Scene */}
        <div className="h-[400px] relative overflow-hidden bg-gradient-to-br from-purple-900/10 to-pink-900/10">
          <SplineScene 
            scene={splineUrl}
            className="w-full h-full"
          />
          
          {/* Overlay buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsLiked(!isLiked)}
              className="bg-black/50 backdrop-blur-xl p-3 rounded-full border border-purple-500/30 hover:border-pink-500/50 transition-colors"
            >
              <FiHeart className={`text-xl ${isLiked ? 'fill-pink-500 text-pink-500' : 'text-white'}`} />
            </motion.button>
          </div>

          {/* Rating badge */}
          <div className="absolute top-4 left-4">
            <div className="bg-black/50 backdrop-blur-xl px-4 py-2 rounded-full border border-purple-500/30 flex items-center gap-2">
              <FiStar className="text-yellow-400 fill-yellow-400" />
              <span className="text-white font-bold">{rating}</span>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-8 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {title}
              </h3>
              <p className="text-purple-300/80">{description}</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {price}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              <FiShoppingCart className="text-xl" />
              Add to Cart
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 border-2 border-purple-500/50 text-purple-300 py-4 rounded-xl font-bold hover:bg-purple-500/10 transition-all"
            >
              Details
            </motion.button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function FloatingFeature({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      className="relative group"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
      <Card className="relative bg-black/40 border border-purple-500/20 backdrop-blur-xl p-8 rounded-2xl text-center">
        <div className="text-5xl mb-4">{icon}</div>
        <h4 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
          {title}
        </h4>
        <p className="text-purple-300/80">{description}</p>
      </Card>
    </motion.div>
  );
}
