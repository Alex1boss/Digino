import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Product } from "@shared/schema";
import { 
  ChevronRight, 
  Box, 
  Code, 
  Cpu, 
  Rocket, 
  Users, 
  Mic 
} from "lucide-react";

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const isBlueAccent = index % 2 !== 0;

  // Render the appropriate icon based on the iconName
  const renderIcon = () => {
    switch (product.iconName) {
      case "box":
        return <Box className="w-7 h-7" />;
      case "code":
        return <Code className="w-7 h-7" />;
      case "cpu":
        return <Cpu className="w-7 h-7" />;
      case "rocket":
        return <Rocket className="w-7 h-7" />;
      case "users":
        return <Users className="w-7 h-7" />;
      case "mic":
        return <Mic className="w-7 h-7" />;
      default:
        return <Cpu className="w-7 h-7" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: "easeOut" 
      }}
      className={cn(
        "premium-card p-6 transition-all duration-300 h-full flex flex-col",
        isBlueAccent ? "border-[#4F46E5]/20" : "border-[#4F46E5]/10"
      )}
      whileHover={{ 
        y: -4,
        scale: 1.02
      }}
    >
      <div className="flex items-center mb-5">
        <div 
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
            isBlueAccent
              ? "text-[#4F46E5] bg-[#4F46E5]/10"
              : "text-[#4F46E5] bg-[#4F46E5]/5"
          )}
        >
          {renderIcon()}
        </div>
        <h3 className="text-xl ml-3 font-semibold text-white">
          {product.name}
        </h3>
      </div>
      
      {product.isFree && (
        <div className="absolute top-4 right-4 premium-badge">
          FREE
        </div>
      )}
      
      <div className="flex items-center mb-3">
        <div className="flex items-center mr-3">
          <div className="text-yellow-400 mr-1">★</div>
          <span className="text-xs text-white/80">4.9</span>
        </div>
        <div className="h-4 w-px bg-white/10 mr-3"></div>
        <span className="text-xs text-white/80">
          {index % 2 === 0 ? "Trending" : "Top Rated"}
        </span>
      </div>
      
      <p className="text-[#A0A0A0] text-sm mb-6 flex-grow">{product.description}</p>
      
      <motion.a 
        href={product.link} 
        className="premium-button w-full text-center mt-auto flex items-center justify-center"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>{product.ctaText}</span>
        <ChevronRight className="w-4 h-4 ml-1" />
      </motion.a>
    </motion.div>
  );
}