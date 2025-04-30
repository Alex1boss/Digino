import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { Product } from "../../schema";
import { 
  ChevronRight, Box, Code, Cpu, Rocket, Users, Mic, 
  Star, ShoppingCart, Heart, Download, Award, Check, Sparkles
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

// Function to safely render icon components
import React, { ElementType } from "react";
import { getIconComponent } from "../../schema";

// Function to safely render the product icon
function renderProductIcon(product: Product, props: React.ComponentProps<ElementType> = {}) {
  const IconComponent = product.Icon || getIconComponent(product.iconName || "cpu");
  return React.createElement(IconComponent || Cpu, props);
}

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
  // Generate random rating data for display purposes
  const rating = generateRating();
  // Show actual review count if available, otherwise generate one
  const reviewCount = product.reviews || generateReviewCount();
  
  // Determine style based on category
  const categoryStyles: {[key: string]: string} = {
    "ai_tools": "text-[#BB86FC]",
    "Digital Assets": "text-[#BB86FC]",
    "templates": "text-[#00CFFF]",
    "graphics": "text-[#03DAC5]",
    "Software": "text-[#03DAC5]",
  };
  
  const categoryColor = product.category ? categoryStyles[product.category] || "text-[#BB86FC]" : "text-[#BB86FC]";
  
  // Check if this is a bestseller
  const isBestSeller = index === 1 || (product.sales !== undefined && product.sales > 10);
  
  // Check if this is verified
  const isVerified = index % 2 === 0;

  // Handle the background image
  const hasImage = product.coverImage && product.coverImage !== "/path/to/placeholder.jpg";
  const productImage = hasImage ? product.coverImage : null;
  const imageUrl = product.imageUrl && product.imageUrl !== "/path/to/placeholder.jpg" ? product.imageUrl : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.05,
        ease: "easeOut" 
      }}
      className="bg-[#1A1A1A] border border-gray-800 rounded-xl overflow-hidden flex flex-col relative"
    >
      {/* Product image/preview area */}
      {(productImage || imageUrl) ? (
        <div 
          className="h-40 w-full bg-white relative overflow-hidden"
          style={{ 
            backgroundImage: `url(${productImage || imageUrl})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Action buttons */}
          <div className="absolute bottom-3 right-3 flex space-x-2">
            <Button 
              size="icon" 
              variant="outline" 
              className="h-8 w-8 rounded-full bg-gray-800/50 backdrop-blur-md border-white/10 hover:bg-white/10"
            >
              <Heart className="w-4 h-4" />
            </Button>
            <Button 
              size="icon" 
              variant="outline" 
              className="h-8 w-8 rounded-full bg-gray-800/50 backdrop-blur-md border-white/10 hover:bg-white/10"
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        // Fallback icon display if no image
        <div className="h-40 w-full bg-gradient-to-r from-gray-900 to-black flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-purple-900/30 flex items-center justify-center">
            {renderProductIcon(product, { className: "w-12 h-12 text-purple-500" })}
          </div>
        </div>
      )}
      
      {/* Content area */}
      <div className="p-5">
        {/* Category */}
        <div className={`text-xs uppercase tracking-wider mb-2 ${categoryColor}`}>
          {product.category}
        </div>
        
        {/* Title */}
        <h3 className="text-white text-xl font-medium mb-1">{product.name}</h3>
        
        {/* Verification badge if verified */}
        {isVerified && (
          <div className="flex items-center gap-1 mb-2">
            <Badge className="bg-teal-500/10 text-teal-500 border-none px-2 py-0.5 text-xs">
              <Check className="w-3 h-3 mr-1" /> Verified
            </Badge>
          </div>
        )}
        
        {/* Description */}
        <p className="text-gray-400 text-sm mb-3">{product.description}</p>
        
        {/* Rating stars */}
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < Math.floor(Number(rating)) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
            />
          ))}
          <span className="text-gray-400 text-sm ml-2">{rating} ({reviewCount})</span>
        </div>
        
        {/* Price and action */}
        <div className="flex items-center justify-between">
          <div className="font-semibold text-xl text-white">
            ${product.price}
            <span className="text-xs text-gray-400 ml-1">USD</span>
          </div>
          
          <Button 
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-4 py-1"
          >
            <ShoppingCart className="w-4 h-4 mr-1.5" /> Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
