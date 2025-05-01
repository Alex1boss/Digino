import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { Product } from "../../schema";
import { useLocation } from "wouter";
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
  const [, setLocation] = useLocation();

  // Render uploaded image or fallback to an icon
  const renderIconOrImage = () => {
    // If there's a custom icon (uploaded image), use it
    if (product.customIcon) {
      return (
        <div className="w-full h-full rounded-xl overflow-hidden">
          <img 
            src={product.customIcon} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
    
    // Otherwise use the coverImage or imageUrl if available
    if (product.coverImage || product.imageUrl) {
      return (
        <div className="w-full h-full rounded-xl overflow-hidden">
          <img 
            src={product.coverImage || product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
    
    // Fallback to icon if no images are available
    switch (product.iconName?.toLowerCase()) {
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
        // If there's an Icon component, use it
        return product.Icon ? <product.Icon className="w-7 h-7" /> : <Cpu className="w-7 h-7" />;
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
            "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 overflow-hidden shadow-md",
            product.customIcon || product.coverImage || product.imageUrl
              ? "p-0 border-2 border-white/10" // Special styling for images
              : isBlueAccent
                ? "text-[#4F46E5] bg-[#4F46E5]/10"
                : "text-[#4F46E5] bg-[#4F46E5]/5"
          )}
          style={{
            boxShadow: (product.customIcon || product.coverImage || product.imageUrl) 
              ? "0 4px 12px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.05)" 
              : undefined
          }}
        >
          {renderIconOrImage()}
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
        
        {/* Display product price */}
        {product.price && !product.isFree && (
          <>
            <div className="h-4 w-px bg-white/10 mr-3 ml-3"></div>
            <div className="text-green-400 font-medium text-sm">
              ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
            </div>
          </>
        )}
      </div>
      
      <p className="text-[#A0A0A0] text-sm mb-6 flex-grow">{product.description}</p>
      
      <motion.button 
        onClick={() => {
          console.log("Navigating to product:", product.id);
          setLocation(`/product/${product.id}`);
        }} 
        className="premium-button w-full text-center mt-auto flex items-center justify-center"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>{product.ctaText || "View Details"}</span>
        <ChevronRight className="w-4 h-4 ml-1" />
      </motion.button>
    </motion.div>
  );
}