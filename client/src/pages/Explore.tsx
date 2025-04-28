import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

export default function Explore() {
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
            Explore AI Tools
          </h1>
          <p className="text-[#6B7280] max-w-2xl mx-auto mb-6">
            Discover the most innovative AI-powered tools and products for your business and personal needs.
          </p>
          
          <div className="w-32 h-32 mx-auto bg-[#4F46E5]/10 rounded-full flex items-center justify-center text-[#4F46E5]">
            <span className="text-4xl">🔍</span>
          </div>
          
          <p className="text-[#6B7280] mt-8">
            Coming soon... more exploration features
          </p>
        </motion.div>
      </div>
    </div>
  );
}