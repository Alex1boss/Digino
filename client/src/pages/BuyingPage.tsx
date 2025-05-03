import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { 
  Search,
  Mic,
  User,
  ShoppingCart,
  ChevronRight,
  Star,
  Heart,
  Eye,
  Play,
  Award,
  Shield,
  CheckCircle,
  MessageCircle,
  Clock,
  Zap,
  TrendingUp,
  Package,
  Download,
  Filter,
  Sparkles,
  Laptop
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { type Product } from "@/schema";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card3D } from "@/components/ui/3d-card";
import { useAuth } from "@/hooks/use-auth";

// Interfaces for static content
interface Recommendation {
  id: number;
  name: string;
  tagline: string;
  rating: number;
  sales: number;
  price: number;
  currency: string;
  badges: string[];
  tags: string[];
  icon: any;
  seller: {
    name: string;
    verified: boolean;
    type: string;
  };
}

interface Creator {
  id: number;
  name: string;
  specialty: string;
  avatar: string;
  verified: boolean;
  products: number;
  rating: number;
}

interface Category {
  id: number;
  name: string;
  icon: any;
  count: number;
  trending: boolean;
}

export default function BuyingPage() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [isVoiceSearchActive, setIsVoiceSearchActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Scroll animations
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);
  const navbarBackground = useTransform(
    scrollY, 
    [0, 100], 
    ["rgba(10, 10, 40, 0)", "rgba(10, 10, 40, 0.8)"]
  );
  
  // Fetch real products from the API
  const { data: products = [], isLoading: isProductsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Generate recommendations based on real products with enhanced presentation
  const recommendations = products.map(product => ({
    id: product.id,
    name: product.name,
    tagline: product.description?.substring(0, 60) + "..." || "Innovative digital product",
    rating: product.rating || 4.8,
    sales: product.sales || Math.floor(Math.random() * 500),
    price: product.price || 29.99,
    currency: product.currency || "USD",
    badges: [Math.random() > 0.5 ? "AI Favorite" : "Top Seller", Math.random() > 0.7 ? "Limited Deal" : ""],
    tags: (product.tags?.split(",") || ["ai", "digital"]).map((tag: string) => tag.trim()),
    icon: product.Icon || Laptop,
    seller: {
      name: product.author?.name || "Innventa Creator",
      verified: true,
      type: Math.random() > 0.5 ? "Pro AI" : "Verified"
    }
  }));

  // Featured categories
  const categories: Category[] = [
    { id: 1, name: "Templates", icon: Laptop, count: 128, trending: true },
    { id: 2, name: "Chatbots", icon: MessageCircle, count: 94, trending: true },
    { id: 3, name: "Design Kits", icon: Package, count: 76, trending: false },
    { id: 4, name: "Productivity", icon: Zap, count: 112, trending: true },
    { id: 5, name: "AI Tools", icon: Sparkles, count: 152, trending: true },
    { id: 6, name: "Courses", icon: Laptop, count: 68, trending: false },
    { id: 7, name: "Automation", icon: TrendingUp, count: 48, trending: true },
  ];

  // Featured creators based on first few products as an example
  const creators: Creator[] = products.slice(0, 4).map((product, index) => ({
    id: index + 1,
    name: product.author?.name || `Creator ${index + 1}`,
    specialty: ["AI Tools", "Digital Assets", "Design Resources", "Productivity"][index % 4],
    avatar: product.author?.avatar || "/avatars/creator-" + (index + 1) + ".png",
    verified: true,
    products: Math.floor(Math.random() * 30) + 5,
    rating: 4.5 + (Math.random() * 0.5)
  }));

  // Trending items simulation
  const trendingItems = products.slice(0, 8).map(product => ({
    id: product.id,
    name: product.name,
    time: `${Math.floor(Math.random() * 60)} mins ago`,
    buyer: `User${Math.floor(Math.random() * 1000)}`,
    price: product.price || 29.99
  }));

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Implement search logic here
  };

  const toggleVoiceSearch = () => {
    setIsVoiceSearchActive(!isVoiceSearchActive);
    // In a real implementation, this would activate the microphone
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0A0A28] to-[#101035] text-white">
      {/* Navbar - Sticky and blurs on scroll */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-all duration-300"
        style={{ backgroundColor: navbarBackground }}
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00C49A] to-[#7C96FF]">
              Innventa AI
            </span>
          </motion.div>
          
          {/* Search Bar (Wider on Desktop) */}
          <form 
            onSubmit={handleSearch}
            className={`relative ${isMobile ? 'hidden' : 'flex-1 max-w-xl ml-8'}`}
          >
            <div className="relative flex items-center">
              <Input 
                type="text"
                placeholder="Search Smart Products..."
                className="rounded-full pl-10 pr-12 py-2 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/15 transition-all w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={18} />
              
              <button 
                type="button"
                onClick={toggleVoiceSearch}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${isVoiceSearchActive ? 'bg-purple-500/30 text-purple-400' : 'text-white/60 hover:text-white'}`}
              >
                <Mic size={18} />
              </button>
            </div>
          </form>
          
          {/* Navigation Icons */}
          <div className="flex items-center gap-1 md:gap-3">
            {/* Mobile Search Icon */}
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-full hover:bg-white/10 md:hidden"
              onClick={() => console.log("Mobile search")}
            >
              <Search size={20} />
            </Button>
            
            {/* AI Assistant Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-full bg-gradient-to-br from-[#00C49A]/20 to-[#7C96FF]/20 hover:from-[#00C49A]/30 hover:to-[#7C96FF]/30"
            >
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{ 
                  boxShadow: ["0 0 0 0 rgba(0,196,154,0)", "0 0 0 4px rgba(0,196,154,0.2)", "0 0 0 0 rgba(0,196,154,0)"]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              />
              <Sparkles className="text-[#00C49A]" size={18} />
            </Button>
            
            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-full hover:bg-white/10"
            >
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#00C49A] rounded-full text-xs flex items-center justify-center">
                0
              </span>
            </Button>
            
            {/* Profile Button */}
            <Link href="/profile">
              <Button 
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 rounded-full hover:bg-white/10"
              >
                <User size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section */}
        <motion.section 
          className="relative min-h-[50vh] flex items-center justify-center overflow-hidden"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          {/* Background Elements */}
          <div className="absolute inset-0 z-0">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A28]/80 to-[#101035]" />
            
            {/* Grid lines */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-[0.05]" />
            
            {/* Glowing orbs */}
            <motion.div 
              className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full"
              style={{ 
                background: "radial-gradient(circle, rgba(0,196,154,0.2) 0%, rgba(10,10,40,0) 70%)",
                filter: "blur(40px)"
              }}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            
            <motion.div 
              className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full"
              style={{ 
                background: "radial-gradient(circle, rgba(124,150,255,0.2) 0%, rgba(10,10,40,0) 70%)",
                filter: "blur(40px)"
              }}
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ 
                duration: 10,
                delay: 1,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </div>
          
          {/* Hero Content */}
          <div className="container relative z-10 px-4 py-10 md:py-20">
            <motion.div 
              className="max-w-3xl mx-auto text-center space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 
                className="text-4xl md:text-6xl font-bold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <span className="block">Buy Smarter. Faster.</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00C49A] to-[#7C96FF]">
                  With AI.
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-white/70 max-w-lg mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Discover next-gen digital products tailored just for you.
              </motion.p>
              
              {/* Quick Access Buttons */}
              <motion.div 
                className="flex flex-wrap justify-center gap-3 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/10 text-white">
                  <Sparkles size={16} className="mr-2 text-[#00C49A]" />
                  Top AI Picks
                </Button>
                
                <Button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/10 text-white">
                  <Zap size={16} className="mr-2 text-[#7C96FF]" />
                  Best Deals Today
                </Button>
                
                <Button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/10 text-white">
                  <Package size={16} className="mr-2 text-[#BB86FC]" />
                  New Arrivals
                </Button>
                
                <Button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/10 text-white">
                  <Award size={16} className="mr-2 text-amber-400" />
                  Premium Creators
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* AI Recommendations Section */}
        <section className="py-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-2">AI Recommendations</h2>
            <p className="text-white/70 italic">Because AI knows what you need before you search.</p>
          </motion.div>
          
          {isProductsLoading ? (
            // Loading state with shimmer effect
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((_, index) => (
                <Card3D key={index} className="h-80">
                  <div className="h-full animate-pulse" />
                </Card3D>
              ))}
            </div>
          ) : (
            // Product recommendation grid
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {recommendations.map((product, index) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <Link href={`/product/${product.id}`}>
                    <Card3D
                      className="h-full transition-all overflow-hidden group cursor-pointer"
                      bgClassName="bg-gradient-to-b from-[#161645] to-[#0D0D35] border border-white/5"
                      glowClassName="from-[#00C49A]/10 via-[#7C96FF]/10 to-transparent"
                    >
                      <div className="p-5 h-full flex flex-col">
                        {/* Top badges */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex gap-2">
                            {product.badges.filter(Boolean).map((badge, i) => (
                              <Badge 
                                key={i}
                                className={`${
                                  badge === "AI Favorite" 
                                    ? "bg-[#00C49A]/20 text-[#00C49A] border-[#00C49A]/30" 
                                    : badge === "Limited Deal"
                                    ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                    : "bg-[#7C96FF]/20 text-[#7C96FF] border-[#7C96FF]/30"
                                } px-2 py-1`}
                              >
                                {badge === "AI Favorite" ? <Sparkles size={14} className="mr-1" /> : null}
                                {badge === "Limited Deal" ? <Clock size={14} className="mr-1" /> : null}
                                {badge === "Top Seller" ? <TrendingUp size={14} className="mr-1" /> : null}
                                {badge}
                              </Badge>
                            ))}
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full hover:bg-white/10 text-white/60 hover:text-[#FF5E94]"
                          >
                            <Heart size={18} />
                          </Button>
                        </div>
                        
                        {/* Product Icon */}
                        <div className="relative mb-4">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00C49A]/20 to-[#7C96FF]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <product.icon 
                              size={30} 
                              className="text-white group-hover:text-[#00C49A] transition-colors" 
                            />
                          </div>
                          
                          {/* Play preview button */}
                          <motion.div 
                            className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            whileHover={{ scale: 1.1 }}
                          >
                            <Button 
                              size="icon" 
                              className="h-8 w-8 rounded-full bg-[#0056D2] hover:bg-[#0066FF] text-white shadow-lg shadow-[#0056D2]/20"
                            >
                              <Play size={14} fill="currentColor" />
                            </Button>
                          </motion.div>
                        </div>
                        
                        {/* Product Info */}
                        <h3 className="text-lg font-bold mb-1 group-hover:text-[#00C49A] transition-colors">
                          {product.name}
                        </h3>
                        
                        <p className="text-white/70 text-sm mb-3 flex-grow">
                          {product.tagline}
                        </p>
                        
                        {/* Seller info */}
                        <div className="flex items-center gap-2 mb-3">
                          <Badge 
                            variant="outline" 
                            className="px-2 py-0.5 bg-white/5 border-white/10 text-xs flex items-center gap-1"
                          >
                            {product.seller.type === "Pro AI" ? (
                              <Sparkles size={10} className="text-[#BB86FC]" />
                            ) : (
                              <CheckCircle size={10} className="text-[#00C49A]" />
                            )}
                            <span className={product.seller.type === "Pro AI" ? "text-[#BB86FC]" : "text-[#00C49A]"}>
                              {product.seller.type}
                            </span>
                          </Badge>
                          <span className="text-xs text-white/60">
                            by {product.seller.name}
                          </span>
                        </div>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {product.tags.slice(0, 3).map((tag: string, i: number) => (
                            <span 
                              key={i} 
                              className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/60"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        
                        {/* Rating and Price footer */}
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              <Star size={14} className="text-amber-400 fill-amber-400" />
                              <span className="text-white text-sm ml-1 font-medium">{product.rating.toFixed(1)}</span>
                            </div>
                            <span className="text-white/40 text-xs">|</span>
                            <div className="flex items-center text-white/60 text-xs">
                              <Download size={12} className="mr-1" />
                              {product.sales}
                            </div>
                          </div>
                          
                          <div className="font-bold text-[#00C49A]">
                            ${product.price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </Card3D>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
          
          {/* View All Button */}
          <div className="mt-8 text-center">
            <Link href="/explore">
              <Button className="bg-gradient-to-r from-[#0056D2] to-[#00C49A] hover:opacity-90 text-white">
                View All Products
                <ChevronRight size={16} />
              </Button>
            </Link>
          </div>
        </section>
        
        {/* Category Hub Section */}
        <section className="py-10 bg-[#0A0A28]/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Category Hub</h2>
              <p className="text-white/70 italic flex items-center">
                <Filter size={16} className="mr-2" />
                Explore with AI Filters
              </p>
            </motion.div>
            
            {/* Categories */}
            <div className="relative">
              <motion.div 
                className="flex overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent gap-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                {categories.map((category) => (
                  <motion.div 
                    key={category.id}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="flex-shrink-0"
                  >
                    <Card3D 
                      className={`w-36 h-36 flex flex-col items-center justify-center cursor-pointer transition-all ${
                        selectedCategory === category.name ? 'ring-2 ring-[#00C49A]' : ''
                      }`}
                      onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
                      bgClassName="bg-gradient-to-b from-[#161645] to-[#0D0D35] border border-white/5"
                    >
                      <div className="p-4 text-center">
                        <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-[#00C49A]/20 to-[#7C96FF]/20 flex items-center justify-center mb-2">
                          <category.icon size={24} className="text-white" />
                        </div>
                        <h3 className="font-medium mb-1">{category.name}</h3>
                        <div className="text-xs text-white/60">{category.count} products</div>
                        {category.trending && (
                          <Badge className="mt-2 bg-[#00C49A]/20 text-[#00C49A] border-[#00C49A]/30 px-2">
                            <TrendingUp size={10} className="mr-1" />
                            Trending
                          </Badge>
                        )}
                      </div>
                    </Card3D>
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Gradient fades for horizontal scroll */}
              <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-[#0A0A28] to-transparent pointer-events-none" />
              <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-[#0A0A28] to-transparent pointer-events-none" />
            </div>
          </div>
        </section>
        
        {/* Live Trending Bar */}
        <section className="py-6 bg-gradient-to-r from-[#0056D2]/20 to-[#00C49A]/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-[0.03]" />
          
          <div className="container mx-auto px-4">
            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="relative">
                  <span className="absolute top-0 left-0 w-3 h-3 rounded-full bg-[#00C49A] animate-ping" />
                  <span className="relative inline-block w-3 h-3 rounded-full bg-[#00C49A]" />
                </div>
                <span className="font-semibold whitespace-nowrap">Currently Popular:</span>
              </div>
              
              <div className="overflow-hidden relative flex-1">
                <motion.div
                  className="flex gap-6 whitespace-nowrap"
                  animate={{ x: [0, -1000] }}
                  transition={{ 
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  {trendingItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-1 text-sm">
                      <span className="text-white/60">{item.buyer}</span>
                      <span> purchased </span>
                      <span className="font-medium text-[#00C49A]">{item.name}</span>
                      <span className="text-white/60"> for ${item.price.toFixed(2)}</span>
                      <span className="text-white/40 text-xs"> • {item.time}</span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Trust Builders Section */}
        <section className="py-12 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Why Buyers Trust Innventa AI</h2>
            <p className="text-white/70 italic max-w-xl mx-auto">
              Our platform is designed with security, transparency, and quality in mind.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              { icon: Shield, title: "AI Verified Products", description: "Every product is scanned for quality and security" },
              { icon: Star, title: "Transparent Reviews", description: "Verified purchase feedback you can trust" },
              { icon: CheckCircle, title: "Safe Checkout", description: "Advanced encryption protects your transactions" },
              { icon: MessageCircle, title: "24/7 AI Support", description: "Intelligent help available anytime" },
              { icon: Award, title: "Verified Creators", description: "Quality creators with proven track records" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#00C49A]/20 to-[#7C96FF]/20 flex items-center justify-center mb-4">
                  <item.icon size={28} className="text-[#00C49A]" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-white/60">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>
        
        {/* Creator Spotlight */}
        <section className="py-12 bg-[#0A0A28]/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mb-10"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Creator Spotlight</h2>
              <p className="text-white/70 italic">
                Explore products from trusted innovators.
              </p>
            </motion.div>
            
            {/* Creators Grid */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {creators.map((creator) => (
                <motion.div key={creator.id} variants={itemVariants}>
                  <Card3D
                    className="p-6 flex flex-col items-center text-center group cursor-pointer"
                    bgClassName="bg-gradient-to-b from-[#131340] to-[#0D0D35] border border-white/5"
                  >
                    <div className="relative mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0056D2]/30 to-[#00C49A]/30 flex items-center justify-center overflow-hidden">
                        <User className="text-white h-8 w-8" />
                      </div>
                      {creator.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-[#00C49A] rounded-full p-0.5">
                          <CheckCircle size={14} className="text-black" fill="currentColor" />
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-semibold mb-1 group-hover:text-[#00C49A] transition-colors">
                      {creator.name}
                    </h3>
                    
                    <p className="text-sm text-white/70 mb-3">{creator.specialty}</p>
                    
                    <div className="flex items-center justify-center gap-4 text-sm text-white/60">
                      <div className="flex items-center">
                        <Package size={14} className="mr-1" />
                        <span>{creator.products}</span>
                      </div>
                      <div className="flex items-center">
                        <Star size={14} className="mr-1 text-amber-400" />
                        <span>{creator.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-4 w-full border border-white/10 hover:bg-white/10"
                    >
                      View Profile
                    </Button>
                  </Card3D>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Call To Action */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0056D2]/20 to-[#00C49A]/20" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-[0.05]" />
          
          {/* Animated orbs */}
          <motion.div 
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full"
            style={{ 
              background: "radial-gradient(circle, rgba(0,196,154,0.2) 0%, rgba(10,10,40,0) 70%)",
              filter: "blur(40px)"
            }}
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
            style={{ 
              background: "radial-gradient(circle, rgba(124,150,255,0.2) 0%, rgba(10,10,40,0) 70%)",
              filter: "blur(40px)"
            }}
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ 
              duration: 10,
              delay: 1,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to discover next-gen digital products?
              </h2>
              <p className="text-white/70 mb-8 text-lg">
                Join thousands of users leveraging AI-powered marketplace technology today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  className="bg-gradient-to-r from-[#0056D2] to-[#00C49A] hover:opacity-90 text-white text-lg py-6 px-8"
                >
                  Start Exploring
                  <ChevronRight size={20} />
                </Button>
                
                <Button 
                  variant="outline"
                  className="border-white/20 hover:bg-white/10 text-white text-lg py-6 px-8"
                >
                  Become a Creator
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-[#0A0A28] py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00C49A] to-[#7C96FF]">
                Innventa AI
              </h2>
              <p className="text-white/60 mt-2">Powering the Digital Future</p>
            </div>
            
            <div className="flex gap-8 mb-6 md:mb-0">
              <Link href="/help" className="text-white/60 hover:text-white transition-colors">Help</Link>
              <Link href="/terms" className="text-white/60 hover:text-white transition-colors">Terms</Link>
              <Link href="/about" className="text-white/60 hover:text-white transition-colors">About Us</Link>
              <Link href="/contact" className="text-white/60 hover:text-white transition-colors">Contact</Link>
              <Link href="/careers" className="text-white/60 hover:text-white transition-colors">Careers</Link>
            </div>
            
            <div className="flex gap-4">
              {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
                <Button 
                  key={social}
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                >
                  <i className={`ri-${social}-fill`} />
                </Button>
              ))}
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/40 text-sm">
            © {new Date().getFullYear()} Innventa AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}