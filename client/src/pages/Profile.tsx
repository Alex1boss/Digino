import { useEffect, useState, useRef } from "react";
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
  Instagram, 
  LinkedIn, 
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
  TrendingUp
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/ui/product-card";
import { useQuery } from "@tanstack/react-query";
import { type Product } from "@/schema";
import { cn } from "@/lib/utils";

export default function Profile() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [progressValue, setProgressValue] = useState(72);
  const [activeTab, setActiveTab] = useState("products");

  // Animate progress bar on load
  useEffect(() => {
    const timer = setTimeout(() => setProgressValue(72), 500);
    return () => clearTimeout(timer);
  }, []);

  // Mock user data
  const user = {
    name: "Alex Johnson",
    username: "alexjohnson",
    avatar: "/avatar-placeholder.svg",
    role: "Enterprise Seller",
    bio: "Expert in creating premium digital products. Passionate about AI, design, and creating tools that help businesses grow.",
    location: "San Francisco, CA",
    website: "alexjohnson.design",
    email: "alex@example.com",
    joinDate: "June 2021",
    stats: {
      products: 24,
      sold: 1452,
      followers: 8590,
      following: 345,
      rating: 4.9
    },
    badges: [
      { name: "Verified Seller", icon: Shield, color: "#0056D2" },
      { name: "Top Rated", icon: Award, color: "#00C49A" },
      { name: "Expert", icon: Star, color: "#BB86FC" },
    ],
    activity: [
      { action: "Created new product", time: "2 hours ago", link: "#" },
      { action: "Updated profile information", time: "Yesterday", link: "#" },
      { action: "Earned Top Seller Badge", time: "3 days ago", link: "#" },
      { action: "Sold 100th product", time: "1 week ago", link: "#" },
    ]
  };

  // Get products data
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Filter products for this user
  const userProducts = products.slice(0, 6);
  const userPurchases = products.slice(2, 5);
  const userSaved = products.slice(1, 4);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A1E] to-[#0B0B2E] text-white">
      {/* Header with background gradient */}
      <div className="h-48 md:h-72 bg-gradient-to-r from-[#0056D2]/20 to-[#00C49A]/20 relative">
        <div className="absolute inset-0 bg-[url('/profile-header-pattern.svg')] bg-cover bg-center opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        {/* Profile Header Section */}
        <div className="relative -mt-24 md:-mt-32">
          <div className="bg-[#131340] rounded-2xl shadow-xl border border-white/5 backdrop-blur-sm overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                {/* Avatar and Basic Info */}
                <div className="flex flex-col items-center md:items-start">
                  {/* Avatar with glow effect */}
                  <div className="relative">
                    <div className="h-32 w-32 rounded-full bg-gradient-to-br from-[#0056D2] to-[#00C49A] flex items-center justify-center text-white text-5xl font-bold shadow-2xl border-4 border-[#131340]">
                      {user.name.charAt(0)}
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#0056D2] to-[#00C49A] rounded-full blur opacity-30 -z-10"></div>
                    
                    {/* Verified badge */}
                    <div className="absolute bottom-0 right-0 bg-[#0056D2] h-8 w-8 rounded-full flex items-center justify-center border-2 border-[#131340]">
                      <Shield size={16} className="text-white" />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col items-center md:items-start">
                    <h1 className="text-2xl md:text-3xl font-bold">{user.name}</h1>
                    <p className="text-[#00C49A] font-medium mb-1">@{user.username}</p>
                    <Badge variant="outline" className="bg-[#0056D2]/10 border-[#0056D2]/20 text-[#00C49A] px-3 py-1">
                      {user.role}
                    </Badge>
                  </div>

                  {/* Mobile Follow Button - visible only on mobile */}
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
                      <a href={\`https://\${user.website}\`} target="_blank" rel="noopener" className="hover:text-[#00C49A] transition-colors">
                        {user.website}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <Mail size={16} className="text-[#00C49A]" />
                      <a href={\`mailto:\${user.email}\`} className="hover:text-[#00C49A] transition-colors">
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
                    <div className="bg-white/5 rounded-xl p-3 flex flex-col items-center justify-center border border-white/10">
                      <span className="text-xl md:text-2xl font-bold">{user.stats.products}</span>
                      <span className="text-xs text-white/60">Products</span>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 flex flex-col items-center justify-center border border-white/10">
                      <span className="text-xl md:text-2xl font-bold">{user.stats.sold}</span>
                      <span className="text-xs text-white/60">Sales</span>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 flex flex-col items-center justify-center border border-white/10">
                      <span className="text-xl md:text-2xl font-bold">{user.stats.followers}</span>
                      <span className="text-xs text-white/60">Followers</span>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 flex flex-col items-center justify-center border border-white/10">
                      <span className="text-xl md:text-2xl font-bold">{user.stats.following}</span>
                      <span className="text-xs text-white/60">Following</span>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 flex flex-col items-center justify-center border border-white/10">
                      <div className="flex items-center">
                        <span className="text-xl md:text-2xl font-bold">{user.stats.rating}</span>
                        <Star size={16} className="text-yellow-400 ml-1" fill="currentColor" />
                      </div>
                      <span className="text-xs text-white/60">Rating</span>
                    </div>
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

                  {/* Seller Badges */}
                  <div className="flex flex-col gap-3 mt-2">
                    {user.badges.map((badge, index) => (
                      <div key={index} className="flex items-center gap-2 bg-[#1A1A3A] rounded-lg px-3 py-2 border border-white/5">
                        <badge.icon size={18} style={{ color: badge.color }} />
                        <span className="text-sm font-medium">{badge.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile Badges - visible only on mobile */}
              <div className="flex gap-2 mt-6 flex-wrap md:hidden">
                {user.badges.map((badge, index) => (
                  <div key={index} className="flex items-center gap-2 bg-[#1A1A3A] rounded-lg px-3 py-2 border border-white/5">
                    <badge.icon size={18} style={{ color: badge.color }} />
                    <span className="text-sm font-medium">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Seller Level Progress */}
            <div className="px-6 pb-6 md:px-8 md:pb-8 mt-4">
              <div className="bg-[#1A1A3A] rounded-lg p-4 border border-white/5">
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
                <Progress value={progressValue} className="h-2 bg-white/10" indicatorClassName="bg-gradient-to-r from-[#0056D2] to-[#00C49A]" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="mt-8">
          <Tabs defaultValue="products" onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-[#131340] border border-white/5 p-1 mb-6">
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
                <h2 className="text-2xl font-bold">My Products</h2>
                <Link href="/sell">
                  <Button className="bg-gradient-to-r from-[#0056D2] to-[#00C49A] hover:opacity-90 text-white">
                    Add New Product
                  </Button>
                </Link>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-72 bg-[#131340] rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              )}

              <div className="mt-6 text-center">
                <Button variant="outline" className="border-white/10 hover:bg-white/5">
                  View All Products
                </Button>
              </div>
            </TabsContent>

            {/* Purchases Tab */}
            <TabsContent value="purchases" className="mt-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">My Purchases</h2>
                <Link href="/explore">
                  <Button variant="outline" className="border-white/10 hover:bg-white/5">
                    Browse More
                  </Button>
                </Link>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-72 bg-[#131340] rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userPurchases.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Saved Tab */}
            <TabsContent value="saved" className="mt-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Saved Items</h2>
                <Button variant="outline" className="border-white/10 hover:bg-white/5">
                  Clear All
                </Button>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-72 bg-[#131340] rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userSaved.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="mt-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Recent Activity</h2>
                <Button variant="outline" className="border-white/10 hover:bg-white/5">
                  View All
                </Button>
              </div>

              <div className="bg-[#131340] rounded-2xl border border-white/5 overflow-hidden">
                {user.activity.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-[#0056D2]/20 flex items-center justify-center">
                        <Clock size={18} className="text-[#0056D2]" />
                      </div>
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
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Stats Tab */}
            <TabsContent value="stats" className="mt-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Performance Stats</h2>
                <Button variant="outline" className="border-white/10 hover:bg-white/5">
                  Download Report
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Earnings Card */}
                <div className="bg-[#131340] rounded-2xl border border-white/5 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Monthly Earnings</h3>
                    <Button variant="ghost" size="sm" className="text-[#0056D2]">
                      View Details
                    </Button>
                  </div>
                  <div className="flex items-end gap-4">
                    <div className="text-3xl font-bold">$12,480</div>
                    <div className="text-[#00C49A] text-sm font-medium flex items-center">
                      ↑ 24% from last month
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-sm text-white/60">Today</div>
                      <div className="font-bold">$580</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-sm text-white/60">This Week</div>
                      <div className="font-bold">$3,240</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-sm text-white/60">This Month</div>
                      <div className="font-bold">$12,480</div>
                    </div>
                  </div>
                </div>

                {/* Visitor Stats Card */}
                <div className="bg-[#131340] rounded-2xl border border-white/5 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Profile Visitors</h3>
                    <Button variant="ghost" size="sm" className="text-[#0056D2]">
                      View Details
                    </Button>
                  </div>
                  <div className="flex items-end gap-4">
                    <div className="text-3xl font-bold">3,842</div>
                    <div className="text-[#00C49A] text-sm font-medium flex items-center">
                      ↑ 12% from last week
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-sm text-white/60">Unique</div>
                      <div className="font-bold">2,124</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-sm text-white/60">Conversion</div>
                      <div className="font-bold">4.2%</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-sm text-white/60">Bounce Rate</div>
                      <div className="font-bold">28%</div>
                    </div>
                  </div>
                </div>

                {/* Top Products Card */}
                <div className="bg-[#131340] rounded-2xl border border-white/5 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Top Products</h3>
                    <Button variant="ghost" size="sm" className="text-[#0056D2]">
                      View All
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {userProducts.slice(0, 3).map((product, index) => (
                      <div key={index} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#0056D2] to-[#00C49A]/50 flex items-center justify-center shrink-0">
                          <product.Icon size={20} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{product.name}</div>
                          <div className="text-sm text-white/60">{product.sold} sales</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">${product.price}</div>
                          <div className="text-xs text-[#00C49A]">+{Math.floor(Math.random() * 30)}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Rating Card */}
                <div className="bg-[#131340] rounded-2xl border border-white/5 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Customer Ratings</h3>
                    <Button variant="ghost" size="sm" className="text-[#0056D2]">
                      View All
                    </Button>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold flex items-center justify-center">
                        {user.stats.rating}
                        <Star size={24} className="text-yellow-400 ml-1" fill="currentColor" />
                      </div>
                      <div className="text-sm text-white/60 mt-1">Overall Rating</div>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-2">
                          <div className="text-sm w-2">{star}</div>
                          <Star size={12} className="text-yellow-400" fill="currentColor" />
                          <Progress 
                            value={100 - (5 - star) * 20 - Math.floor(Math.random() * 10)} 
                            className="h-1.5 bg-white/10 flex-1" 
                            indicatorClassName="bg-yellow-400" 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}