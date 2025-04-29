import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Avatar3D } from "@/components/ui/3d-avatar";
import { Card3D } from "@/components/ui/3d-card";
import { Badge3D } from "@/components/ui/3d-badge";
import { StatsCard3D } from "@/components/ui/3d-stats-card";
import { ProductCard } from "@/components/ui/product-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Award,
  Users,
  ShoppingBag,
  LineChart,
  Star,
  ThumbsUp,
  Check,
  CreditCard,
  Package,
  Heart,
  TrendingUp,
  Layers,
  Zap,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Product } from "@/schema";

export default function Profile() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  // Spring physics for smoother animations
  const springConfig = { damping: 20, stiffness: 100 };
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.2], [1, 0.95]), springConfig);
  const headerY = useSpring(useTransform(scrollYProgress, [0, 0.3], [0, 50]), springConfig);
  
  // Data
  const [selectedTab, setSelectedTab] = useState("products");

  // Fetch products data
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    staleTime: 1000 * 60 * 5,
  });

  // Mock user data
  const user = {
    id: 1,
    name: "Alex Morgan",
    username: "alexmorgan",
    bio: "Digital creator and entrepreneur. I build premium digital assets and products for modern creators.",
    avatar: "/avatar-placeholder.svg",
    isVerified: true,
    joined: "April 2023",
    stats: {
      followers: 2548,
      products: 24,
      sales: 876,
      revenue: "$24,560",
      rating: 4.92
    }
  };

  // Filter products for each tab
  const userProducts = products.slice(0, 6);
  const likedProducts = products.slice(2, 7);
  const purchasedProducts = products.slice(4, 9);
  
  return (
    <div className="min-h-screen bg-[#0A0A23] text-white" ref={containerRef}>
      {/* Floating gradient orbs for premium look */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-gradient-to-r from-[#0056D2]/20 to-transparent blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] rounded-full bg-gradient-to-r from-[#00C49A]/20 to-transparent blur-[60px]" />
        <div className="absolute top-3/4 left-1/2 w-[200px] h-[200px] rounded-full bg-gradient-to-r from-[#BB86FC]/20 to-transparent blur-[50px]" />
      </div>
      
      {/* Grid pattern overlay */}
      <div 
        className="fixed top-0 left-0 w-full h-full z-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: "url('/grid.svg')",
          backgroundSize: "100px 100px",
        }}
      />
      
      {/* Noise texture overlay */}
      <div 
        className="fixed top-0 left-0 w-full h-full z-0 opacity-20 pointer-events-none mix-blend-overlay" 
        style={{
          backgroundImage: "url('/noise.svg')",
          backgroundRepeat: "repeat",
        }}
      />

      {/* Header Section with Parallax */}
      <motion.div 
        className="relative h-[45vh] md:h-[55vh] w-full overflow-hidden"
        style={{ y: headerY }}
      >
        {/* Parallax header background with pattern */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-[#0A0A2E] to-[#0A0A23] overflow-hidden"
          style={{ y: y, scale: scale }}
        >
          <div 
            className="absolute inset-0 opacity-30" 
            style={{ 
              backgroundImage: "url('/profile-header-pattern.svg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0A23] opacity-80" />
        </motion.div>
        
        {/* Profile hero content */}
        <motion.div 
          className="container mx-auto h-full flex flex-col justify-end pb-10 px-4 z-10 relative" 
          style={{ opacity }}
        >
          <div className="mt-20 flex flex-col md:flex-row items-start md:items-end gap-6">
            <div className="relative">
              <Avatar3D letter="A" size="xl" verified={user.isVerified} />
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{user.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-[#00C49A] font-medium">@{user.username}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                <span className="text-white/60">Joined {user.joined}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                <span className="text-white/60">{user.stats.followers} followers</span>
              </div>
              <p className="text-white/70 max-w-2xl">{user.bio}</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
              <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-lg gap-2">
                <Users size={16} />
                <span>Follow</span>
              </Button>
              <Button className="bg-[#0056D2] hover:bg-[#0056D2]/90 text-white rounded-lg gap-2">
                <ShoppingBag size={16} />
                <span>View Store</span>
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Premium Badge Section */}
      <div className="relative z-10 container mx-auto px-4 -mt-8">
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          <Badge3D label="Verified Seller" icon={Check} color="#00C49A" glowColor="rgba(0, 196, 154, 0.4)" />
          <Badge3D label="Top Rated" icon={Star} color="#FFD700" glowColor="rgba(255, 215, 0, 0.4)" />
          <Badge3D label="Premium Member" icon={Award} color="#BB86FC" glowColor="rgba(187, 134, 252, 0.4)" />
          <Badge3D label="Fast Support" icon={Zap} color="#0056D2" glowColor="rgba(0, 86, 210, 0.4)" />
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="relative z-10 container mx-auto px-4 mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard3D 
            title="Total Sales" 
            value={user.stats.sales} 
            icon={<ShoppingBag className="text-[#0056D2]" />} 
            color="#0056D2" 
          />
          <StatsCard3D 
            title="Revenue" 
            value={user.stats.revenue} 
            icon={<CreditCard className="text-[#00C49A]" />} 
            color="#00C49A" 
          />
          <StatsCard3D 
            title="Products" 
            value={user.stats.products} 
            icon={<Package className="text-[#BB86FC]" />} 
            color="#BB86FC" 
          />
          <StatsCard3D 
            title="Rating" 
            value={user.stats.rating} 
            icon={<Star className="text-[#FFD700]" />} 
            color="#FFD700" 
          />
        </div>
      </div>
      
      {/* Content Tabs */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <Tabs defaultValue="products" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <div className="border-b border-white/10 mb-8">
            <TabsList className="bg-transparent border-b border-white/10 w-full justify-start rounded-none h-auto p-0 mb-[-1px]">
              <TabsTrigger 
                value="products" 
                className={cn(
                  "rounded-none border-b-2 border-transparent px-6 py-3 text-white/60 data-[state=active]:text-white data-[state=active]:border-[#0056D2] transition-all",
                  selectedTab === "products" ? "text-white border-[#0056D2]" : ""
                )}
              >
                <Package size={18} className="mr-2" />
                My Products
              </TabsTrigger>
              <TabsTrigger 
                value="likes" 
                className={cn(
                  "rounded-none border-b-2 border-transparent px-6 py-3 text-white/60 data-[state=active]:text-white data-[state=active]:border-[#0056D2] transition-all",
                  selectedTab === "likes" ? "text-white border-[#0056D2]" : ""
                )}
              >
                <Heart size={18} className="mr-2" />
                Likes
              </TabsTrigger>
              <TabsTrigger 
                value="purchases" 
                className={cn(
                  "rounded-none border-b-2 border-transparent px-6 py-3 text-white/60 data-[state=active]:text-white data-[state=active]:border-[#0056D2] transition-all",
                  selectedTab === "purchases" ? "text-white border-[#0056D2]" : ""
                )}
              >
                <ShoppingBag size={18} className="mr-2" />
                Purchases
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className={cn(
                  "rounded-none border-b-2 border-transparent px-6 py-3 text-white/60 data-[state=active]:text-white data-[state=active]:border-[#0056D2] transition-all",
                  selectedTab === "analytics" ? "text-white border-[#0056D2]" : ""
                )}
              >
                <LineChart size={18} className="mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="products" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array(6).fill(0).map((_: any, i: number) => (
                  <Card3D key={i} className="h-[280px] bg-white/5 animate-pulse">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-[#0056D2]/30 border-t-[#0056D2] rounded-full animate-spin"></div>
                    </div>
                  </Card3D>
                ))
              ) : (
                userProducts.map((product: Product, index: number) => (
                  <ProductCard key={index} product={product} index={index} />
                ))
              )}
            </div>
            
            <div className="mt-8 flex justify-center">
              <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-lg">
                View All Products
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="likes" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array(6).fill(0).map((_: any, i: number) => (
                  <Card3D key={i} className="h-[280px] bg-white/5 animate-pulse">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-[#0056D2]/30 border-t-[#0056D2] rounded-full animate-spin"></div>
                    </div>
                  </Card3D>
                ))
              ) : (
                likedProducts.map((product: Product, index: number) => (
                  <ProductCard key={index} product={product} index={index} />
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="purchases" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array(6).fill(0).map((_: any, i: number) => (
                  <Card3D key={i} className="h-[280px] bg-white/5 animate-pulse">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-[#0056D2]/30 border-t-[#0056D2] rounded-full animate-spin"></div>
                    </div>
                  </Card3D>
                ))
              ) : (
                purchasedProducts.map((product: Product, index: number) => (
                  <ProductCard key={index} product={product} index={index} />
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card3D className="p-6 min-h-[300px]">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <TrendingUp size={20} className="mr-2 text-[#0056D2]" />
                  Sales Overview
                </h3>
                <div className="h-[220px] flex items-center justify-center">
                  <div className="text-center text-white/60">
                    Analytics charts will appear here
                  </div>
                </div>
              </Card3D>
              
              <Card3D className="p-6 min-h-[300px]">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <Layers size={20} className="mr-2 text-[#00C49A]" />
                  Product Performance
                </h3>
                <div className="space-y-4">
                  {userProducts.slice(0, 4).map((product: Product, i: number) => (
                    <div key={i} className="flex items-center gap-4 border-b border-white/10 pb-4">
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                        <product.Icon size={20} className="text-[#0056D2]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{product.name}</h4>
                        <div className="flex items-center text-white/60 text-sm">
                          <span>${product.price}</span>
                          <span className="mx-2">•</span>
                          <span>{Math.floor(Math.random() * 100)} sales</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-[#00C49A]">
                          ${Math.floor(product.price * Math.random() * 100)}
                        </div>
                        <div className="text-white/60 text-sm">Revenue</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card3D>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}