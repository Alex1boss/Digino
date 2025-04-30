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
  Grid3X3
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

// Featured product card with 3D hover effects
const FeaturedProductCard = ({ 
  product, 
  index 
}: { 
  product: Product; 
  index: number;
}) => {
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
        y: -10,
        rotateY: 5,
        rotateX: 5,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className="bg-gradient-to-br from-[#191919] to-[#0f0f0f] rounded-2xl overflow-hidden shadow-xl relative group cursor-pointer"
      style={{
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}
    >
      {/* Header image with 3D depth effect */}
      <div className="h-48 w-full relative overflow-hidden">
        {/* Actual image */}
        <div 
          className="absolute inset-0 z-10 transition-transform duration-500 ease-out group-hover:scale-110"
          style={{
            backgroundImage: product.coverImage || product.imageUrl 
              ? `url(${product.coverImage || product.imageUrl})` 
              : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Fallback gradient and icon if no image */}
          {!product.coverImage && !product.imageUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/30 to-blue-900/30">
              <div className="rounded-full bg-purple-500/20 p-8">
                <product.Icon className="w-12 h-12 text-purple-500" />
              </div>
            </div>
          )}
        </div>
        
        {/* Overlay with depth effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent z-20"></div>
        
        {/* Premium badge */}
        {index % 3 === 0 && (
          <div className="absolute top-4 left-4 z-30">
            <Badge3D 
              label="Premium" 
              icon={Sparkles} 
              glowColor="#BB86FC"
            />
          </div>
        )}
        
        {/* Hot label */}
        {index % 4 === 0 && (
          <div className="absolute top-4 right-4 z-30">
            <Badge3D 
              label="Hot 🔥" 
              icon={Zap} 
              color="#FF4D4D"
              glowColor="#FF4D4D"
            />
          </div>
        )}
      </div>
      
      {/* Content with 3D pop effect */}
      <div className="p-5 relative z-20">
        {/* Category */}
        <div className="flex items-center gap-2 mb-3">
          <Badge className="px-2 py-1 text-xs font-medium rounded-md bg-purple-500/10 text-purple-400 border-purple-500/20">
            {product.category || "Digital Product"}
          </Badge>
          
          {/* Verified badge if applicable */}
          {index % 2 === 0 && (
            <Badge className="px-2 py-1 text-xs font-medium rounded-md bg-teal-500/10 text-teal-400 border-teal-500/20">
              <Check className="w-3 h-3 mr-1" /> Verified
            </Badge>
          )}
        </div>
        
        {/* Title with 3D pop effect on hover */}
        <motion.h3 
          className="text-xl font-semibold text-white mb-2 transition-transform"
          whileHover={{ 
            scale: 1.03,
            transition: { duration: 0.2 }
          }}
        >
          {product.name}
        </motion.h3>
        
        {/* Description */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
        
        {/* Creator info */}
        <div className="flex items-center gap-2 mb-4">
          <Avatar3D letter="C" size="sm" verified={index % 2 === 0} />
          <span className="text-gray-300 text-sm">
            by <span className="text-white">{product.author?.name || "Creator"}</span>
          </span>
        </div>
        
        {/* Rating and price */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${
                    i < Math.ceil(4.5 - (index * 0.1)) 
                      ? "text-yellow-400 fill-yellow-400" 
                      : "text-gray-600"
                  }`} 
                />
              ))}
            </div>
            <span className="text-gray-400 text-sm ml-2">{(4.5 - (index * 0.1)).toFixed(1)}</span>
          </div>
          
          <div className="text-white font-bold">
            ${product.price || "29.99"}
          </div>
        </div>
        
        {/* 3D Button that pops up on hover */}
        <motion.div 
          className="mt-4 w-full"
          initial={{ y: 80, opacity: 0 }}
          whileHover={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2 font-medium">
            View Product
          </Button>
        </motion.div>
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
        {/* Hero Banner with 3D effects */}
        <motion.section 
          ref={heroRef}
          className="relative bg-gradient-to-b from-[#11112233] to-transparent mb-12 overflow-hidden"
          style={{
            y: bannerYPos,
            scale: bannerScale,
            opacity: bannerOpacity
          }}
        >
          <div className="container mx-auto px-4 py-12 relative z-10">
            <motion.div 
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h1 
                className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-400 to-blue-500"
                animate={{ 
                  textShadow: [
                    "0 0 5px rgba(135, 61, 255, 0.3)", 
                    "0 0 15px rgba(135, 61, 255, 0.5)", 
                    "0 0 5px rgba(135, 61, 255, 0.3)"
                  ]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "mirror"
                }}
              >
                Next-Gen Digital Marketplace
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Discover premium AI tools, templates, and digital assets from top creators around the world.
              </motion.p>
              
              <motion.div
                className="flex flex-wrap justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full px-8 py-6 text-lg font-medium shadow-lg hover:shadow-purple-500/20"
                  onClick={() => {
                    // Scroll to products section
                    document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Explore Products
                </Button>
                
                <Button 
                  className="bg-white/10 hover:bg-white/15 text-white rounded-full px-8 py-6 text-lg font-medium backdrop-blur-sm"
                  onClick={() => setView3D(!view3D)}
                >
                  <Layers className="mr-2 h-5 w-5" />
                  {view3D ? "2D View" : "3D View"}
                </Button>
              </motion.div>
              
              {/* Stats badges */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
                {statsData.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
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
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-70">
            <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-purple-500/10 filter blur-[100px]"></div>
            <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-blue-500/10 filter blur-[100px]"></div>
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