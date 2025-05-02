import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Edit, 
  Calendar, 
  Mail, 
  MapPin, 
  Globe, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Gift, 
  Shield, 
  Award, 
  Star, 
  Heart, 
  Package, 
  ShoppingBag, 
  Bookmark, 
  Settings, 
  Clock, 
  BarChart3, 
  ChevronRight,
  Zap,
  Layers,
  TrendingUp,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/ui/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { type Product } from "@/schema";
import { cn } from "@/lib/utils";
import { Avatar3D } from "@/components/ui/3d-avatar";
import { Card3D } from "@/components/ui/3d-card";
import { Badge3D } from "@/components/ui/3d-badge";
import { StatsCard3D } from "@/components/ui/3d-stats-card";
import { useAuth } from "@/hooks/use-auth";

export default function Profile3D() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [activeTab, setActiveTab] = useState("products");
  const profileRef = useRef<HTMLDivElement>(null);
  
  // For parallax scrolling effect
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const contentOpacity = useTransform(scrollY, [0, 100], [1, 0.8]);
  
  // Animate progress bar on load
  useEffect(() => {
    const timer = setTimeout(() => setProgressValue(72), 500);
    return () => clearTimeout(timer);
  }, []);

  // Get authenticated user data
  const { user: authUser, isLoading: isAuthLoading } = useAuth();

  // Default badges for all users
  const defaultBadges = [
    { name: "Verified User", icon: Shield, color: "#0056D2" }
  ];

  // Define user profile data based on auth user
  const user = authUser ? {
    name: authUser.fullName || authUser.username,
    username: authUser.username,
    avatar: authUser.avatarUrl || "/avatar-placeholder.svg",
    role: authUser.role || "User",
    bio: authUser.bio || "Digital product creator and marketplace user",
    location: "Unknown",
    website: "",
    email: authUser.email || "",
    joinDate: authUser.createdAt ? new Date(authUser.createdAt).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long'
    }) : "Recently",
    stats: {
      products: 0,
      sold: 0,
      followers: 0,
      following: 0,
      rating: 5.0
    },
    badges: defaultBadges,
    activity: [
      { action: "Joined the platform", time: "Recently", link: "#" }
    ]
  } : null;

  // Get products data
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Filter products for this user
  const userProducts = products.slice(0, 6);
  const userPurchases = products.slice(2, 5);
  const userSaved = products.slice(1, 4);

  // Show loading state while auth is loading
  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#070720]">
        <div className="flex flex-col items-center gap-4 p-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-white text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }
  
  // Show error state if user is not authenticated
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#070720]">
        <div className="flex flex-col items-center gap-4 p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-white text-2xl font-bold">Authentication Required</h2>
          <p className="text-white/70">Please log in to view your profile</p>
          <Link href="/auth">
            <Button className="bg-gradient-to-r from-[#0056D2] to-[#00C49A] hover:opacity-90 text-white mt-2">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#070720] text-white overflow-hidden" ref={profileRef}>
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0 w-full overflow-hidden"
        style={{ y: backgroundY }}
      >
        {/* Animated gradient BG */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A1E] to-[#0B0B2E]" />
        
        {/* Particle effects */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute top-0 left-0 w-full h-screen bg-[url('/noise.svg')] bg-repeat opacity-5" />
          
          {/* Floating orbs */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 200 + 50,
                height: Math.random() * 200 + 50,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                background: `radial-gradient(circle, rgba(0,86,210,${Math.random() * 0.2}) 0%, rgba(0,196,154,${Math.random() * 0.1}) 50%, transparent 70%)`,
                filter: "blur(40px)",
              }}
              animate={{
                y: [Math.random() * 50, Math.random() * -50, Math.random() * 50],
                x: [Math.random() * 50, Math.random() * -50, Math.random() * 50],
                opacity: [0.1, Math.random() * 0.5, 0.1],
              }}
              transition={{
                duration: Math.random() * 10 + 20,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>
        
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-[0.03]" />
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="relative z-10 pt-24" 
        style={{ opacity: contentOpacity }}
      >
        <div className="container mx-auto px-4 md:px-6">
          {/* Profile Header */}
          <Card3D 
            className="mb-8 w-full" 
            bgClassName="bg-[#131340]/90 backdrop-blur-md"
            glowClassName="from-[#0056D2]/30 via-[#00C49A]/30 to-transparent"
          >
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                <div className="flex flex-col items-center md:items-start">
                  {/* 3D Avatar */}
                  <Avatar3D 
                    letter={user.name.charAt(0)} 
                    size="xl" 
                    verified={true}
                  />
                  
                  <div className="mt-4 flex flex-col items-center md:items-start">
                    <h1 className="text-2xl md:text-3xl font-bold">{user.name}</h1>
                    <p className="text-[#00C49A] font-medium mb-1">@{user.username}</p>
                    <Badge variant="outline" className="bg-[#0056D2]/10 border-[#0056D2]/20 text-[#00C49A] px-3 py-1">
                      {user.role}
                    </Badge>
                  </div>

                  {/* Mobile Follow Button */}
                  <div className="flex gap-3 mt-4 md:hidden">
                    <Button 
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={isFollowing 
                        ? "bg-white/10 hover:bg-white/20 text-white" 
                        : "bg-gradient-to-r from-[#0056D2] to-[#00C49A] hover:opacity-90 text-white"}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                    <Button variant="outline" className="border-white/10 hover:bg-white/5">
                      <Mail size={18} />
                    </Button>
                  </div>
                  
                  {/* Mobile Profile Actions */}
                  <div className="flex gap-2 mt-4 md:hidden">
                    <Link href="/profile/edit">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-white/10 hover:bg-white/5 text-white"
                      >
                        <Edit size={14} className="mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Link href="/product/new">
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-[#0056D2] to-[#00C49A] hover:opacity-90 text-white"
                      >
                        <Package size={14} className="mr-1" />
                        Add Product
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Middle Section: Bio & Stats */}
                <div className="flex-1">
                  <p className="text-white/80 mb-6 md:mr-36">
                    {user.bio}
                  </p>

                  {/* User details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-white/70">
                      <MapPin size={16} className="text-[#00C49A]" />
                      <span>{user.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <Globe size={16} className="text-[#00C49A]" />
                      <a href={`https://${user.website}`} target="_blank" rel="noopener" className="hover:text-[#00C49A] transition-colors">
                        {user.website}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <Mail size={16} className="text-[#00C49A]" />
                      <a href={`mailto:${user.email}`} className="hover:text-[#00C49A] transition-colors">
                        {user.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <Calendar size={16} className="text-[#00C49A]" />
                      <span>Joined {user.joinDate}</span>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
                    <StatsCard3D title="Products" value={user.stats.products} color="#0056D2" />
                    <StatsCard3D title="Sales" value={user.stats.sold} color="#00C49A" />
                    <StatsCard3D title="Followers" value={user.stats.followers} color="#BB86FC" />
                    <StatsCard3D title="Following" value={user.stats.following} color="#4F46E5" />
                    <StatsCard3D 
                      title="Rating" 
                      value={user.stats.rating}
                      color="#FFD700" 
                    />
                  </div>
                </div>

                {/* Right Section: Actions & Badges (desktop only) */}
                <div className="hidden md:flex flex-col gap-4 items-end justify-start">
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={isFollowing 
                        ? "bg-white/10 hover:bg-white/20 text-white" 
                        : "bg-gradient-to-r from-[#0056D2] to-[#00C49A] hover:opacity-90 text-white"}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                    <Button variant="outline" className="border-white/10 hover:bg-white/5">
                      <Mail size={18} />
                    </Button>
                  </div>
                  
                  {/* Profile Actions */}
                  <div className="flex gap-3 mt-2">
                    <Link href="/profile/edit">
                      <Button 
                        variant="outline" 
                        className="border-white/10 hover:bg-white/5 text-white flex items-center gap-2"
                      >
                        <Edit size={16} />
                        <span>Edit Profile</span>
                      </Button>
                    </Link>
                    <Link href="/product/new">
                      <Button 
                        className="bg-gradient-to-r from-[#0056D2] to-[#00C49A] hover:opacity-90 text-white flex items-center gap-2"
                      >
                        <Package size={16} />
                        <span>Add Product</span>
                      </Button>
                    </Link>
                  </div>

                  {/* 3D Badges */}
                  <div className="flex flex-col gap-3 mt-2">
                    {user.badges.map((badge, index) => (
                      <Badge3D 
                        key={index} 
                        label={badge.name} 
                        icon={badge.icon} 
                        color={badge.color}
                        glowColor={`${badge.color}40`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile Badges */}
              <div className="flex gap-2 mt-6 flex-wrap md:hidden">
                {user.badges.map((badge, index) => (
                  <Badge3D 
                    key={index} 
                    label={badge.name} 
                    icon={badge.icon} 
                    color={badge.color}
                    glowColor={`${badge.color}40`}
                  />
                ))}
              </div>
            </div>

            {/* Seller Level Progress */}
            <div className="px-6 pb-6 md:px-8 md:pb-8 mt-4">
              <Card3D 
                className="w-full" 
                bgClassName="bg-[#1A1A3A]/90 backdrop-blur-sm"
              >
                <div className="p-4">
                  <div className="flex justify-between mb-2">
                    <div>
                      <span className="text-[#00C49A] font-semibold">Level 4: Enterprise Seller</span>
                      <p className="text-sm text-white/60">72% progress to Level 5</p>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-semibold">72 / 100</span>
                      <p className="text-sm text-white/60">Points</p>
                    </div>
                  </div>
                  
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-[#0056D2] to-[#00C49A] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressValue}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </Card3D>
            </div>
          </Card3D>

          {/* Main Content Tabs */}
          <div className="mt-8">
            <Tabs defaultValue="products" onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-[#131340]/90 backdrop-blur-md border border-white/5 p-1 mb-6">
                <TabsTrigger value="products" className="flex gap-2 items-center data-[state=active]:bg-[#0056D2] data-[state=active]:text-white">
                  <Package size={16} />
                  <span>Products</span>
                </TabsTrigger>
                <TabsTrigger value="purchases" className="flex gap-2 items-center data-[state=active]:bg-[#0056D2] data-[state=active]:text-white">
                  <ShoppingBag size={16} />
                  <span>Purchases</span>
                </TabsTrigger>
                <TabsTrigger value="saved" className="flex gap-2 items-center data-[state=active]:bg-[#0056D2] data-[state=active]:text-white">
                  <Bookmark size={16} />
                  <span>Saved</span>
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex gap-2 items-center data-[state=active]:bg-[#0056D2] data-[state=active]:text-white">
                  <Clock size={16} />
                  <span>Activity</span>
                </TabsTrigger>
                <TabsTrigger value="stats" className="flex gap-2 items-center data-[state=active]:bg-[#0056D2] data-[state=active]:text-white">
                  <BarChart3 size={16} />
                  <span>Stats</span>
                </TabsTrigger>
              </TabsList>

              {/* Products Tab */}
              <TabsContent value="products" className="mt-0">
                <div className="flex items-center justify-between mb-6">
                  <motion.h2 
                    className="text-2xl font-bold"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    My Products
                  </motion.h2>
                  <Link href="/product/new">
                    <Button className="bg-gradient-to-r from-[#0056D2] to-[#00C49A] hover:opacity-90 text-white">
                      Add New Product
                    </Button>
                  </Link>
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <Card3D key={i} className="h-72">
                        <div className="h-full animate-pulse" />
                      </Card3D>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <ProductCard product={product} index={index} />
                      </motion.div>
                    ))}
                  </div>
                )}

                <div className="mt-6 text-center">
                  <Button variant="outline" className="border-white/10 hover:bg-white/5">
                    View All Products
                  </Button>
                </div>
              </TabsContent>

              {/* Other tabs content */}
              <TabsContent value="purchases" className="mt-0">
                <div className="flex items-center justify-between mb-6">
                  <motion.h2 
                    className="text-2xl font-bold"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    My Purchases
                  </motion.h2>
                  <Link href="/explore">
                    <Button variant="outline" className="border-white/10 hover:bg-white/5">
                      Browse More
                    </Button>
                  </Link>
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                      <Card3D key={i} className="h-72">
                        <div className="h-full animate-pulse" />
                      </Card3D>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userPurchases.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <ProductCard product={product} index={index} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Activity */}
              <TabsContent value="activity" className="mt-0">
                <div className="flex items-center justify-between mb-6">
                  <motion.h2 
                    className="text-2xl font-bold"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    Recent Activity
                  </motion.h2>
                  <Button variant="outline" className="border-white/10 hover:bg-white/5">
                    View All
                  </Button>
                </div>

                <Card3D 
                  className="w-full overflow-hidden" 
                  bgClassName="bg-[#131340]/90 backdrop-blur-sm"
                >
                  {user.activity.map((item, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex items-center gap-4">
                        <motion.div 
                          className="h-10 w-10 rounded-full bg-[#0056D2]/20 flex items-center justify-center"
                          whileHover={{ scale: 1.1, backgroundColor: "rgba(0, 86, 210, 0.3)" }}
                        >
                          <Clock size={18} className="text-[#0056D2]" />
                        </motion.div>
                        <div>
                          <p className="font-medium">{item.action}</p>
                          <p className="text-sm text-white/60">{item.time}</p>
                        </div>
                      </div>
                      <Link href={item.link}>
                        <Button variant="ghost" size="sm" className="text-[#0056D2]">
                          <ChevronRight size={16} />
                        </Button>
                      </Link>
                    </motion.div>
                  ))}
                </Card3D>
              </TabsContent>

              {/* Stats */}
              <TabsContent value="stats" className="mt-0">
                <div className="flex items-center justify-between mb-6">
                  <motion.h2 
                    className="text-2xl font-bold"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    Performance Stats
                  </motion.h2>
                  <Button variant="outline" className="border-white/10 hover:bg-white/5">
                    Download Report
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Earnings Card */}
                  <Card3D 
                    className="w-full" 
                    bgClassName="bg-[#131340]/90 backdrop-blur-sm"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">Monthly Earnings</h3>
                        <Button variant="ghost" size="sm" className="text-[#0056D2]">
                          View Details
                        </Button>
                      </div>
                      
                      <motion.div 
                        className="flex items-end gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <div className="text-3xl font-bold">$12,480</div>
                        <div className="text-[#00C49A] text-sm font-medium flex items-center">
                          ↑ 24% from last month
                        </div>
                      </motion.div>
                      
                      <div className="mt-6 grid grid-cols-3 gap-4">
                        <motion.div 
                          className="bg-white/5 rounded-lg p-3"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.3 }}
                          whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                        >
                          <div className="text-sm text-white/60">Today</div>
                          <div className="font-bold">$580</div>
                        </motion.div>
                        <motion.div 
                          className="bg-white/5 rounded-lg p-3"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.4 }}
                          whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                        >
                          <div className="text-sm text-white/60">This Week</div>
                          <div className="font-bold">$3,240</div>
                        </motion.div>
                        <motion.div 
                          className="bg-white/5 rounded-lg p-3"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.5 }}
                          whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                        >
                          <div className="text-sm text-white/60">This Month</div>
                          <div className="font-bold">$12,480</div>
                        </motion.div>
                      </div>
                    </div>
                  </Card3D>

                  {/* Customer Rating Card */}
                  <Card3D 
                    className="w-full" 
                    bgClassName="bg-[#131340]/90 backdrop-blur-sm"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">Customer Ratings</h3>
                        <Button variant="ghost" size="sm" className="text-[#0056D2]">
                          View All
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <motion.div 
                          className="text-center"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        >
                          <div className="text-4xl font-bold flex items-center justify-center">
                            {user.stats.rating}
                            <Star size={24} className="text-yellow-400 ml-1" fill="currentColor" />
                          </div>
                          <div className="text-sm text-white/60 mt-1">Overall Rating</div>
                        </motion.div>
                        
                        <div className="flex-1 space-y-2">
                          {[5, 4, 3, 2, 1].map((star, index) => (
                            <motion.div 
                              key={star} 
                              className="flex items-center gap-2"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                            >
                              <div className="text-sm w-2">{star}</div>
                              <Star size={12} className="text-yellow-400" fill="currentColor" />
                              <div className="h-1.5 bg-white/10 flex-1 rounded-full overflow-hidden">
                                <motion.div 
                                  className="h-full bg-yellow-400 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${100 - (5 - star) * 20 - Math.floor(Math.random() * 10)}%` }}
                                  transition={{ duration: 1, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                                />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card3D>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </motion.div>
    </div>
  );
}