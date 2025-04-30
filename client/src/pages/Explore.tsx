import { motion, useAnimation, useTransform, useScroll, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Product } from "../schema";
import { useQuery } from "@tanstack/react-query";
import { getIconComponent } from "../schema";
import { ProductCard } from "../components/ui/product-card";
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Star, 
  Award, 
  Cpu, 
  Box, 
  Code, 
  MessageSquare, 
  DollarSign, 
  Tag, 
  Check, 
  Rocket, 
  Sparkles,
  Zap,
  Layers,
  Grid3X3,
  ShoppingCart,
  Heart
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Label } from "../components/ui/label";
import { Slider } from "../components/ui/slider";
import { Avatar3D } from "../components/ui/3d-avatar";
import { Card3D } from "../components/ui/3d-card";
import { Badge3D } from "../components/ui/3d-badge";
import { StatsCard3D } from "../components/ui/3d-stats-card";
import BottomNav from "../components/BottomNav";

// Dynamic 3D category card
const Category3DCard = ({ 
  icon, 
  name, 
  count, 
  color = "#BB86FC",
  isActive = false 
}: { 
  icon: React.ReactNode; 
  name: string; 
  count: number;
  color?: string;
  isActive?: boolean;
}) => {
  return (
    <motion.div
      whileHover={{ 
        y: -10,
        rotate: [-0.5, 0.5],
        transition: { rotate: { repeat: Infinity, repeatType: "mirror", duration: 0.3 } }
      }}
      className={cn(
        "relative rounded-xl overflow-hidden p-5 cursor-pointer transition-all", 
        "bg-gradient-to-br from-gray-900 to-gray-800",
        isActive ? "ring-2 ring-offset-2 ring-offset-gray-900 ring-[" + color + "]" : "hover:ring-1 hover:ring-[" + color + "]/50"
      )}
      style={{
        boxShadow: isActive ? `0 0 20px ${color}30` : "0 10px 30px rgba(0,0,0,0.2)",
      }}
    >
      <div className="relative z-10">
        <div 
          className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
          style={{ 
            background: `linear-gradient(135deg, ${color}40, ${color}20)`,
            boxShadow: `0 4px 12px ${color}30`
          }}
        >
          {icon}
        </div>
        <h3 className="text-white font-medium text-lg">{name}</h3>
        <div className="flex items-center gap-1 text-gray-400 mt-2 text-sm">
          <span>{count}</span>
          <span>products</span>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#101010] opacity-50 blur-3xl -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full" style={{ background: `${color}10`, filter: 'blur(30px)' }}></div>
    </motion.div>
  );
};

