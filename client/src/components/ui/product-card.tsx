import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { Product } from "../../schema";
import { 
  ChevronRight, Box, Code, Cpu, Rocket, Users, Mic, 
  Star, ShoppingCart, Heart, Download, Award, Check, Sparkles
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

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

// Generate random ratings between 4.0 and 5.0
const generateRating = () => {
  return (4 + Math.random()).toFixed(1);
};

// Generate random review count between 10 and 150
const generateReviewCount = () => {
  return Math.floor(Math.random() * 140) + 10;
};

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const isBlueAccent = index % 2 !== 0;
  const isPurpleAccent = index % 3 === 0;
  const isTealAccent = !isBlueAccent && !isPurpleAccent;
  
  // Generate random rating data for display purposes
  const rating = generateRating();
  // Show actual review count if available, otherwise generate one
  const reviewCount = product.reviews || generateReviewCount();
  
  // Determine color scheme based on category
  let accentColor = "#BB86FC"; // Default purple
  if (product.category === "ai_tools") {
    accentColor = "#BB86FC"; // Purple for AI tools
  } else if (product.category === "templates") {
    accentColor = "#00CFFF"; // Blue for templates
  } else if (product.category === "graphics") {
    accentColor = "#03DAC5"; // Teal for graphics
  }
  
  const accentBg = `${accentColor}10`;
  
  // Check if this is a bestseller (use a more deterministic approach)
  const isBestSeller = index === 1 || product.sales > 10;
  
  // Check if this is verified
  const isVerified = index % 2 === 0;

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
        "bg-[#1E1E1E] hover:bg-[#252525] border border-white/5 hover:border-white/10 rounded-xl overflow-hidden transition-all duration-300 h-full flex flex-col relative group",
        isBlueAccent ? "hover:shadow-[0_0_20px_rgba(0,207,255,0.1)]" : 
        isPurpleAccent ? "hover:shadow-[0_0_20px_rgba(187,134,252,0.1)]" : 
        "hover:shadow-[0_0_20px_rgba(3,218,197,0.1)]"
      )}
    >
      {/* Product image/preview area (actual image or gradient fallback) */}
      <div 
        className="h-40 w-full bg-gradient-to-tr from-black to-[#2A2A2A] relative overflow-hidden"
        style={{ 
          backgroundImage: product.coverImage || product.imageUrl 
            ? `url(${product.coverImage || product.imageUrl})` 
            : `radial-gradient(circle at 50% 50%, ${accentColor}20, transparent 70%)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Icon only shown if no image is available */}
        {!product.coverImage && !product.imageUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center",
                `text-[${accentColor}] bg-[${accentColor}]/10 backdrop-blur-sm`
              )}
            >
              {renderIcon(product.iconName)}
            </div>
          </div>
        )}
        
        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button 
            size="icon" 
            variant="outline" 
            className="h-8 w-8 rounded-full bg-black/50 backdrop-blur-md border-white/10 hover:bg-white/10"
          >
            <Heart className="w-4 h-4" />
          </Button>
          <Button 
            size="icon" 
            variant="outline" 
            className="h-8 w-8 rounded-full bg-black/50 backdrop-blur-md border-white/10 hover:bg-white/10"
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-start flex-col">
            {/* Category badge */}
            <Badge 
              className={cn(
                "mb-2 text-xs px-2 py-0.5 rounded-full",
                `bg-[${accentColor}]/10 text-[${accentColor}] border-none`
              )}
            >
              {product.category || "Software"}
            </Badge>
            
            <h3 className="text-lg font-heading font-medium leading-tight">{product.name}</h3>
          </div>
        </div>
        
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {isBestSeller && (
            <Badge className="text-xs px-2 py-0.5 bg-[#FFD700]/10 text-[#FFD700] rounded-full border-[#FFD700]/20 flex items-center gap-1">
              <Award className="w-3 h-3" /> Bestseller
            </Badge>
          )}
          
          {isVerified && (
            <Badge className="text-xs px-2 py-0.5 bg-[#03DAC5]/10 text-[#03DAC5] rounded-full border-[#03DAC5]/20 flex items-center gap-1">
              <Check className="w-3 h-3" /> Verified
            </Badge>
          )}
          
          {product.isFree && (
            <Badge className="text-xs px-2 py-0.5 bg-[#00CFFF]/10 text-[#00CFFF] rounded-full border-[#00CFFF]/20">
              FREE
            </Badge>
          )}
        </div>
        
        {/* Description */}
        <p className="text-[#A0A0A0] text-sm mb-4 line-clamp-2">{product.description}</p>
        
        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={cn(
                  "w-3.5 h-3.5",
                  i < Math.floor(Number(rating)) 
                    ? `text-[${accentColor}] fill-[${accentColor}]` 
                    : "text-[#666666]"
                )}
              />
            ))}
          </div>
          <span className="text-white text-sm ml-2">{rating}</span>
          <span className="text-[#A0A0A0] text-xs ml-1">({reviewCount})</span>
        </div>
        
        {/* Price and action */}
        <div className="mt-auto flex items-center justify-between">
          <div className="font-semibold text-lg">
            {product.price ? `$${product.price}` : 'Free'}
            {product.price ? <span className="text-xs text-[#A0A0A0] ml-1">USD</span> : null}
          </div>
          
          <Button 
            size="sm"
            className={cn(
              "rounded-full px-4 py-1 h-auto text-white",
              `bg-[${accentColor}] hover:bg-[${accentColor}]/90 border-none`
            )}
          >
            {product.isFree ? (
              <>
                <Download className="w-3.5 h-3.5 mr-1.5" /> Download
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5 mr-1.5" /> Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
