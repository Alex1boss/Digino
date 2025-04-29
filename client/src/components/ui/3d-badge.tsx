import { useState, useRef } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Badge3DProps {
  label: string;
  icon: LucideIcon;
  color?: string;
  className?: string;
  glowColor?: string;
}

export function Badge3D({ 
  label, 
  icon: Icon, 
  color = "#0056D2", 
  glowColor = "rgba(0, 86, 210, 0.4)",
  className 
}: Badge3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  
  // Mouse position for 3D effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Smoothed rotation values
  const springConfig = { damping: 15, stiffness: 300 };
  const rotateX = useSpring(useTransform(y, [-50, 50], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(x, [-50, 50], [-5, 5]), springConfig);
  
  // Calculate lighting intensity based on mouse position
  const lightingIntensity = useMotionValue(0.5);
  
  // Update lighting intensity based on mouse position
  const updateLightingIntensity = (mouseX: number, mouseY: number) => {
    const distance = Math.sqrt(
      Math.pow(mouseX / 100, 2) + Math.pow(mouseY / 100, 2)
    );
    lightingIntensity.set(1 - Math.min(distance, 1));
  };
  
  // Shadow values
  const shadowX = useTransform(x, [-100, 100], [2, -2]);
  const shadowY = useTransform(y, [-100, 100], [2, -2]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    x.set(mouseX);
    y.set(mouseY);
    
    // Update lighting intensity
    updateLightingIntensity(mouseX, mouseY);
  };
  
  return (
    <div
      ref={ref}
      style={{ perspective: "800px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false);
        x.set(0);
        y.set(0);
        lightingIntensity.set(0.5);
      }}
      className={cn("relative inline-block", className)}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-1 rounded-lg"
        style={{
          boxShadow: useTransform(
            [shadowX, shadowY, lightingIntensity],
            ([latestX, latestY, intensity]) =>
              `0 0 10px ${glowColor}`
          ),
          opacity: hovering ? useTransform(
            lightingIntensity,
            [0, 1],
            [0.1, 0.6]
          ) : 0,
        }}
      />
      
      {/* Main badge */}
      <motion.div
        className="flex items-center gap-2 bg-[#1A1A3A] rounded-lg px-3 py-2 border border-white/5 relative"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          boxShadow: hovering 
            ? `0 4px 10px ${glowColor}` 
            : "0 2px 5px rgba(0,0,0,0.1)",
          scale: useSpring(hovering ? 1.05 : 1, springConfig),
        }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Icon */}
        <Icon size={18} style={{ color }} />
        
        {/* Label */}
        <span className="text-sm font-medium">{label}</span>
        
        {/* Highlight gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white to-transparent rounded-lg mix-blend-overlay pointer-events-none"
          style={{
            opacity: useTransform(
              lightingIntensity,
              [0, 0.5, 1],
              [0, 0.1, 0.15]
            ),
          }}
        />
      </motion.div>
    </div>
  );
}