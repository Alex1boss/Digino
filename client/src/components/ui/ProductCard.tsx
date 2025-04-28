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
        "glass-card p-6 transition-all duration-500 h-full flex flex-col border-glow card-3d-effect",
        isBlueAccent ? "card-hover-blue" : "card-hover"
      )}
      whileHover={{ 
        y: -5, 
        rotateX: isBlueAccent ? 2 : -2, 
        rotateY: isBlueAccent ? 5 : -5,
        z: 10
      }}
    >
      <div className="flex items-center mb-4 card-3d-content">
        <div 
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
            isBlueAccent
              ? "text-[#00CFFF] bg-[#00CFFF]/10 glow-effect-blue"
              : "text-[#BB86FC] bg-[#BB86FC]/10 glow-effect"
          )}
        >
          {renderIcon()}
        </div>
        <h3 className={cn(
          "text-xl ml-3 font-heading font-medium", 
          isBlueAccent ? "text-shadow-blue-glow" : "text-shadow-glow"
        )}>
          {product.name}
        </h3>
      </div>
      
      {product.isFree && (
        <motion.div 
          className="absolute top-3 right-3 bg-gradient-to-r from-[#00CFFF]/90 to-[#00CFFF]/70 text-white text-xs font-bold px-3 py-1 rounded-full"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ 
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          FREE
        </motion.div>
      )}
      
      <p className="text-[#A0A0A0] text-sm mb-6 flex-grow card-3d-content">{product.description}</p>
      
      <motion.a 
        href={product.link} 
        className={cn(
          "mt-auto flex items-center text-sm font-medium transition-all duration-300 rounded-lg py-2 px-3",
          isBlueAccent 
            ? "text-[#00CFFF] hover:text-[#00CFFF] hover:bg-[#00CFFF]/10" 
            : "text-[#BB86FC] hover:text-[#BB86FC] hover:bg-[#BB86FC]/10"
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>{product.ctaText}</span>
        <motion.div
          className="ml-1"
          initial={{ x: 0 }}
          whileHover={{ x: 3 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="w-4 h-4" />
        </motion.div>
      </motion.a>
    </motion.div>
  );
}