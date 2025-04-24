import React, { FC } from 'react';
import { motion } from 'framer-motion';

interface IconArrowRightProps {
  /**
   * Icon size in pixels
   * @default 24
   */
  size?: number;
  
  /**
   * Icon color (HEX, RGB, or CSS color name)
   * @default "currentColor"
   */
  color?: string;
  
  /**
   * Whether the icon should be animated
   * @default false
   */
  animated?: boolean;
  
  /**
   * Whether the icon should have a glow effect
   * @default false
   */
  glow?: boolean;
  
  /**
   * CSS class names to apply to the icon
   */
  className?: string;
  
  /**
   * Additional props to pass to the SVG element
   */
  [key: string]: any;
}

/**
 * IconArrowRight - Animated arrow icon with optional glow effects
 * 
 * A versatile arrow icon component that can be static or animated,
 * with customizable size, color, and glow effects.
 */
const IconArrowRight: FC<IconArrowRightProps> = ({
  size = 24,
  color = 'currentColor',
  animated = false,
  glow = false,
  className = '',
  ...props
}) => {
  // Animation variants
  const arrowVariants = {
    idle: { x: 0 },
    animate: { 
      x: [0, 4, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };
  
  // Prepare the SVG wrapper based on animation requirements
  const SvgWrapper = animated ? motion.svg : 'svg';
  
  // Create filter ID for glow (unique per instance to avoid conflicts)
  const glowFilterId = `glow-filter-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <SvgWrapper
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`icon-arrow-right ${className}`}
      initial={animated ? "idle" : undefined}
      animate={animated ? "animate" : undefined}
      variants={animated ? arrowVariants : undefined}
      aria-hidden="true"
      {...props}
    >
      {/* Define glow filter if enabled */}
      {glow && (
        <defs>
          <filter id={glowFilterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feFlood floodColor={color} floodOpacity="0.5" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      )}
      
      {/* Arrow icon paths */}
      <g filter={glow ? `url(#${glowFilterId})` : undefined}>
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </g>
    </SvgWrapper>
  );
};

export default IconArrowRight;