// Featured creator card with 3D effects
const CreatorCard = ({ 
  name, 
  avatar, 
  isVerified, 
  followers, 
  products 
}: { 
  name: string; 
  avatar: string; 
  isVerified: boolean; 
  followers: number; 
  products: number;
}) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.05,
        rotate: [0, -1, 0, 1, 0],
        transition: { rotate: { duration: 0.5 } }
      }}
      className="bg-gradient-to-br from-[#111] to-[#1A1A1A] p-5 rounded-xl border border-white/5 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-32 opacity-10 bg-gradient-to-r from-purple-500 via-transparent to-blue-500"></div>
      
      <div className="flex flex-col items-center relative z-10">
        <Avatar3D letter={name[0]} size="xl" verified={isVerified} />
        
        <div className="mt-4 text-center">
          <h3 className="text-white font-semibold text-lg flex items-center justify-center gap-1">
            {name}
            {isVerified && (
              <Check className="w-4 h-4 text-teal-500 bg-teal-500/10 rounded-full p-0.5" />
            )}
          </h3>
          
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="text-center">
              <div className="text-white font-medium">{followers}</div>
              <div className="text-gray-500 text-xs">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-white font-medium">{products}</div>
              <div className="text-gray-500 text-xs">Products</div>
            </div>
          </div>
          
          <Button className="mt-4 w-full bg-white/5 hover:bg-white/10 text-white border-none rounded-full text-sm">
            View Profile
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// Ultra premium 3D product card with advanced effects
const FeaturedProductCard = ({ 
  product, 
  index 
}: { 
  product: Product; 
  index: number;
}) => {
  // Dynamic colors based on index for variety
  const colors = [
    { primary: "#BB86FC", secondary: "#4A0072", accent: "#3700B3" },
    { primary: "#03DAC6", secondary: "#018786", accent: "#00B3A6" },
    { primary: "#6200EE", secondary: "#3700B3", accent: "#5600E8" },
    { primary: "#FF4D4D", secondary: "#CF2929", accent: "#FF0000" },
    { primary: "#00CFFF", secondary: "#0099CC", accent: "#0088FF" },
  ];
  
  const colorSet = colors[index % colors.length];
  
  // Realistic prices based on category and index
  const premiumPrice = product.price || (39.99 + (index * 10));
  
  // Calculate rating with visual feedback
  const rating = Math.min(5, 4.2 + (index % 3 === 0 ? 0.8 : index % 2 === 0 ? 0.4 : 0));
  const ratingValue = rating.toFixed(1);
  
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -15,
        rotateY: 5,
        rotateX: 3,
        scale: 1.03,
        transition: { duration: 0.2 }
      }}
      className="relative group cursor-pointer"
    >
      {/* Premium outer glow */}
      <div 
        className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
        style={{ 
          background: `linear-gradient(45deg, ${colorSet.primary}50, transparent, ${colorSet.secondary}50)`,
          zIndex: 0
        }}
      ></div>
      
      {/* Card body */}
      <div 
        className="relative rounded-2xl overflow-hidden z-10 bg-gradient-to-br from-[#191919] to-[#0c0c0c]"
        style={{
          boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 1px 1px rgba(255,255,255,0.05), 0 -1px 1px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.07)`
        }}
      >
        {/* Glass reflection effect */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-30"></div>
        
        {/* Header image with 3D depth and parallax effect */}
        <div className="h-52 md:h-56 w-full relative overflow-hidden">
          {/* Animated background particles */}
          <div className="absolute inset-0 z-5 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-1 h-1 rounded-full bg-white animate-pulse"></div>
            <div className="absolute top-3/4 left-2/3 w-2 h-2 rounded-full bg-white animate-ping" style={{ animationDuration: '3s' }}></div>
            <div className="absolute top-1/2 left-1/3 w-1 h-1 rounded-full bg-white animate-ping" style={{ animationDuration: '5s' }}></div>
            <div className="absolute top-1/3 left-3/4 w-2 h-2 rounded-full bg-white animate-pulse" style={{ animationDuration: '2.5s' }}></div>
          </div>
          
          {/* Actual image with enhanced effects */}
          <motion.div 
            className="absolute inset-0 z-10"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              backgroundImage: product.coverImage || product.imageUrl 
                ? `url(${product.coverImage || product.imageUrl})` 
                : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'contrast(1.1) saturate(1.2)'
            }}
          >
            {/* Fallback gradient and icon if no image */}
            {!product.coverImage && !product.imageUrl && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Animated glow ring */}
                  <div 
                    className="absolute inset-0 rounded-full animate-ping opacity-20" 
                    style={{ 
                      background: `radial-gradient(circle, ${colorSet.primary}, transparent 70%)`,
                      animationDuration: '3s'
                    }}
                  ></div>
                  
                  {/* Outer gradient ring */}
                  <div 
                    className="absolute -inset-3 rounded-full"
                    style={{ 
                      background: `radial-gradient(circle, ${colorSet.primary}30, transparent 70%)`,
                      filter: 'blur(10px)'
                    }}
                  ></div>
                  
                  {/* Icon container */}
                  <div 
                    className="relative rounded-full p-8 backdrop-blur-md"
                    style={{ 
                      background: `linear-gradient(135deg, ${colorSet.primary}20, ${colorSet.secondary}10)`,
                      boxShadow: `0 10px 30px ${colorSet.primary}30, inset 0 0 0 1px ${colorSet.primary}40`
                    }}
                  >
                    <product.Icon className="w-14 h-14" style={{ color: colorSet.primary }} />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
          
          {/* Premium vignette and depth effects */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent z-20 opacity-90"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent z-20 opacity-40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 z-20 opacity-30"></div>
          
          {/* Premium highlight edge */}
          <div 
            className="absolute top-0 left-0 right-0 h-1 z-30 opacity-80"
            style={{ background: `linear-gradient(90deg, transparent, ${colorSet.primary}60, transparent)` }}
          ></div>
          
          {/* Badges */}
          <div className="absolute top-4 left-4 z-30 flex flex-col gap-2">
            {/* Premium badge */}
            {index % 3 === 0 && (
              <Badge3D 
                label="Premium" 
                icon={Sparkles} 
                color={colorSet.primary}
                glowColor={colorSet.primary}
              />
            )}
            
            {/* Bestseller badge */}
            {index % 5 === 0 && (
              <Badge3D 
                label="Bestseller" 
                icon={Award} 
                color="#FFD700"
                glowColor="#FFD700"
              />
            )}
          </div>
          
          {/* Hot/New labels */}
          {(index % 4 === 0 || product.price && product.price > 50) && (
            <div className="absolute top-4 right-4 z-30">
              <Badge3D 
                label={index % 2 === 0 ? "Hot 🔥" : "New ✨"} 
                icon={index % 2 === 0 ? Zap : Sparkles} 
                color={index % 2 === 0 ? "#FF4D4D" : "#00CFFF"}
                glowColor={index % 2 === 0 ? "#FF4D4D" : "#00CFFF"}
              />
            </div>
          )}
          
          {/* Sale tag if applicable */}
          {index % 6 === 0 && (
            <div className="absolute bottom-4 right-4 z-30">
              <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                <span>SAVE 40%</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Content with 3D layered effect */}
        <div className="p-6 relative z-20">
          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
            <div className="absolute top-1/4 left-1/3 w-1 h-1 rounded-full bg-white animate-pulse" style={{ animationDuration: '4s' }}></div>
            <div className="absolute top-3/4 left-1/2 w-1 h-1 rounded-full bg-white animate-ping" style={{ animationDuration: '6s' }}></div>
          </div>
          
          {/* Category with visual embellishment */}
          <div className="flex items-center gap-2 mb-3">
            <div 
              className="px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1.5"
              style={{
                background: `${colorSet.primary}20`,
                color: colorSet.primary,
                border: `1px solid ${colorSet.primary}40`,
                boxShadow: `0 2px 6px ${colorSet.primary}20`
              }}
            >
              {product.category === "ai_tools" ? <Cpu className="w-3.5 h-3.5" /> : 
               product.category === "templates" ? <Layers className="w-3.5 h-3.5" /> :
               product.category === "graphics" ? <Box className="w-3.5 h-3.5" /> :
               product.category === "Software" ? <Code className="w-3.5 h-3.5" /> :
               <Tag className="w-3.5 h-3.5" />}
              <span>{product.category || "Digital Product"}</span>
            </div>
            
            {/* Verified badge with premium styling */}
            {index % 2 === 0 && (
              <motion.div 
                className="px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1.5"
                initial={{ opacity: 0.8 }}
                whileHover={{ 
                  opacity: 1,
                  scale: 1.05,
                  boxShadow: `0 0 10px ${colorSet.accent}40`,
                  transition: { duration: 0.2 }
                }}
                style={{
                  background: `rgba(13, 153, 255, 0.15)`,
                  color: `#0D99FF`,
                  border: `1px solid rgba(13, 153, 255, 0.3)`,
                  boxShadow: `0 2px 5px rgba(13, 153, 255, 0.2)`
                }}
              >
                <Check className="w-3 h-3" /> Verified
              </motion.div>
            )}
          </div>
          
          {/* Title with premium styling and hover effect */}
          <motion.h3 
            className="text-xl font-bold mb-2"
            style={{
              background: `linear-gradient(90deg, #fff, ${colorSet.primary}80)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: `0 2px 10px ${colorSet.primary}30`
            }}
            whileHover={{ 
              scale: 1.01,
              textShadow: `0 2px 15px ${colorSet.primary}50`,
              transition: { duration: 0.2 }
            }}
          >
            {product.name}
          </motion.h3>
          
          {/* Description with improved styling */}
          <p className="mb-4 text-sm line-clamp-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {product.description}
          </p>
          
          {/* Creator info with enhanced visuals */}
          <div className="flex items-center gap-2 mb-4">
            <Avatar3D letter={product.author?.name?.[0] || "C"} size="sm" verified={index % 2 === 0} />
            <div className="flex flex-col">
              <span className="text-sm text-white">
                by <span className="font-medium" style={{ color: colorSet.primary }}>
                  {product.author?.name || "Creator"}
                </span>
              </span>
              <span className="text-xs text-gray-400">
                {index % 2 === 0 ? "Top Seller" : "Featured Creator"}
              </span>
            </div>
          </div>
          
          {/* Divider with gradient */}
          <div 
            className="h-px w-full my-4 opacity-30"
            style={{ 
              background: `linear-gradient(90deg, transparent, ${colorSet.primary}80, transparent)` 
            }}
          ></div>
          
          {/* Stats row with enhanced styling */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {/* Rating */}
            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/5">
              <div className="flex items-center gap-0.5 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3 h-3 ${
                      i < Math.floor(rating) 
                        ? "text-yellow-400 fill-yellow-400" 
                        : i < rating 
                          ? "text-yellow-400 fill-yellow-400 opacity-50" 
                          : "text-gray-600"
                    }`} 
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400">{ratingValue}</span>
            </div>
            
            {/* Downloads/Sales */}
            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/5">
              <div className="text-sm font-medium text-white">
                {product.sales || (100 + (index * 28))}
              </div>
              <span className="text-xs text-gray-400">Sales</span>
            </div>
            
            {/* Reviews */}
            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/5">
              <div className="text-sm font-medium text-white">
                {product.reviews || (12 + (index * 5))}
              </div>
              <span className="text-xs text-gray-400">Reviews</span>
            </div>
          </div>
          
          {/* Price and action section */}
          <div className="flex items-center justify-between mt-2">
            {/* Price with premium display */}
            <div>
              {index % 6 === 0 && (
                <div className="text-sm text-gray-400 line-through mb-0.5">
                  ${(premiumPrice * 1.4).toFixed(2)}
                </div>
              )}
              <div className="flex items-baseline">
                <span 
                  className="text-2xl font-bold mr-1"
                  style={{ 
                    color: index % 6 === 0 ? '#FF4D4D' : 'white',
                    textShadow: index % 6 === 0 ? '0 0 10px rgba(255,77,77,0.5)' : 'none' 
                  }}
                >
                  ${premiumPrice.toFixed(2)}
                </span>
                <span className="text-xs text-gray-400 font-medium">USD</span>
              </div>
            </div>
            
            {/* Ultra premium 3D button with animations */}
            <motion.button
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium"
              style={{
                background: `linear-gradient(135deg, ${colorSet.primary}, ${colorSet.secondary})`,
                boxShadow: `0 5px 15px ${colorSet.primary}40, inset 0 1px 1px rgba(255,255,255,0.3)`
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: `0 8px 25px ${colorSet.primary}60, inset 0 1px 1px rgba(255,255,255,0.5)`,
              }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </motion.button>
          </div>
          
          {/* View details button that appears on hover */}
          <motion.div 
            className="absolute left-0 right-0 -bottom-12 flex justify-center z-30"
            initial={{ opacity: 0, y: -20 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.button
              className="px-6 py-2.5 rounded-full backdrop-blur-md text-sm font-medium border"
              style={{
                background: `rgba(0,0,0,0.7)`,
                borderColor: `${colorSet.primary}50`,
                color: colorSet.primary,
                boxShadow: `0 10px 25px rgba(0,0,0,0.5), 0 0 0 1px ${colorSet.primary}30`
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: `0 15px 30px rgba(0,0,0,0.6), 0 0 0 1px ${colorSet.primary}50, 0 0 20px ${colorSet.primary}30`,
              }}
              whileTap={{ scale: 0.98 }}
            >
              View Details
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Explore() {
  // Framer motion animations
  const controls = useAnimation();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [view3D, setView3D] = useState(true);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const bannerYPos = useTransform(
    scrollY, 
    [0, 300], 
    [0, -30]
  );
  
  const bannerScale = useTransform(
    scrollY, 
    [0, 300], 
    [1, 0.9]
  );
  
  const bannerOpacity = useTransform(
    scrollY, 
    [0, 300], 
    [1, 0.8]
  );
  
  // Scroll handler for sticky header effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  
  // Fetch products from API
  const { data: apiProducts, isLoading } = useQuery({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    }
  });
  
  // Get products from localStorage that were added by the user
  useEffect(() => {
    try {
      const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
      // Transform stored products to match Product interface
      const formattedProducts = storedProducts.map((product: any) => ({
        ...product,
        Icon: getIconComponent(product.iconName)
      }));
      setLocalProducts(formattedProducts);
    } catch (error) {
      console.error('Error loading products from localStorage:', error);
    }
  }, []);
  
  // Combine API products and localStorage products
  const allProducts = [...(apiProducts || []), ...localProducts];
  
  // Filter products based on active filters
  const filteredProducts = allProducts.filter(product => {
    // Search query filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !product.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (activeCategory !== 'All' && product.category !== activeCategory) {
      return false;
    }
    
    // Price range filter
    if (product.price && (product.price < priceRange[0] || product.price > priceRange[1])) {
      return false;
    }
    
    // Premium only filter (using a simple heuristic for demo)
    if (showPremiumOnly && !(product.price && product.price > 49.99)) {
      return false;
    }
    
    return true;
  });
  
  // Sort products based on active tab
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (activeTab === 'trending') {
      // Sort by recent and price
      return (b.price || 0) - (a.price || 0);
    } else if (activeTab === 'newest') {
      // Sort by most recent
      return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
    } else if (activeTab === 'popular') {
      // Sort by most reviews (or a random property for the demo)
      return (b.reviews || 0) - (a.reviews || 0);
    } else if (activeTab === 'for-you') {
      // Personalized sorting - here just using a predictable shuffle for demo
      return (a.id || 0) % 2 === 0 ? 1 : -1;
    }
    return 0;
  });
  
  // Artificial categories with counts
  const categories = [
    { name: 'All', count: allProducts.length, icon: <Grid3X3 className="text-white" />, color: '#BB86FC' },
    { name: 'ai_tools', count: allProducts.filter(p => p.category === 'ai_tools').length || 3, icon: <Cpu className="text-blue-400" />, color: '#6366F1' },
    { name: 'templates', count: 12, icon: <Layers className="text-cyan-400" />, color: '#00CFFF' },
    { name: 'graphics', count: 8, icon: <Box className="text-teal-400" />, color: '#10B981' },
    { name: 'Software', count: 14, icon: <Code className="text-amber-400" />, color: '#F59E0B' },
    { name: 'Digital Assets', count: 6, icon: <Tag className="text-red-400" />, color: '#EF4444' },
  ];
  
  // Artificial creators
  const creators = [
    { name: 'Alex Chen', followers: 1258, products: 12, isVerified: true, avatar: '' },
    { name: 'Maria Rodriguez', followers: 864, products: 8, isVerified: true, avatar: '' },
    { name: 'David Kim', followers: 2145, products: 17, isVerified: true, avatar: '' },
    { name: 'Sarah Johnson', followers: 932, products: 5, isVerified: false, avatar: '' },
  ];
  
  // Statistics data
  const statsData = [
    { title: 'Digital Products', value: allProducts.length + 280, icon: <Layers className="w-5 h-5" /> },
    { title: 'Creators', value: '2.5K+', icon: <MessageSquare className="w-5 h-5" /> },
    { title: 'AI-Powered Tools', value: '400+', icon: <Cpu className="w-5 h-5" /> },
  ];
  
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* 3D background effects */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_70%)]"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,#1A1A2E_0%,#000_70%)]"></div>
      
      {/* Floating orbs */}
      <div className="absolute top-60 left-20 w-72 h-72 rounded-full bg-purple-500/5 blur-3xl animate-pulse"></div>
      <div className="absolute top-1/3 right-10 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-40 left-1/4 w-80 h-80 rounded-full bg-teal-500/5 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Sticky glassmorphic header */}
      <header 
        className={cn(
          "fixed w-full top-0 z-50 transition-all duration-300 ease-in-out",
          scrolled 
            ? "py-2 bg-black/70 backdrop-blur-lg border-b border-white/10" 
            : "py-4 bg-transparent"
        )}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo and nav */}
          <div className="flex items-center space-x-8">
            <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              3D Marketplace
            </div>
            
            <nav className="hidden md:flex space-x-6">
              {["Explore", "Top Products", "Categories", "AI Deals"].map((item, index) => (
                <motion.a 
                  key={item}
                  href="#"
                  className={cn(
                    "text-sm font-medium transition-colors relative",
                    index === 0 ? "text-white" : "text-gray-400 hover:text-white"
                  )}
                  whileHover={{ scale: 1.05 }}
                >
                  {item}
                  {index === 0 && (
                    <motion.div 
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
                      layoutId="active-nav-indicator"
                    />
                  )}
                </motion.a>
              ))}
            </nav>
          </div>
          
          {/* Search and user */}
          <div className="flex items-center space-x-4">
            <div className="relative w-full max-w-xs hidden md:block">
              <Input 
                type="text" 
                placeholder="Search products..." 
                className="rounded-full bg-white/5 border-white/10 focus:border-purple-500 pl-10 pr-4 py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center cursor-pointer shadow-lg"
            >
              <Avatar3D letter="U" verified={true} size="sm" />
            </motion.div>
          </div>
        </div>
      </header>
      
      <main className="relative z-10 pt-28 pb-24">
        {/* Ultra Premium Hero Banner with advanced 3D effects */}
        <motion.section 
          ref={heroRef}
          className="relative mb-12 overflow-hidden"
          style={{
            y: bannerYPos,
            scale: bannerScale,
            opacity: bannerOpacity
          }}
        >
          {/* Background geometric elements */}
          <div className="absolute inset-0 z-0">
            {/* Floating animated particles */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white opacity-30"
                style={{
                  width: Math.random() * 6 + 2 + 'px',
                  height: Math.random() * 6 + 2 + 'px',
                  top: Math.random() * 100 + '%',
                  left: Math.random() * 100 + '%',
                  filter: 'blur(1px)'
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{
                  duration: 3 + Math.random() * 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: Math.random() * 2
                }}
              />
            ))}
            
            {/* Radial background with color layers */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1A1A2E_0%,#000_70%)] opacity-90"></div>
            
            {/* Colorful gradient orbs */}
            <motion.div 
              className="absolute top-10 -left-20 w-96 h-96 rounded-full opacity-40"
              style={{ 
                background: "radial-gradient(circle, rgba(137, 61, 255, 0.6) 0%, rgba(137, 61, 255, 0) 70%)",
                filter: "blur(60px)"
              }}
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 20, 0],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            ></motion.div>
            
            <motion.div 
              className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-30"
              style={{ 
                background: "radial-gradient(circle, rgba(0, 207, 255, 0.6) 0%, rgba(0, 207, 255, 0) 70%)",
                filter: "blur(60px)"
              }}
              animate={{
                scale: [1, 1.1, 1],
                x: [0, -20, 0],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 2
              }}
            ></motion.div>
            
            {/* Grid lines for depth */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }}
            ></div>
          </div>
          
          {/* Content container */}
          <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
            <motion.div 
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Premium floating text badge */}
              <motion.div
                className="inline-block mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="px-4 py-1.5 rounded-full backdrop-blur-md inline-flex items-center gap-2 border border-purple-500/30 bg-purple-500/10">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                    Explore All Digital Products
                  </span>
                </div>
              </motion.div>
              
              {/* Ultra premium main title with animated gradient */}
              <div className="relative">
                {/* Text shadow clone for glow effect */}
                <motion.h1 
                  className="absolute inset-0 text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-transparent opacity-50 blur-sm"
                  style={{
                    WebkitTextStroke: '1px rgba(255,255,255,0.1)',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  Next-Gen Digital Marketplace
                </motion.h1>
                
                {/* Primary title with animated gradient */}
                <motion.h1 
                  className="relative text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-400 to-blue-500"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    textShadow: [
                      "0 0 8px rgba(135, 61, 255, 0.4)", 
                      "0 0 16px rgba(135, 61, 255, 0.6)", 
                      "0 0 8px rgba(135, 61, 255, 0.4)"
                    ]
                  }}
                  transition={{ 
                    opacity: { duration: 0.6 },
                    y: { duration: 0.6 },
                    textShadow: { 
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }
                  }}
                >
                  Next-Gen Digital Marketplace
                </motion.h1>
              </div>
              
              {/* Animated description with typing effect */}
              <motion.div
                className="h-16 md:h-10 overflow-hidden mb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <motion.p 
                  className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                >
                  Discover premium AI tools, templates, and digital assets from top creators.
                </motion.p>
              </motion.div>
              
              {/* Interactive 3D buttons */}
              <motion.div
                className="flex flex-wrap justify-center gap-4 mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                {/* Primary action button */}
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 40px rgba(137, 61, 255, 0.5)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full px-10 py-6 text-lg font-medium"
                    onClick={() => {
                      // Scroll to products section
                      document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {/* Animated particles inside button */}
                    <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 rounded-full bg-white"
                          style={{
                            top: Math.random() * 100 + '%',
                            left: Math.random() * 100 + '%',
                          }}
                          animate={{
                            y: [0, -20, 0],
                            opacity: [0, 1, 0]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: Math.random()
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* Button shine effect */}
                    <motion.div 
                      className="absolute inset-0 opacity-0"
                      animate={{
                        background: [
                          "linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.2) 50%, transparent 75%)",
                          "linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.2) 50%, transparent 75%)"
                        ],
                        backgroundSize: ["200% 200%", "200% 200%"],
                        backgroundPosition: ["-200% -200%", "200% 200%"],
                        opacity: [0.3, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 5
                      }}
                    />
                    
                    <Sparkles className="mr-2 h-5 w-5" />
                    <span className="relative z-10">Explore Products</span>
                  </Button>
                </motion.div>
                
                {/* Secondary action button */}
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 25px rgba(255,255,255,0.15)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    className="relative overflow-hidden backdrop-blur-lg bg-white/10 hover:bg-white/15 text-white rounded-full px-10 py-6 text-lg font-medium border border-white/10"
                    onClick={() => setView3D(!view3D)}
                  >
                    {/* Animated glass reflection */}
                    <motion.div 
                      className="absolute inset-0 opacity-0"
                      animate={{
                        background: [
                          "linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 25%, transparent 50%)",
                          "linear-gradient(45deg, transparent 50%, rgba(255,255,255,0.1) 75%, transparent 100%)"
                        ],
                        backgroundSize: ["200% 200%", "200% 200%"],
                        backgroundPosition: ["-100% -100%", "200% 200%"],
                        opacity: [0.5, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                    />
                    
                    <Layers className="mr-2 h-5 w-5" />
                    <span className="relative z-10">{view3D ? "2D View" : "3D View"}</span>
                  </Button>
                </motion.div>
              </motion.div>
              
              {/* Premium stats cards with 3D effect and staggered animation */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {statsData.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 100,
                      damping: 12,
                      delay: 1.3 + (index * 0.15)
                    }}
                    whileHover={{ 
                      y: -10,
                      transition: { type: "spring", stiffness: 300 }
                    }}
                  >
                    <StatsCard3D 
                      title={stat.title}
                      value={stat.value.toString()}
                      icon={stat.icon}
                      color={index === 0 ? "#BB86FC" : index === 1 ? "#00CFFF" : "#10B981"}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Interactive 3D geometric shapes floating in background */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            {[...Array(5)].map((_, i) => {
              const size = 100 + Math.random() * 150;
              const xPos = Math.random() * 100;
              const yPos = Math.random() * 100;
              const delay = Math.random() * 2;
              
              return (
                <motion.div
                  key={i}
                  className="absolute opacity-5"
                  style={{
                    width: size + 'px',
                    height: size + 'px',
                    top: yPos + '%',
                    left: xPos + '%',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: i % 2 === 0 ? '30%' : '0%',
                    transform: `rotate(${Math.random() * 360}deg)`
                  }}
                  animate={{
                    rotate: 360,
                    opacity: [0.03, 0.06, 0.03],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    rotate: { 
                      duration: 20 + (i * 5), 
                      repeat: Infinity, 
                      ease: "linear" 
                    },
                    opacity: { 
                      duration: 5 + (i * 2), 
                      repeat: Infinity, 
                      repeatType: "reverse",
                      delay
                    },
                    scale: { 
                      duration: 8 + (i * 3), 
                      repeat: Infinity, 
                      repeatType: "reverse",
                      delay
                    }
                  }}
                />
              );
            })}
          </div>
        </motion.section>
        
        {/* 3D Filters and Categories Section */}
        <section className="container mx-auto px-4 py-8 mb-12">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters sidebar */}
            <div className="w-full lg:w-64 space-y-6">
              <Card3D className="p-5 space-y-5">
                <h3 className="text-lg font-semibold flex items-center">
                  <Filter className="w-5 h-5 mr-2 text-purple-500" />
                  Smart Filters
                </h3>
                
                <div className="space-y-4">
                  {/* Price range */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label className="text-sm text-gray-400">Price Range</Label>
                      <span className="text-sm text-white">${priceRange[0]} - ${priceRange[1]}</span>
                    </div>
                    <Slider 
                      defaultValue={[0, 1000]} 
                      max={1000} 
                      step={10}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="py-2"
                    />
                  </div>
                  
                  {/* Premium filter */}
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-gray-400 cursor-pointer" htmlFor="premium-only">
                      Premium Products Only
                    </Label>
                    <Switch 
                      id="premium-only" 
                      checked={showPremiumOnly}
                      onCheckedChange={setShowPremiumOnly}
                    />
                  </div>
                  
                  {/* Divider */}
                  <div className="h-px w-full bg-white/10 my-4"></div>
                  
                  {/* Tab filters */}
                  <div className="space-y-3">
                    <Label className="text-sm text-gray-400">Sort By</Label>
                    <Tabs 
                      value={activeTab} 
                      onValueChange={setActiveTab}
                      className="w-full"
                    >
                      <TabsList className="grid grid-cols-2 gap-2 bg-transparent">
                        <TabsTrigger 
                          value="trending"
                          className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-md"
                        >
                          <Star className="w-4 h-4 mr-1" /> Trending
                        </TabsTrigger>
                        <TabsTrigger 
                          value="newest"
                          className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-md"
                        >
                          <Zap className="w-4 h-4 mr-1" /> Newest
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </Card3D>
              
              {/* Only show on desktop */}
              <div className="hidden lg:block">
                <Card3D 
                  className="p-6 space-y-4"
                  glowClassName="from-purple-500/20 via-transparent to-blue-500/20"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Become a Creator</h3>
                    <Rocket className="w-5 h-5 text-purple-500" />
                  </div>
                  
                  <p className="text-sm text-gray-400">
                    Start selling your digital products and reach millions of customers.
                  </p>
                  
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg">
                    Start Selling
                  </Button>
                </Card3D>
              </div>
            </div>
            
            {/* Main content area */}
            <div className="flex-1">
              {/* Category tabs */}
              <div className="mb-8 overflow-x-auto pb-4 no-scrollbar">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {categories.map((category, idx) => (
                    <div 
                      key={category.name}
                      onClick={() => setActiveCategory(category.name)}
                    >
                      <Category3DCard 
                        icon={category.icon}
                        name={category.name}
                        count={category.count}
                        color={category.color}
                        isActive={activeCategory === category.name}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Search and view toggle (mobile only) */}
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <div className="relative flex-1 max-w-md">
                  <Input 
                    type="text" 
                    placeholder="Search products..." 
                    className="rounded-full bg-white/5 border-white/10 focus:border-purple-500 pl-10 pr-4 py-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  className="ml-2 rounded-full bg-white/5 border-white/10"
                  onClick={() => setView3D(!view3D)}
                >
                  <Layers className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Results info */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">
                    {activeCategory === 'All' ? 'All Products' : activeCategory}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {filteredProducts.length} products found
                  </p>
                </div>
                
                <Badge 
                  className={cn(
                    "px-3 py-1.5",
                    activeTab === 'trending' 
                      ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" 
                      : activeTab === 'newest'
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                  )}
                >
                  {activeTab === 'trending' && <Star className="w-3.5 h-3.5 mr-1.5" />}
                  {activeTab === 'newest' && <Zap className="w-3.5 h-3.5 mr-1.5" />}
                  {activeTab === 'popular' && <Award className="w-3.5 h-3.5 mr-1.5" />}
                  {activeTab === 'for-you' && <Sparkles className="w-3.5 h-3.5 mr-1.5" />}
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
                </Badge>
              </div>
              
              {/* Product grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-96 rounded-xl bg-white/5 animate-pulse"></div>
                  ))}
                </div>
              ) : sortedProducts.length === 0 ? (
                <Card3D className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No Products Found</h3>
                  <p className="text-gray-400 mb-6">
                    Try adjusting your filters or search term.
                  </p>
                  <Button 
                    onClick={() => {
                      setActiveCategory('All');
                      setSearchQuery('');
                      setPriceRange([0, 1000]);
                      setShowPremiumOnly(false);
                    }}
                    className="bg-white/10 hover:bg-white/15 text-white rounded-full px-6"
                  >
                    Reset Filters
                  </Button>
                </Card3D>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {view3D ? (
                    // 3D view
                    sortedProducts.map((product, index) => (
                      <FeaturedProductCard 
                        key={product.id || index} 
                        product={product} 
                        index={index} 
                      />
                    ))
                  ) : (
                    // Regular view
                    sortedProducts.map((product, index) => (
                      <ProductCard 
                        key={product.id || index} 
                        product={product} 
                        index={index} 
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* Featured Creators Section */}
        <section className="container mx-auto px-4 py-10 mb-12">
          <div className="flex items-end justify-between mb-8">
            <div>
              <Badge className="mb-2 px-3 py-1 bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                <Award className="w-3.5 h-3.5 mr-1.5" /> Featured
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold">Top Creators</h2>
            </div>
            <Button variant="link" className="text-purple-400">
              View All <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {creators.map((creator, index) => (
              <CreatorCard
                key={index}
                name={creator.name}
                avatar={creator.avatar}
                isVerified={creator.isVerified}
                followers={creator.followers}
                products={creator.products}
              />
            ))}
          </div>
        </section>
        
        {/* CTA Banner */}
        <section className="container mx-auto px-4 mb-20">
          <Card3D
            className="p-8 md:p-12 bg-gradient-to-br from-[#1E1E1E] to-[#121212] border-none overflow-hidden"
            bgClassName="from-purple-600/10 via-transparent to-blue-600/5"
            glowClassName="from-purple-600/20 via-transparent to-blue-600/20"
          >
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 relative z-10">
                <Badge className="mb-2 px-3 py-1 bg-green-500/10 text-green-400 border-green-500/20">
                  <DollarSign className="w-3.5 h-3.5 mr-1.5" /> Income Potential
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                  Start Selling Your Digital Products
                </h2>
                <p className="text-gray-400 max-w-md">
                  Join thousands of creators earning income by sharing their expertise through digital products.
                </p>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg px-8 py-6 rounded-full font-medium">
                  <Rocket className="w-5 h-5 mr-2" />
                  Become a Seller
                </Button>
              </motion.div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 opacity-30 pointer-events-none">
              <motion.div 
                className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            </div>
          </Card3D>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                3D Marketplace
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                The next-generation digital marketplace for premium AI tools, templates, and assets.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4">Products</h4>
              <ul className="space-y-2">
                {["AI Tools", "Templates", "Graphics", "Software", "APIs"].map(item => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                {["Documentation", "Tutorials", "Blog", "Community", "Changelog"].map(item => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                {["About", "Careers", "Contact", "Privacy", "Terms"].map(item => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2025 3D Marketplace. All rights reserved.
            </p>
            
            <div className="flex space-x-4 mt-4 md:mt-0">
              {["Twitter", "Discord", "GitHub", "YouTube"].map(item => (
                <a 
                  key={item} 
                  href="#" 
                  className="text-gray-400 hover:text-white text-sm"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
      
      {/* Mobile bottom navigation */}
      <BottomNav />
    </div>
  );
}