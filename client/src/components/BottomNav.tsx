import { motion } from "framer-motion";
import { Link } from "wouter";
import { Compass, ShoppingCart, Tag } from "lucide-react";

export default function BottomNav() {
  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 bg-[#0A0A23]/95 backdrop-blur-lg border-t border-[#4F46E5]/10 py-3 z-50 md:hidden"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center">
          <Link href="/explore" className="flex flex-col items-center">
            <motion.div 
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full bg-[#4F46E5]/10 flex items-center justify-center text-[#4F46E5]"
            >
              <Compass size={22} />
            </motion.div>
            <span className="text-xs mt-1 font-medium">Explore</span>
          </Link>
          
          <Link href="/buy" className="flex flex-col items-center">
            <motion.div 
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full bg-[#4F46E5]/10 flex items-center justify-center text-[#4F46E5]"
            >
              <ShoppingCart size={22} />
            </motion.div>
            <span className="text-xs mt-1 font-medium">Buy</span>
          </Link>
          
          <Link href="/sell" className="flex flex-col items-center">
            <motion.div 
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full bg-[#4F46E5]/10 flex items-center justify-center text-[#4F46E5]"
            >
              <Tag size={22} />
            </motion.div>
            <span className="text-xs mt-1 font-medium">Sell</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}