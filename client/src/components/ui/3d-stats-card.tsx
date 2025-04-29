import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

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
  color = "#0056D2",
  className = "",
}: StatsCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  
  // Mouse position for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring physics for smoother animation
  const springConfig = { damping: 25, stiffness: 400 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-5, 5]), springConfig);
  
  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden rounded-xl ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        perspective: "1000px",
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.2 },
      }}
    >
      {/* Background with gradient border */}
      <div className="absolute inset-0 rounded-xl p-[1px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0" />
        {isHovering && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br"
            style={{
              backgroundImage: `linear-gradient(135deg, ${color}40, transparent)`,
              opacity: useTransform(
                [mouseX, mouseY],
                ([x, y]) => {
                  const distance = Math.sqrt(Math.pow(x - 0.5, 2) + Math.pow(y - 0.5, 2));
                  return 1 - distance;
                }
              ),
            }}
          />
        )}
      </div>
      
      {/* Card content with 3D effect */}
      <motion.div
        className="relative flex flex-col items-center justify-center p-4 h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
        style={{
          rotateX: isHovering ? rotateX : 0,
          rotateY: isHovering ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Moving shine effect */}
        {isHovering && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
            style={{
              backgroundPosition: useTransform(
                [mouseX, mouseY],
                ([x, y]) => `${x * 100}% ${y * 100}%`
              ),
              opacity: useTransform(
                [mouseX, mouseY],
                ([x, y]) => {
                  const distance = Math.sqrt(Math.pow(x - 0.5, 2) + Math.pow(y - 0.5, 2));
                  return 0.2 - distance * 0.2;
                }
              ),
            }}
          />
        )}
        
        {/* Icon (if provided) */}
        {icon && (
          <motion.div
            className="mb-2"
            style={{ 
              color,
              transform: "translateZ(10px)",
            }}
          >
            {icon}
          </motion.div>
        )}
        
        {/* Value */}
        <motion.span
          className="text-xl md:text-2xl font-bold"
          style={{
            transform: "translateZ(20px)",
          }}
        >
          {value}
        </motion.span>
        
        {/* Title */}
        <motion.span
          className="text-xs text-white/60"
          style={{
            transform: "translateZ(15px)",
          }}
        >
          {title}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}