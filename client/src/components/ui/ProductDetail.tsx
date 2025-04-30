import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Share2, ShoppingCart, Tag, Shield, Award, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from '../../schema';
import { Avatar3D } from './3d-avatar';
import { StatsCard3D } from './3d-stats-card';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

// Sample product images for demonstration
const demoImages = [
  "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1579403124614-197f69d8187b?q=80&w=1000&auto=format&fit=crop",
];

export default function ProductDetail({ product, onClose }: ProductDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Get category-specific colors
  const getCategoryColor = (category?: string | null) => {
    const safeCategory = typeof category === 'string' ? category : 'digital';
    const categoryMap: Record<string, { gradient: string, bg: string, accent: string }> = {
      'Templates': { 
        gradient: 'from-violet-600 to-indigo-600', 
        bg: 'bg-violet-500/10',
        accent: 'text-violet-400'
      },
      'E-books': { 
        gradient: 'from-blue-500 to-cyan-400', 
        bg: 'bg-blue-500/10',
        accent: 'text-blue-400'
      },
      'Courses': { 
        gradient: 'from-amber-500 to-orange-500', 
        bg: 'bg-amber-500/10',
        accent: 'text-amber-400'
      },
      'Graphics': { 
        gradient: 'from-pink-500 to-rose-500', 
        bg: 'bg-pink-500/10',
        accent: 'text-pink-400'
      },
      'SoftDev': { 
        gradient: 'from-emerald-500 to-green-500', 
        bg: 'bg-emerald-500/10',
        accent: 'text-emerald-400'
      },
      'digital': { 
        gradient: 'from-purple-600 to-indigo-600', 
        bg: 'bg-purple-500/10',
        accent: 'text-purple-400'
      }
    };
    
    return categoryMap[safeCategory] || categoryMap['digital'];
  };

  const categoryColors = getCategoryColor(product.category || undefined);
  const images = product.imageUrl ? [product.imageUrl, ...demoImages.slice(0, 4)] : demoImages;

  const nextImage = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevImage = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-auto bg-[#0A0A23] rounded-2xl shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex flex-col lg:flex-row">
          {/* Left column - Product images */}
          <div className="lg:w-1/2 relative h-[40vh] lg:h-[80vh] bg-gradient-to-br from-black/50 to-[#1a1a3a]/30 overflow-hidden">
            {/* 3D background effects */}
            <div className="absolute inset-0 bg-mesh-gradient opacity-50"></div>
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#0A0A23] to-transparent"></div>
            
            {/* Main product image with 3D float effect */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentImageIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center p-8"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut"
                  }}
                  className="relative w-full h-full max-h-[500px] rounded-xl overflow-hidden shadow-2xl"
                  style={{ 
                    boxShadow: `0 20px 50px -10px rgba(0, 0, 0, 0.5), 
                                0 0 30px rgba(${product.category === 'Templates' ? '124, 58, 237' : 
                                                product.category === 'E-books' ? '59, 130, 246' : 
                                                product.category === 'Courses' ? '245, 158, 11' : 
                                                product.category === 'Graphics' ? '236, 72, 153' : 
                                                product.category === 'SoftDev' ? '16, 185, 129' : '139, 92, 246'}, 0.3)`
                  }}
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${images[currentImageIndex] || ''})` }}
                  />
                  
                  {/* Premium gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 opacity-50 shine-animation"
                    style={{
                      background: "linear-gradient(105deg, transparent 20%, rgba(255, 255, 255, 0.2) 50%, transparent 80%)",
                      backgroundSize: "200% 200%"
                    }}
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>
            
            {/* Navigation arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
            
            {/* Thumbnail indicators */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === currentImageIndex 
                      ? `w-8 bg-gradient-to-r ${categoryColors.gradient}` 
                      : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* Right column - Product details */}
          <div className="lg:w-1/2 p-6 lg:p-10 overflow-y-auto max-h-[80vh]">
            {/* Badges and category */}
            <div className="flex items-center gap-2 mb-3">
              <Badge className={`px-2.5 py-1 ${categoryColors.bg} ${categoryColors.accent} border-none`}>
                {product.category || "Digital Product"}
              </Badge>
              
              {(product.price || 0) > 49.99 && (
                <Badge className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border-none">
                  <Award className="w-3 h-3 mr-1" /> Premium
                </Badge>
              )}
            </div>
            
            {/* Product title */}
            <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-gradient">
              {product.name}
            </h1>
            
            {/* Creator info */}
            <div className="flex items-center gap-3 mb-6">
              <Avatar3D 
                letter={product.author?.name?.[0] || "C"} 
                size="sm" 
                verified={true} 
              />
              <div>
                <p className="text-gray-400 text-sm">Creator</p>
                <p className="font-medium">{product.author?.name || "Anonymous"}</p>
              </div>
            </div>
            
            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3">Description</h3>
              <p className="text-gray-300 mb-4">
                {product.description || "No description available for this premium digital product."}
              </p>
              <p className="text-gray-300">
                This product provides exceptional quality and value, designed for professionals who demand the best in their digital assets. Perfect for enhancing your workflow and achieving outstanding results.
              </p>
            </div>
            
            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <StatsCard3D
                title="User Rating"
                value={`${product.rating?.toFixed(1) || "4.9"} / 5.0`}
                color="#f59e0b"
                icon={<Award className="w-5 h-5" />}
                className="h-24"
              />
              <StatsCard3D
                title="Sales"
                value={`${product.sales || "1,250"}+`}
                color="#3b82f6"
                icon={<ShoppingCart className="w-5 h-5" />}
                className="h-24"
              />
            </div>
            
            {/* Features list */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3">Key Features</h3>
              <ul className="space-y-3">
                {[
                  "Premium quality assets with lifetime updates",
                  "Compatible with all major software and platforms",
                  "Full documentation and support included",
                  "Commercial license for unlimited projects",
                  "Instant digital delivery"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className={`mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-r ${categoryColors.gradient} flex items-center justify-center`}>
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Price and CTA */}
            <div className="mt-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 relative overflow-hidden">
              {/* Corner shine effect */}
              <div className="absolute top-0 right-0 w-24 h-24">
                <div className="absolute top-0 right-0 w-full h-full rounded-bl-full bg-gradient-to-bl from-white/20 to-transparent" />
              </div>
              
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-gray-400 mb-1">Current Price:</p>
                  <div className="flex items-center gap-3">
                    <motion.p 
                      className="text-4xl font-bold"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        ${product.price || "59.99"}
                      </span>
                    </motion.p>
                    {(product.price || 0) > 30 && (
                      <p className="text-gray-500 line-through">${((product.price || 59.99) * 1.25).toFixed(2)}</p>
                    )}
                  </div>
                </div>
                
                <Badge className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border-none">
                  <Shield className="w-3 h-3 mr-1" /> Secure Purchase
                </Badge>
              </div>
              
              {/* CTA buttons */}
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: `0 15px 30px -5px rgba(${product.category === 'Templates' ? '124, 58, 237' : 
                                                        product.category === 'E-books' ? '59, 130, 246' : 
                                                        product.category === 'Courses' ? '245, 158, 11' : 
                                                        product.category === 'Graphics' ? '236, 72, 153' : 
                                                        product.category === 'SoftDev' ? '16, 185, 129' : '139, 92, 246'}, 0.5)`
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex-1 py-4 rounded-xl font-semibold text-white flex items-center justify-center overflow-hidden`}
                  style={{
                    background: `linear-gradient(to right, ${product.category === 'Templates' ? '#7c3aed, #6d28d9' : 
                                                             product.category === 'E-books' ? '#3b82f6, #0ea5e9' : 
                                                             product.category === 'Courses' ? '#f59e0b, #ea580c' : 
                                                             product.category === 'Graphics' ? '#ec4899, #be123c' : 
                                                             product.category === 'SoftDev' ? '#10b981, #059669' : '#8b5cf6, #6d28d9'})`
                  }}
                >
                  {/* Shine overlay */}
                  <div className="absolute inset-0 shine-animation opacity-50" />
                  
                  {/* Button content */}
                  <div className="relative z-10 flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Buy Now
                  </div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 text-white"
                >
                  <Heart className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 text-white"
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}