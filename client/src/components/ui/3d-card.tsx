import { useState, useRef, ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface Card3DProps {
  children: ReactNode;
  className?: string;
  bgClassName?: string;
  glowClassName?: string;
}

export function Card3D({
  children,
  className = "",
  bgClassName = "bg-[#131340]/80 backdrop-blur-sm",
  glowClassName = "from-[#0056D2]/10 via-[#00C49A]/10 to-transparent",
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Mouse position state and motion values
  const [hovering, setHovering] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring physics for smoother animation
  const springConfig = { damping: 20, stiffness: 300 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-10, 10]), springConfig);
  const shineX = useSpring(useTransform(mouseX, [0, 1], [0.8, 0.2]), springConfig);
  const shineY = useSpring(useTransform(mouseY, [0, 1], [0.8, 0.2]), springConfig);
  
  // Define how much the card tilts in degrees
  const tiltThreshold = 8;
  
  // Handle mouse move event
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to card (0 to 1)
    const newMouseX = (e.clientX - rect.left) / rect.width;
    const newMouseY = (e.clientY - rect.top) / rect.height;
    
    mouseX.set(newMouseX);
    mouseY.set(newMouseY);
  }

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{
        perspective: "1200px",
      }}
    >
      <motion.div
        style={{
          rotateX: hovering ? rotateX : 0,
          rotateY: hovering ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full"
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300,
        }}
      >
        {/* Background with border glow */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${glowClassName} opacity-0`}
            animate={{ opacity: hovering ? 0.7 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        {/* Card content with shine effect */}
        <motion.div
          className={`w-full h-full rounded-2xl border border-white/10 overflow-hidden ${bgClassName}`}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* Light reflection effect */}
          {hovering && (
            <motion.div
              className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent opacity-0"
              style={{
                left: useTransform(shineX, [0, 1], ["-100%", "100%"]),
                top: useTransform(shineY, [0, 1], ["-100%", "100%"]),
                opacity: useTransform(
                  [shineX, shineY],
                  ([x, y]) => 0.05 + Math.min(x, y) * 0.1
                ),
              }}
            />
          )}
          
          {/* Main content */}
          <div className="relative z-10">{children}</div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}