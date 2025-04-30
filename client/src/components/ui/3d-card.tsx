import React, { useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface Card3DProps {
  children: ReactNode;
  className?: string;
  bgClassName?: string;
  glowClassName?: string;
}

export function Card3D({
  children,
  className,
  bgClassName = "from-purple-500/5 via-transparent to-blue-500/5",
  glowClassName = "from-purple-500/10 via-transparent to-blue-500/10"
}: Card3DProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [scale, setScale] = useState(1);
  
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    
    // Calculate center of the element
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate mouse position relative to center
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Calculate rotation values
    const rotationIntensity = 10; // Lower = more intense rotation
    const maxRotation = 3; // Maximum rotation in degrees
    
    const newRotateX = Math.min(Math.max(-mouseY / rotationIntensity, -maxRotation), maxRotation);
    const newRotateY = Math.min(Math.max(mouseX / rotationIntensity, -maxRotation), maxRotation);
    
    setRotateX(newRotateX);
    setRotateY(newRotateY);
  }
  
  function handleMouseEnter() {
    setScale(1.02);
  }
  
  function handleMouseLeave() {
    // Reset rotation and scale when mouse leaves
    setRotateX(0);
    setRotateY(0);
    setScale(1);
  }
  
  return (
    <motion.div
      className={cn(
        "relative rounded-xl overflow-hidden border border-white/10 bg-[#111]",
        className
      )}
      style={{ 
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        transform: `scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.1s ease-out',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background gradient with glow */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-10",
          bgClassName
        )}
      ></div>
      
      {/* Glow effect that moves with mouse */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-300",
          glowClassName
        )}
        style={{ 
          transformStyle: 'preserve-3d',
          transform: `translateX(${rotateY * 20}px) translateY(${-rotateX * 20}px)`,
        }}
      ></div>
      
      {/* Content layer */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}