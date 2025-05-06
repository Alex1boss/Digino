import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import ProductsSection from "../components/ProductsSection";
import FeaturesSection from "../components/FeaturesSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import { useQuery } from "@tanstack/react-query";
import { Product, getIconComponent } from "../schema";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, staggerContainer } from "../lib/utils";

export default function Home() {
  const [location] = useLocation();
  const [showHero, setShowHero] = useState(true);
  const [activeTab, setActiveTab] = useState(location === "/" ? "home" : "explore");
  // Get products from database via API
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      console.log("Products loaded from database:", data.length);
      
      // Make sure every product has a valid Icon component and other required properties
      return data.map((product: any) => ({
        ...product,
        Icon: getIconComponent(product.iconName || 'cpu'),
        // Ensure these properties exist for consistent UI rendering
        currency: product.currency || "USD",
        rating: product.rating || 0,
        reviews: product.reviews || 0,
        sales: product.sales || 0,
        // Make sure coverImage is set if we have productImages
        coverImage: product.coverImage || (product.productImages && product.productImages.length > 0 ? product.productImages[0] : "")
      }));
    }
  });

  // Update the active tab when the location changes
  useEffect(() => {
    setActiveTab(location === "/" ? "home" : "explore");
    
    // Only show hero on home page or initial load
    setShowHero(location === "/" || location === "");
    
    // Scroll to products section when on explore page
    if (location === "/explore") {
      const productsSection = document.getElementById("products");
      if (productsSection) {
        setTimeout(() => {
          productsSection.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Test button for direct navigation */}
      <div className="fixed top-20 right-4 z-50">
        <a href="/buying" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Test Buying Page
        </a>
      </div>
      <main className="pt-24 pb-16">
        <AnimatePresence>
          {showHero && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
            >
              <HeroSection />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Unified products section with expanded features for explore mode */}
        <ProductsSection 
          products={products || []} 
          isLoading={isLoading} 
          isExploreMode={activeTab === "explore"}
        />
        
        {activeTab === "home" && (
          <>
            <FeaturesSection />
            <CTASection />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
