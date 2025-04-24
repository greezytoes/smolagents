import React, { FC, ReactNode, useState } from 'react';
import { motion, MotionProps, Variants } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export type GlowIntensity = 'none' | 'low' | 'medium' | 'high';

interface AnimatedCardProps extends MotionProps {
  children: ReactNode;
  className?: string;
  isGlassmorphic?: boolean;
  isNeomorphic?: boolean;
  color?: string;
  glowIntensity?: GlowIntensity;
  hoverEffect?: boolean;
  pressEffect?: boolean;
  borderRadius?: string | number;
  borderWidth?: string | number;
  elevation?: 'flat' | 'raised' | 'floating';
  onClick?: () => void;
}

/**
 * AnimatedCard - A versatile card component with animation and visual effects
 * 
 * Features:
 * - Support for both glassmorphic and neomorphic design styles
 * - Configurable glow effects with different intensities
 * - Smooth animations for hover and press interactions
 * - Dark/light mode compatibility
 * - Flexible styling options
 */
const AnimatedCard: FC<AnimatedCardProps> = ({
  children,
  className = '',
  isGlassmorphic = true,
  isNeomorphic = false,
  color = '#6366F1',
  glowIntensity = 'low',
  hoverEffect = true,
  pressEffect = true,
  borderRadius = 8,
  borderWidth = 1,
  elevation = 'raised',
  onClick,
  ...motionProps
}) => {
  const darkMode = useSelector((state: RootState) => state.ui.darkMode);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  // Glow intensity values for different levels
  const getGlowValue = (): string => {
    if (glowIntensity === 'none') return 'none';
    
    const intensityMap = {
      low: darkMode ? '0 0 10px' : '0 0 5px',
      medium: darkMode ? '0 0 20px' : '0 0 15px',
      high: darkMode ? '0 0 30px' : '0 0 25px',
    };
    
    return `${intensityMap[glowIntensity]} ${color}${darkMode ? '50' : '30'}`;
  };
  
  // Get elevation-based shadow
  const getElevationShadow = (): string => {
    if (isNeomorphic) return 'none'; // Neomorphic has its own shadow style
    
    const elevationMap = {
      flat: 'none',
      raised: darkMode 
        ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)' 
        : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      floating: darkMode 
        ? '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)' 
        : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    };
    
    return elevationMap[elevation];
  };
  
  // Get glassmorphic styles
  const getGlassmorphicStyle = () => {
    if (!isGlassmorphic) return {};
    
    return {
      background: darkMode 
        ? 'rgba(15, 23, 42, 0.7)' 
        : 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(12px)',
      border: `${borderWidth}px solid ${darkMode 
        ? 'rgba(255, 255, 255, 0.1)' 
        : 'rgba(0, 0, 0, 0.06)'}`,
    };
  };
  
  // Get neomorphic styles
  const getNeomorphicStyle = () => {
    if (!isNeomorphic) return {};
    
    return {
      background: darkMode ? '#1e293b' : '#f8fafc',
      boxShadow: darkMode 
        ? 'inset 5px 5px 10px #151d2e, inset -5px -5px 10px #273548'
        : 'inset 5px 5px 10px #e4e6e9, inset -5px -5px 10px #ffffff',
      border: 'none',
    };
  };
  
  // Animation variants
  const variants: Variants = {
    initial: { 
      scale: 1,
      boxShadow: getElevationShadow(),
    },
    hover: hoverEffect ? { 
      scale: 1.02,
      boxShadow: `${getElevationShadow()}, ${getGlowValue()}`,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10
      }
    } : {},
    tap: pressEffect ? { 
      scale: 0.98,
      boxShadow: 'none',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10
      }
    } : {},
  };
  
  const combinedStyle = {
    borderRadius,
    transition: 'all 0.2s ease',
    ...(isGlassmorphic ? getGlassmorphicStyle() : {}),
    ...(isNeomorphic ? getNeomorphicStyle() : {}),
    ...(isHovered && hoverEffect && !isNeomorphic ? { boxShadow: `${getElevationShadow()}, ${getGlowValue()}` } : {}),
  };
  
  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      style={combinedStyle}
      variants={variants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onTapStart={() => setIsPressed(true)}
      onTapCancel={() => setIsPressed(false)}
      onTap={() => {
        setIsPressed(false);
        if (onClick) onClick();
      }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;