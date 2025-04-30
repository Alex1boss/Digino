import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Star, Share2, Heart, ShoppingCart, 
  Check, Shield, DollarSign, Award, Download
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Product } from "@/schema";
import { Avatar3D } from "@/components/ui/3d-avatar";
import { Badge3D } from "@/components/ui/3d-badge";
import { Card3D } from "@/components/ui/3d-card";
import { StatsCard3D } from "@/components/ui/3d-stats-card";
import { cn } from "@/lib/utils";

export default function ProductDetailPage() {
  const [location, setLocation] = useLocation();
  const productId = location.split("/").pop() || "";
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);

  // Get product details
  const { data: product, isLoading } = useQuery({
    queryKey: ['/api/products', productId],
    queryFn: async () => {
      try {
        console.log("Fetching product details for ID:", productId);
        
        // First check if product exists in localStorage
        try {
          const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
          const localProduct = storedProducts.find((p: any) => p.id?.toString() === productId);
          
          if (localProduct) {
            console.log("Found product in localStorage:", localProduct);
            // Add Icon property
            import("../schema").then(({ getIconComponent }) => {
              localProduct.Icon = getIconComponent(localProduct.iconName || "Zap");
            });
            return localProduct;
          }
        } catch (e) {
          console.error("Error checking localStorage:", e);
        }
        
        // Fallback to API if not found in localStorage
        const response = await fetch('/api/products');
        const products = await response.json() as Product[];
        const foundProduct = products.find(p => p.id?.toString() === productId);
        console.log("Product from API:", foundProduct);
        return foundProduct || null;
      } catch (error) {
        console.error("Error fetching product details:", error);
        return null;
      }
    },
    enabled: !!productId
  });

  // Placeholder images for the product gallery (in a real app, these would come from the API)
  const dummyImages = [
    "https://plus.unsplash.com/premium_photo-1681319553238-9860299dfb0f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1621570074963-d72d3e4e56d5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1642427749670-f20e2e76ed8c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  ];

  // Color schemes based on product category
  const getCategoryColors = (category?: string) => {
    switch(category) {
      case 'Templates':
        return {
          primary: '#7c3aed',
          secondary: '#6d28d9',
          accent: 'text-violet-400',
          bg: 'bg-violet-500/10',
          border: 'border-violet-500/20',
          glow: 'rgba(124, 58, 237, 0.3)',
          gradient: 'from-violet-600 to-indigo-700'
        };
      case 'E-books':
        return {
          primary: '#3b82f6',
          secondary: '#0ea5e9',
          accent: 'text-blue-400',
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/20',
          glow: 'rgba(59, 130, 246, 0.3)',
          gradient: 'from-blue-600 to-cyan-700'
        };
      case 'Courses':
        return {
          primary: '#f59e0b',
          secondary: '#ea580c',
          accent: 'text-amber-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/20',
          glow: 'rgba(245, 158, 11, 0.3)',
          gradient: 'from-amber-500 to-orange-600'
        };
      case 'Graphics':
        return {
          primary: '#ec4899',
          secondary: '#be123c',
          accent: 'text-pink-400',
          bg: 'bg-pink-500/10',
          border: 'border-pink-500/20',
          glow: 'rgba(236, 72, 153, 0.3)',
          gradient: 'from-pink-600 to-rose-700'
        };
      case 'SoftDev':
        return {
          primary: '#10b981',
          secondary: '#059669',
          accent: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/20',
          glow: 'rgba(16, 185, 129, 0.3)',
          gradient: 'from-emerald-600 to-teal-700'
        };
      default:
        return {
          primary: '#8b5cf6',
          secondary: '#6d28d9',
          accent: 'text-purple-400',
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/20',
          glow: 'rgba(139, 92, 246, 0.3)',
          gradient: 'from-purple-600 to-indigo-700'
        };
    }
  };

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-32 h-32 border-t-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const colors = getCategoryColors(product?.category);
  const productImage = product.coverImage || product.imageUrl || "";
  const images = [
    productImage, 
    ...dummyImages.slice(0, 4)
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-gray-950 to-black text-white">
      {/* Premium 3D background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <div 
          className="absolute top-[10%] left-[10%] w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{
            background: `radial-gradient(circle, ${colors.primary}, transparent 70%)`,
            animation: "float 15s ease-in-out infinite"
          }}
        />
        <div 
          className="absolute bottom-[10%] right-[10%] w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{
            background: `radial-gradient(circle, ${colors.secondary}, transparent 70%)`,
            animation: "float 20s ease-in-out infinite reverse"
          }}
        />
        
        {/* Grid overlay for depth */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), 
                             linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Back button with animation */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <button 
            onClick={() => setLocation('/explore')}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Explore</span>
          </button>
        </motion.div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left column - Product images */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Main image with 3D effect */}
            <Card3D className="aspect-[4/3] rounded-3xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full"
                >
                  <div 
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
                  />
                </motion.div>
              </AnimatePresence>
              
              {/* Navigation controls */}
              <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2 z-20">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all duration-300",
                      index === currentImageIndex 
                        ? `w-10 bg-gradient-to-r ${colors.gradient}` 
                        : 'bg-white/30'
                    )}
                  />
                ))}
              </div>
            </Card3D>

            {/* Thumbnail gallery with 3D hover */}
            <div className="grid grid-cols-5 gap-4">
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    "aspect-square cursor-pointer rounded-xl overflow-hidden border-2",
                    index === currentImageIndex 
                      ? `border-2 border-${colors.gradient.split(' ')[0].replace('from-', '')}` 
                      : "border-transparent"
                  )}
                >
                  <div 
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${image})` }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right column - Product details */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Category badge and share/like buttons */}
            <div className="flex items-center justify-between">
              <Badge3D 
                label={product.category || "Digital Product"}
                icon={Award}
                color={colors.primary}
                glowColor={colors.glow}
              />
              
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                  onClick={() => navigator.share?.({
                    title: product.name,
                    text: product.description,
                    url: window.location.href
                  })}
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    "p-3 rounded-full transition-colors",
                    liked 
                      ? "bg-red-500/20 text-red-400 border border-red-500/30" 
                      : "bg-white/5 border border-white/10 hover:bg-white/10"
                  )}
                  onClick={() => setLiked(!liked)}
                >
                  <Heart className={cn("w-5 h-5", liked && "fill-red-400")} />
                </motion.button>
              </div>
            </div>
            
            {/* Product title with dynamic text gradient */}
            <div>
              <h1 
                className="text-4xl lg:text-5xl font-bold mb-2"
                style={{
                  background: `linear-gradient(to right, white, ${colors.primary})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {product.name}
              </h1>
              
              {/* Creator info with 3D avatar */}
              <div className="flex items-center gap-3 mt-4">
                <Avatar3D 
                  letter={product.author?.name?.[0] || "C"}
                  verified={true}
                  size="md"
                />
                <div>
                  <p className="text-gray-400 text-sm">Created by</p>
                  <p className="font-medium">{product.author?.name || "Anonymous"}</p>
                </div>
              </div>
            </div>
            
            {/* Product stats cards with 3D effect */}
            <div className="grid grid-cols-3 gap-4">
              <StatsCard3D
                title="Rating"
                value={product.rating?.toFixed(1) || "4.9"}
                icon={<Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />}
                color="#f59e0b"
              />
              
              <StatsCard3D
                title="Sales"
                value={product.sales?.toString() || "1,275+"}
                icon={<ShoppingCart className="w-5 h-5" />}
                color={colors.primary}
              />
              
              <StatsCard3D
                title="Premium"
                value="Verified"
                icon={<Check className="w-5 h-5" />}
                color="#10b981"
              />
            </div>
            
            {/* Product description in a 3D card */}
            <Card3D className="p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-3">About this product</h3>
              <p className="text-gray-300 leading-relaxed">
                {product.description}
              </p>
              <p className="text-gray-300 leading-relaxed mt-3">
                This premium digital product offers exceptional quality and innovative features that help you achieve professional results. 
                Created by industry experts with meticulous attention to detail.
              </p>
            </Card3D>
            
            {/* Features list with animated items */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Key Features</h3>
              <ul className="space-y-3">
                {[
                  "Premium quality assets with lifetime updates",
                  "Compatible with all major software and platforms",
                  "Detailed documentation and premium support",
                  "Commercial license for unlimited projects",
                  "Regular updates and improvements"
                ].map((feature, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r ${colors.gradient} flex items-center justify-center`}>
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-200">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            {/* Pricing and purchase section with 3D button */}
            <Card3D className="p-6 rounded-2xl bg-black/40 backdrop-blur-sm">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Price:</p>
                  <div className="flex items-center gap-3">
                    <motion.p 
                      className="text-4xl font-bold"
                      animate={{ y: [0, -3, 0] }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      <span style={{
                        background: `linear-gradient(to right, white, ${colors.primary})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                        ${product.price || "59.99"}
                      </span>
                    </motion.p>
                    {(product.price || 0) > 30 && (
                      <p className="text-gray-500 line-through">${((product.price || 59.99) * 1.25).toFixed(2)}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-green-400">Secure Purchase</span>
                </div>
              </div>
              
              {/* Purchase buttons */}
              <div className="space-y-4">
                <motion.button
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: `0 20px 30px -10px ${colors.glow}`
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="relative w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 overflow-hidden"
                  style={{
                    background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`
                  }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Buy Now • ${product.price || "59.99"}</span>
                  
                  {/* Shine effect */}
                  <div 
                    className="absolute inset-0 opacity-30 shine-animation"
                    style={{
                      background: "linear-gradient(105deg, transparent 20%, rgba(255, 255, 255, 0.4) 50%, transparent 80%)",
                      backgroundSize: "200% 200%"
                    }}
                  />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-xl font-semibold border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center gap-2"
                >
                  <DollarSign className="w-5 h-5" />
                  <span>License Information</span>
                </motion.button>
              </div>
              
              {/* Extra info */}
              <div className="mt-6 text-sm text-gray-400 flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span>Instant digital delivery • Lifetime access</span>
              </div>
            </Card3D>
          </motion.div>
        </div>
        
        {/* More products section */}
        <div className="mt-24">
          <h2 className="text-2xl font-bold mb-8">Related Products</h2>
          
          {/* This would show other products in a real app */}
          <div className="opacity-50 flex justify-center items-center py-12 text-gray-500 border border-dashed border-gray-800 rounded-xl">
            Related products would appear here
          </div>
        </div>
      </div>
    </div>
  );
}