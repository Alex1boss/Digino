import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface StatsCard3DProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
  className?: string;
}

export function StatsCard3D({
  title,
  value,
  icon,
  color = "#BB86FC",
  className
}: StatsCard3DProps) {
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
    
    // Calculate rotation values
    setRotateX(-mouseY * 0.03);
    setRotateY(mouseX * 0.03);
  }
  
  function handleMouseLeave() {
    // Reset rotation when mouse leaves
    setRotateX(0);
    setRotateY(0);
  }
  
  return (
    <motion.div
      className={cn(
        "bg-gradient-to-br from-[#1A1A1A] to-[#111] rounded-xl border border-white/10 p-5 cursor-pointer",
        className
      )}
      style={{ 
        perspective: '800px',
        transformStyle: 'preserve-3d',
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.2s ease',
        boxShadow: `0 10px 30px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05), inset 0 0 0 1px rgba(255,255,255,0.05)` 
      }}
      whileHover={{ 
        scale: 1.03,
        boxShadow: `0 15px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), 0 0 20px ${color}20, inset 0 0 0 1px rgba(255,255,255,0.1)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background glow */}
      <div 
        className="absolute inset-0 rounded-xl opacity-30"
        style={{ 
          background: `radial-gradient(circle at 50% 50%, ${color}20, transparent 70%)`,
          zIndex: 0
        }}
      ></div>
      
      {/* Content */}
      <div className="relative z-10 flex justify-between items-center">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <h3 
            className="text-2xl font-bold"
            style={{ 
              color: 'white',
              textShadow: `0 0 10px ${color}40`
            }}
          >
            {value}
          </h3>
        </div>
        
        {icon && (
          <div 
            className="p-3 rounded-xl"
            style={{ 
              background: `linear-gradient(135deg, ${color}30, ${color}10)`,
              boxShadow: `0 8px 20px ${color}20, inset 0 1px 1px ${color}10`
            }}
          >
            <div style={{ color: color }}>
              {icon}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}