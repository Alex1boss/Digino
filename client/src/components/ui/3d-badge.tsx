import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { LucideIcon } from 'lucide-react';

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
  color = "#BB86FC",
  className,
  glowColor = "#BB86FC"
}: Badge3DProps) {
  return (
    <motion.div
      className={cn(
        "rounded-full overflow-hidden backdrop-blur-md border px-3 py-1.5 text-xs font-medium flex items-center gap-1.5",
        className
      )}
      style={{
        background: `${color}30`,
        borderColor: `${color}50`,
        color: color,
        boxShadow: `0 2px 8px ${glowColor}30, inset 0 1px 1px ${glowColor}20`
      }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: `0 4px 12px ${glowColor}50, inset 0 1px 2px ${glowColor}30` 
      }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{label}</span>
    </motion.div>
  );
}