import { useState, useRef, useEffect } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { Shield } from "lucide-react";

interface Avatar3DProps {
  letter: string;
  size?: "sm" | "md" | "lg" | "xl";
  verified?: boolean;
  className?: string;
  onClick?: () => void;
}

const sizeMap = {
  sm: {
    container: "h-12 w-12",
    text: "text-xl",
    badge: "h-5 w-5 text-[10px]"
  },
  md: {
    container: "h-16 w-16",
    text: "text-2xl",
    badge: "h-6 w-6 text-xs"
  },
  lg: {
    container: "h-24 w-24",
    text: "text-4xl",
    badge: "h-7 w-7 text-sm"
  },
  xl: {
    container: "h-32 w-32",
    text: "text-5xl",
    badge: "h-8 w-8 text-base"
  }
};

export function Avatar3D({ 
  letter, 
  size = "md", 
  verified = false,
  className = "",
  onClick
}: Avatar3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  
  // For 3D effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // For smoother animations
  const springConfig = { damping: 15, stiffness: 300 };
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), springConfig);
  const scale = useSpring(hovering ? 1.05 : 1, springConfig);
  
  // Handle mouse move
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  }

  // Reset position when not hovering
  function handleMouseLeave() {
    setHovering(false);
    x.set(0);
    y.set(0);
  }
  
  const { container, text, badge } = sizeMap[size];
  
  return (
    <div className="relative" style={{ perspective: "1000px" }}>
      {/* Shadow and glow */}
      <div className={`absolute -inset-1 rounded-full blur-lg bg-gradient-to-br from-[#0056D2]/40 to-[#00C49A]/40 opacity-0 group-hover:opacity-70 transition-opacity duration-300 ${hovering ? 'opacity-70' : 'opacity-30'}`}></div>
      
      {/* Floating avatar */}
      <motion.div
        ref={ref}
        className={`relative ${container} rounded-full group ${className} cursor-pointer`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{
          rotateX,
          rotateY,
          scale,
          z: 10,
          transformStyle: "preserve-3d",
        }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Background gradient with shine effect */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-gradient-to-br from-[#0056D2] to-[#00C49A] border-4 border-[#131340]"
          animate={{
            background: hovering 
              ? [
                  "linear-gradient(135deg, #0056D2 0%, #00C49A 100%)",
                  "linear-gradient(225deg, #0056D2 0%, #00C49A 100%)",
                  "linear-gradient(315deg, #0056D2 0%, #00C49A 100%)",
                  "linear-gradient(45deg, #0056D2 0%, #00C49A 100%)",
                  "linear-gradient(135deg, #0056D2 0%, #00C49A 100%)"
                ]
              : "linear-gradient(135deg, #0056D2 0%, #00C49A 100%)"
          }}
          transition={{
            duration: hovering ? 4 : 0,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear"
          }}
        />
                
        {/* Letter in the center */}
        <div className={`absolute inset-0 flex items-center justify-center font-bold ${text} text-white`}>
          {letter}
          
          {/* Shine effect (white reflection) */}
          <motion.div 
            className="absolute inset-0 rounded-full bg-white opacity-0 mix-blend-overlay"
            animate={{
              opacity: hovering ? [0, 0.15, 0] : 0
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut"
            }}
          />
        </div>
        
        {/* Verified badge */}
        {verified && (
          <motion.div 
            className={`absolute bottom-0 right-0 ${badge} bg-[#0056D2] rounded-full flex items-center justify-center border-2 border-[#131340] shadow-lg`}
            style={{
              z: 20,
              transformStyle: "preserve-3d",
            }}
            animate={{
              scale: hovering ? [1, 1.15, 1] : 1
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut"
            }}
          >
            <Shield size="60%" className="text-white" />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}