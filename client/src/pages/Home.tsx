import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import ProductsSection from "../components/ProductsSection";
import FeaturesSection from "../components/FeaturesSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import { useQuery } from "@tanstack/react-query";
import { Product } from "../schema";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, staggerContainer } from "../lib/utils";

export default function Home() {
  const [location] = useLocation();
  const [showHero, setShowHero] = useState(true);
  const [activeTab, setActiveTab] = useState(location === "/" ? "home" : "explore");
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  
  // Get products from API
  const { data: apiProducts, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });
  
  // Also load products from localStorage
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('products');
      if (savedProducts) {
        const parsedProducts = JSON.parse(savedProducts);
        console.log("Products loaded from localStorage:", parsedProducts);
        
        // Import needed for the getIconComponent function
        import("../schema").then(({ getIconComponent }) => {
          // Add Icon property to each product from localStorage
          const productsWithIcons = parsedProducts.map((product: any) => ({
            ...product,
            Icon: getIconComponent(product.iconName || "Zap")
          }));
          
          setLocalProducts(productsWithIcons);
        });
      }
    } catch (error) {
      console.error("Error loading products from localStorage:", error);
    }
  }, []);

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
          products={[...(apiProducts || []), ...localProducts]} 
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
