import { motion } from "framer-motion";
import { ProductCard } from "./ui/product-card";
import { Product } from "../schema";
import { Skeleton } from "./ui/skeleton";
import { staggerContainer, fadeIn } from "../lib/utils";
import { Button } from "./ui/button";
import { Search, Sliders, Star, TrendingUp, Clock, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface ProductsSectionProps {
  products: Product[];
  isLoading: boolean;
}

// Product categories for filtering
const CATEGORIES = [
  "All",
  "Templates",
  "E-books",
  "Courses",
  "Graphics",
  "Software",
  "APIs"
];

export default function ProductsSection({ products, isLoading }: ProductsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [activeTab, setActiveTab] = useState("trending");

  // Apply filters whenever dependencies change
  useEffect(() => {
    let result = [...products];
    
    // Apply category filter
    if (selectedCategory !== "All") {
      result = result.filter(product => 
        product.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }
    
    // Apply sort based on active tab
    switch (activeTab) {
      case "trending":
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "newest":
        // In a real app you'd sort by date
        result.sort((a, b) => b.id - a.id);
        break;
      case "popular":
        // In a real app you'd sort by reviews/ratings
        result.sort((a, b) => a.id - b.id);
        break;
    }
    
    setFilteredProducts(result);
  }, [products, selectedCategory, searchQuery, activeTab]);

  return (
    <section id="products" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#121212] via-black to-[#121212] pointer-events-none"></div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-xl"
          >
            <Badge className="mb-3 px-3 py-1 bg-[#BB86FC]/20 text-[#BB86FC] border-none">
              Marketplace
            </Badge>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Discover <span className="text-[#BB86FC]">Premium</span> Digital Products
            </h2>
            <p className="text-[#A0A0A0] text-lg">
              Exclusive assets from verified creators, ready to elevate your projects
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-6 md:mt-0 flex items-center"
          >
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A0A0A0]" size={18} />
              <Input 
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full glass border-white/10 focus:border-[#BB86FC]/50 w-full md:w-[240px]"
              />
            </div>
            <Button variant="outline" size="icon" className="ml-2 rounded-full glass border-white/10 hover:bg-white/5">
              <Sliders size={18} />
            </Button>
          </motion.div>
        </div>
        
        <motion.div
          variants={fadeIn("up", "tween", 0.3, 0.7)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex gap-2 overflow-x-auto pb-2 category-scroll">
              {CATEGORIES.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-1 h-auto whitespace-nowrap text-sm ${
                    selectedCategory === category
                      ? "bg-[#BB86FC] hover:bg-[#BB86FC]/90 text-black"
                      : "glass border-white/10 hover:bg-white/5"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
            
            <Tabs 
              defaultValue="trending" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full md:w-auto mt-4 md:mt-0"
            >
              <TabsList className="grid grid-cols-3 bg-[#1E1E1E] rounded-full p-1">
                <TabsTrigger 
                  value="trending" 
                  className="rounded-full data-[state=active]:bg-[#BB86FC] data-[state=active]:text-black"
                >
                  <TrendingUp size={15} className="mr-1" /> Trending
                </TabsTrigger>
                <TabsTrigger 
                  value="newest" 
                  className="rounded-full data-[state=active]:bg-[#BB86FC] data-[state=active]:text-black"
                >
                  <Clock size={15} className="mr-1" /> Newest
                </TabsTrigger>
                <TabsTrigger 
                  value="popular" 
                  className="rounded-full data-[state=active]:bg-[#BB86FC] data-[state=active]:text-black"
                >
                  <Star size={15} className="mr-1" /> Popular
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </motion.div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-[#1E1E1E]/40 rounded-xl p-6 h-full border border-white/5">
                <div className="flex items-center mb-4">
                  <Skeleton className="h-12 w-12 rounded-full bg-white/10" />
                  <Skeleton className="h-6 w-32 ml-3 bg-white/10" />
                </div>
                <Skeleton className="h-4 w-full mb-3 bg-white/10" />
                <Skeleton className="h-4 w-4/5 mb-3 bg-white/10" />
                <Skeleton className="h-4 w-2/3 mb-6 bg-white/10" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-10 w-20 bg-white/10 rounded-full" />
                  <Skeleton className="h-10 w-10 bg-white/10 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-20 h-20 bg-[#1E1E1E] rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={32} className="text-[#BB86FC]" />
            </div>
            <h3 className="text-2xl font-heading font-semibold mb-2">No products found</h3>
            <p className="text-[#A0A0A0] max-w-md mx-auto mb-8">
              We couldn't find any products matching your criteria. Try adjusting your filters or search term.
            </p>
            <Button 
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="rounded-full px-6 py-2 bg-[#BB86FC] hover:bg-[#BB86FC]/90 text-black"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <motion.div 
            variants={staggerContainer()}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 product-grid"
          >
            {filteredProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                index={index} 
              />
            ))}
          </motion.div>
        )}
        
        <div className="text-center mt-16">
          <Button 
            variant="outline"
            className="glass px-8 py-6 rounded-full text-white inline-flex items-center gap-2 transition-all duration-300 hover:bg-white/10 border-white/10 hover:border-[#BB86FC]/30"
          >
            <Zap size={16} className="text-[#BB86FC]" />
            Get AI Recommendations
          </Button>
        </div>
      </div>
    </section>
  );
}
