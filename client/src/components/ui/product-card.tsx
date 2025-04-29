import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { Product } from "../../schema";
import { ChevronRight, Box, Code, Cpu, Rocket, Users, Mic, LucideIcon } from "lucide-react";

// Function to render the icon based on iconName
const renderIcon = (iconName: string) => {
  switch (iconName) {
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

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const isBlueAccent = index % 2 !== 0;

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
        "glass rounded-xl p-6 transition-all duration-500 h-full flex flex-col card-hover",
        isBlueAccent ? "card-hover-blue" : ""
      )}
    >
      <div className="flex items-center mb-4">
        <div 
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center",
            isBlueAccent
              ? "text-[#00CFFF] bg-[#00CFFF]/10"
              : "text-[#BB86FC] bg-[#BB86FC]/10"
          )}
        >
          {renderIcon(product.iconName)}
        </div>
        <h3 className="text-xl ml-3 font-heading font-medium">{product.name}</h3>
      </div>
      
      {product.isFree && (
        <div className="absolute top-3 right-3 bg-[#00CFFF] text-white text-xs font-bold px-2 py-1 rounded-full">
          FREE
        </div>
      )}
      
      <p className="text-[#A0A0A0] text-sm mb-6 flex-grow">{product.description}</p>
      
      <a 
        href={product.link} 
        className={cn(
          "mt-auto flex items-center text-sm font-medium transition",
          isBlueAccent 
            ? "text-[#00CFFF] hover:text-[#00CFFF]/80" 
            : "text-[#BB86FC] hover:text-[#BB86FC]/80"
        )}
      >
        <span>{product.ctaText}</span>
        <ChevronRight className="w-4 h-4 ml-1" />
      </a>
    </motion.div>
  );
}
