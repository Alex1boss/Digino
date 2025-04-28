import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Tag, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductForm3D from "@/components/ProductForm3D";

export default function Sell() {
  const [showForm, setShowForm] = useState(false);
  
  const handleListProduct = () => {
    setShowForm(true);
  };
  
  return (
    <div className="min-h-screen bg-[#0A0A23]">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-32">
        <AnimatePresence mode="wait">
          {!showForm ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="premium-card p-8 text-center"
            >
              <h1 className="text-3xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#4F46E5] to-[#6366F1]">
                Sell Your AI Products
              </h1>
              <p className="text-[#6B7280] max-w-2xl mx-auto mb-8">
                List your AI tools and reach thousands of potential customers in our marketplace.
              </p>
              
              <div className="w-32 h-32 mx-auto bg-[#4F46E5]/10 rounded-full flex items-center justify-center text-[#4F46E5]">
                <Tag size={48} />
              </div>
              
              <div className="mt-8">
                <motion.button
                  onClick={handleListProduct}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="premium-button px-8 py-4 flex items-center justify-center mx-auto"
                >
                  <span>List New Product</span>
                  <ChevronRight className="ml-2 w-5 h-5" />
                </motion.button>
              </div>
              
              <div className="text-[#6B7280] mt-12 p-6 bg-[#4F46E5]/5 rounded-lg max-w-md mx-auto">
                <h3 className="font-medium text-white mb-3">Seller Benefits</h3>
                <ul className="text-left text-sm space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#22C55E] mr-2">✓</span>
                    <span>Access to global AI marketplace with thousands of buyers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#22C55E] mr-2">✓</span>
                    <span>Simple product listing process with 3D interactive interface</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#22C55E] mr-2">✓</span>
                    <span>Secure payment processing with instant payouts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#22C55E] mr-2">✓</span>
                    <span>Detailed sales analytics dashboard and customer insights</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <ProductForm3D />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}