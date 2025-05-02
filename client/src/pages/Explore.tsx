import { motion, useAnimation, useTransform, useScroll, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
import type { ElementType } from "react";
import { Product } from "../schema";
import { useQuery } from "@tanstack/react-query";
import { getIconComponent } from "../schema";
import { useLocation } from "wouter";
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
  Heart,
  X as XIcon,
  User,
  Package,
  Settings,
  LogOut
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Label } from "../components/ui/label";
import { Slider } from "../components/ui/slider";
import { Avatar3D } from "../components/ui/3d-avatar";
import { Card3D } from "../components/ui/3d-card";
import { Badge3D } from "../components/ui/3d-badge";
import { StatsCard3D } from "../components/ui/3d-stats-card";
import BottomNav from "../components/BottomNav";
import ProductDetail from "../components/ui/ProductDetail";

// Helper function to safely render icons from product
function renderProductIcon(product: Product, props: React.ComponentProps<ElementType> = {}) {
  // If product has a custom icon, use that instead
  if (product.customIcon) {
    return (
      <div className="product-icon-wrapper">
        <img 
          src={product.customIcon} 
          alt={`${product.name} icon`} 
          className={`custom-product-icon ${props.className || ''}`}
          style={{...props.style, maxWidth: '100%', maxHeight: '100%'}}
        />
      </div>
    );
  }
  
  // Otherwise fallback to standard icon component
  return React.createElement(
    product.Icon || Cpu, // Fallback to Cpu if Icon is undefined
    props
  );
}

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
  index,
  onProductSelect
}: { 
  product: Product; 
  index: number;
  onProductSelect: (product: Product) => void;
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
      onClick={() => onProductSelect(product)}
    >
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
              backgroundImage: product.customIcon || product.coverImage || product.imageUrl 
                ? `url(${product.customIcon || product.coverImage || product.imageUrl})` 
                : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'contrast(1.1) saturate(1.2)'
            }}
          >
            {/* Fallback gradient and icon if no image */}
            {!product.customIcon && !product.coverImage && !product.imageUrl && (
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
                    {renderProductIcon(product, { className: "w-14 h-14", style: { color: colorSet.primary } })}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
          
          {/* Content with 3D layered effect */}
          <div className="p-6 relative z-20">
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
            </div>
            
            {/* Product name */}
            <h3 className="text-xl font-medium text-white mb-1 line-clamp-1">{product.name}</h3>
            
            {/* Product description */}
            <p className="text-gray-400 text-sm line-clamp-2 mb-3">
              {product.description}
            </p>
            
            {/* Pricing and rating row */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold">${product.price ? product.price.toFixed(2) : "0.00"}</span>
                <span className="text-gray-500 text-sm">{product.currency || "USD"}</span>
              </div>
              
              {/* Rating stars */}
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium text-white">{product.rating || rating}</span>
                <span className="text-xs text-gray-500">({product.reviews || Math.floor(Math.random() * 50) + 5})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Explore() {
  // UI State 
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [view3D, setView3D] = useState(true);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [, setLocation] = useLocation();
  
  // Handle scroll events for UI
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
  
  // Fetch products from the database via API with optimized loading
  const { data: products, isLoading } = useQuery({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      console.log("Products loaded from database:", data.length);
      
      // Process products in chunks to avoid UI freezing with large datasets
      const processedProducts: Product[] = [];
      const chunkSize = 10;
      
      for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        
        // Process each chunk
        const processedChunk = chunk.map((product: any) => ({
          ...product,
          Icon: getIconComponent(product.iconName || 'cpu'),
          // Ensure these properties exist for consistent UI
          currency: product.currency || "USD",
          rating: product.rating || 0,
          reviews: product.reviews || 0,
          sales: product.sales || 0,
          // Make sure coverImage is set if we have productImages
          coverImage: product.coverImage || (product.productImages && product.productImages.length > 0 
            ? product.productImages[0] : null)
        }));
        
        processedProducts.push(...processedChunk);
      }
      
      return processedProducts;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes to reduce repeated fetches
  });
  
  // Filter products based on active filters
  const filteredProducts = (products || []).filter(product => {
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
  
  // Categories with counts
  const categories = [
    { name: 'All', count: (products || []).length, icon: <Grid3X3 className="text-white" />, color: '#BB86FC' },
    { name: 'ai_tools', count: (products || []).filter(p => p.category === 'ai_tools').length || 3, icon: <Cpu className="text-blue-400" />, color: '#6366F1' },
    { name: 'templates', count: (products || []).filter(p => p.category === 'templates').length || 12, icon: <Layers className="text-cyan-400" />, color: '#00CFFF' },
    { name: 'graphics', count: (products || []).filter(p => p.category === 'graphics').length || 8, icon: <Box className="text-teal-400" />, color: '#10B981' },
    { name: 'Software', count: (products || []).filter(p => p.category === 'Software').length || 14, icon: <Code className="text-amber-400" />, color: '#F59E0B' },
    { name: 'Digital Assets', count: (products || []).filter(p => p.category === 'Digital Assets').length || 6, icon: <Tag className="text-red-400" />, color: '#EF4444' },
  ];
  
  // Artificial creators for UI
  const creators = [
    { name: 'Alex Chen', followers: 1258, products: 12, isVerified: true, avatar: '' },
    { name: 'Maria Rodriguez', followers: 864, products: 8, isVerified: true, avatar: '' },
    { name: 'David Kim', followers: 2145, products: 17, isVerified: true, avatar: '' },
    { name: 'Sarah Johnson', followers: 932, products: 5, isVerified: false, avatar: '' },
  ];
  
  // Statistics data for UI
  const statsData = [
    { title: 'Digital Products', value: (products || []).length + 280, icon: <Layers className="w-5 h-5" /> },
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
              Digital Marketplace
            </div>
            
            <nav className="hidden md:flex space-x-6">
              {["Explore", "Top Products", "Categories", "AI Deals"].map((item, index) => (
                <motion.a 
                  key={item}
                  href="#"
                  className={cn(
                    "relative text-sm transition-colors hover:text-white",
                    index === 0 ? "text-white" : "text-gray-400"
                  )}
                  whileHover={{ y: -2 }}
                >
                  {item}
                  {index === 0 && (
                    <motion.div 
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
                      layoutId="navIndicator"
                    />
                  )}
                </motion.a>
              ))}
            </nav>
          </div>
          
          {/* Search and user actions */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Input 
                className="w-64 bg-white/5 border-white/10 text-white pl-10 focus:bg-white/10 focus:border-purple-500/50 transition-all"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-white/5 hover:bg-white/10 text-white"
            >
              <Heart className="w-5 h-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-full bg-white/5 hover:bg-white/10 text-white"
            >
              <ShoppingCart className="w-5 h-5" />
            </Button>
            
            {/* Profile dropdown */}
            <div className="hidden md:flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 h-auto">
                    <div className="flex items-center gap-2">
                      <motion.div 
                        className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-semibold"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        JD
                      </motion.div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium text-white">John Doe</span>
                        <span className="text-xs text-gray-400">Premium Member</span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Package className="mr-2 h-4 w-4" />
                    <span>My Products</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Wishlist</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="relative pb-20 z-10 pt-32 container mx-auto px-4">
        {/* Hero section with advanced 3D stats */}
        <div className="mb-16">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Discover premium <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500">digital products</span> created by experts
          </motion.h1>
          
          <motion.p 
            className="text-gray-400 text-lg max-w-2xl mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Explore thousands of high-quality digital assets, tools, and software built by a global community of creators.
          </motion.p>
          
          {/* 3D Statistics cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statsData.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
              >
                <StatsCard3D
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  colorIndex={index}
                />
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Mobile search - only show on small screens */}
        <div className="relative mb-8 md:hidden">
          <Input 
            className="w-full bg-white/5 border-white/10 text-white pl-10 focus:bg-white/10 focus:border-purple-500/50 transition-all"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
        
        {/* Category filters */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Browse Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + (index * 0.05) }}
              >
                <Category3DCard
                  icon={category.icon}
                  name={category.name}
                  count={category.count}
                  color={category.color}
                  isActive={activeCategory === category.name}
                />
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Sorting and filtering controls */}
        <div className="flex flex-col md:flex-row justify-between mb-8 space-y-4 md:space-y-0">
          {/* Browse tabs */}
          <div className="flex items-center">
            <Tabs defaultValue="trending" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="bg-white/5 p-1">
                <TabsTrigger value="trending" className="px-4">Trending</TabsTrigger>
                <TabsTrigger value="newest" className="px-4">Newest</TabsTrigger>
                <TabsTrigger value="popular" className="px-4">Popular</TabsTrigger>
                <TabsTrigger value="for-you" className="px-4">For You</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Filter button */}
            <Button 
              variant="outline" 
              className="border-white/10 bg-white/5 hover:bg-white/10 text-white hover:text-white"
              onClick={() => setShowMoreFilters(!showMoreFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              <ChevronDown className={cn("ml-2 h-4 w-4 transition-transform", showMoreFilters ? "rotate-180" : "")} />
            </Button>
            
            {/* 3D view toggle */}
            <div className="hidden md:flex items-center space-x-2">
              <Label htmlFor="view3d" className="text-sm text-gray-400">3D View</Label>
              <Switch
                id="view3d"
                checked={view3D}
                onCheckedChange={setView3D}
              />
            </div>
          </div>
        </div>
        
        {/* Advanced filters panel */}
        {showMoreFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-5 mb-8 border border-white/10"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Price range slider */}
              <div>
                <Label className="block text-sm mb-2">Price Range</Label>
                <Slider
                  value={priceRange}
                  min={0}
                  max={1000}
                  step={1}
                  onValueChange={setPriceRange}
                  className="my-4"
                />
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">${priceRange[0]}</span>
                  <span className="text-sm text-gray-400">${priceRange[1]}</span>
                </div>
              </div>
              
              {/* Premium filter */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="premium"
                  checked={showPremiumOnly}
                  onCheckedChange={setShowPremiumOnly}
                />
                <Label htmlFor="premium" className="text-sm">Show Premium Only</Label>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Products grid */}
        <div className="mb-16">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <span>Featured Products</span>
            {isLoading && <span className="ml-2 text-sm text-gray-400">Loading...</span>}
          </h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden bg-white/5 animate-pulse h-80"></div>
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-16">
              <Rocket className="mx-auto h-12 w-12 text-gray-500 mb-4" />
              <h3 className="text-2xl font-medium mb-2">No products found</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Try adjusting your search or filter criteria to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedProducts.map((product, index) => (
                <FeaturedProductCard 
                  key={product.id || index}
                  product={product}
                  index={index}
                  onProductSelect={setSelectedProduct}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Featured creators section */}
        <div className="mb-16">
          <h2 className="text-xl font-semibold mb-6">Featured Creators</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {creators.map((creator, index) => (
              <motion.div
                key={creator.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + (index * 0.05) }}
              >
                <CreatorCard
                  name={creator.name}
                  avatar={creator.avatar}
                  isVerified={creator.isVerified}
                  followers={creator.followers}
                  products={creator.products}
                />
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Get started CTA */}
        <div className="rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-50 z-0"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_80%)] z-10"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl"></div>
          
          <div className="relative z-20 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to start selling?</h2>
              <p className="text-white/80 max-w-md mb-6">
                Join thousands of creators selling digital products and earning passive income on our platform.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button className="bg-white text-purple-600 hover:bg-gray-100">
                  <Cpu className="mr-2 h-4 w-4" />
                  Start Selling
                </Button>
                
                <Button variant="outline" className="border-white/20 bg-white/10 hover:bg-white/20 text-white">
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="w-full md:w-auto">
              <Card3D 
                className="w-full md:w-80 h-40"
                glowColor="#BB86FC"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-purple-500/20 p-2 rounded-full">
                      <DollarSign className="h-6 w-6 text-purple-400" />
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Average earnings</div>
                      <div className="text-2xl font-bold">$1,250</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400">Products</div>
                      <div className="text-lg font-medium">12+</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Success rate</div>
                      <div className="text-lg font-medium">94%</div>
                    </div>
                  </div>
                </div>
              </Card3D>
            </div>
          </div>
        </div>
      </main>
      
      {/* Bottom mobile navigation */}
      <BottomNav />
      
      {/* Product detail modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#121212] rounded-2xl overflow-hidden relative max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 rounded-full bg-black/40 hover:bg-black/60 text-white"
                onClick={() => setSelectedProduct(null)}
              >
                <XIcon className="h-5 w-5" />
              </Button>
              
              <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}