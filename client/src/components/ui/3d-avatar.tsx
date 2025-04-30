import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Avatar3DProps {
  letter: string;
  size?: "sm" | "md" | "lg" | "xl";
  verified?: boolean;
  className?: string;
  onClick?: () => void;
}

export function Avatar3D({ 
  letter, 
  size = "md", 
  verified = false,
  className,
  onClick
}: Avatar3DProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    
    // Calculate center of the element
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate mouse position relative to center
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Calculate rotation values (more dramatic effect for smaller sizes)
    const multiplier = size === "sm" ? 0.1 : size === "md" ? 0.08 : 0.05;
    setRotateX(-mouseY * multiplier);
    setRotateY(mouseX * multiplier);
  }
  
  function handleMouseLeave() {
    // Reset rotation when mouse leaves
    setRotateX(0);
    setRotateY(0);
  }
  
  // Size mappings
  const sizeClasses = {
    sm: "w-10 h-10 text-sm",
    md: "w-14 h-14 text-base",
    lg: "w-20 h-20 text-xl",
    xl: "w-24 h-24 text-2xl"
  };
  
  // Background for avatar - random colors based on letter
  const charCode = letter.charCodeAt(0);
  const hue = (charCode * 15) % 360;
  const bgColor = `hsl(${hue}, 70%, 50%)`;
  
  return (
    <div
      className={cn("relative", className)}
      style={{ 
        perspective: '800px',
        transformStyle: 'preserve-3d'
      }}
    >
      <motion.div
        className={cn(
          "rounded-full flex items-center justify-center font-semibold text-white cursor-pointer select-none",
          sizeClasses[size],
          verified ? "ring-2 ring-teal-500" : ""
        )}
        style={{
          backgroundColor: bgColor,
          boxShadow: `0 10px 25px ${bgColor}50`,
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: 'transform 0.1s ease'
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {letter.toUpperCase()}
      </motion.div>
      
      {verified && (
        <div 
          className={cn(
            "absolute bg-teal-500 rounded-full border-2 border-black flex items-center justify-center",
            size === "sm" ? "w-4 h-4 -right-0.5 -bottom-0.5" : 
            size === "md" ? "w-5 h-5 -right-1 -bottom-1" : 
            "w-6 h-6 -right-1 -bottom-1"
          )}
        >
          <Check 
            className={cn(
              "text-white",
              size === "sm" ? "w-3 h-3" : 
              size === "md" ? "w-3.5 h-3.5" : 
              "w-4 h-4"
            )} 
          />
        </div>
      )}
    </div>
  );
}