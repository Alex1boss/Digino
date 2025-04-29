import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { ShoppingCart } from "lucide-react";
import { Button } from "../components/ui/button";

export default function Buy() {
  return (
    <div className="min-h-screen bg-[#0A0A23]">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="premium-card p-8 text-center"
        >
          <h1 className="text-3xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#4F46E5] to-[#6366F1]">
            Buy AI Products
          </h1>
          <p className="text-[#6B7280] max-w-2xl mx-auto mb-6">
            Browse and purchase the latest AI-powered tools to enhance your workflow.
          </p>
          
          <div className="w-32 h-32 mx-auto bg-[#4F46E5]/10 rounded-full flex items-center justify-center text-[#4F46E5]">
            <ShoppingCart size={48} />
          </div>
          
          <div className="mt-8">
            <Button className="premium-button">
              View Shopping Cart
            </Button>
          </div>
          
          <p className="text-[#6B7280] mt-8">
            Coming soon... full shopping cart functionality
          </p>
        </motion.div>
      </div>
    </div>
  );
}