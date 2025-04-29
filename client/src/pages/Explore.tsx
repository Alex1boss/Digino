import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import ProductsSection from "../components/ProductsSection";
import { Product } from "../schema";
import { useQuery } from "@tanstack/react-query";
import { getIconComponent } from "../schema";

export default function Explore() {
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
  
  // Show loading or no products message if needed
  const showEmptyState = !isLoading && allProducts.length === 0;
  
  return (
    <div className="min-h-screen bg-[#0A0A23]">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-semibold mb-6 text-white text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4F46E5] to-[#6366F1]">
              Explore Digital Products
            </span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto mb-8 text-center">
            Discover the most innovative tools and products for your business and personal needs.
          </p>
        </motion.div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-2 border-white/20 border-t-[#4F46E5] rounded-full animate-spin"></div>
          </div>
        ) : showEmptyState ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="premium-card p-8 text-center"
          >
            <div className="w-32 h-32 mx-auto bg-[#4F46E5]/10 rounded-full flex items-center justify-center text-[#4F46E5]">
              <span className="text-4xl">🔍</span>
            </div>
            <h2 className="text-xl font-medium text-white mt-6 mb-2">No Products Found</h2>
            <p className="text-white/60 max-w-md mx-auto">
              Be the first to publish a product! Go to the Sell page to add your digital masterpiece.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ProductsSection 
              products={allProducts} 
              isLoading={isLoading} 
              isExploreMode={true}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}