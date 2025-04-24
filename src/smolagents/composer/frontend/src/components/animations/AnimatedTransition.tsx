import React, { FC, ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// Predefined transition types
export type TransitionType = 
  'fade' | 
  'slide-up' | 
  'slide-down' | 
  'slide-left' | 
  'slide-right' | 
  'scale' | 
  'rotate' | 
  'flip' | 
  'bounce' |
  'glow' |
  'morph';

// Transition physics presets
export type TransitionPhysics = 
  'tween' | 
  'spring-gentle' | 
  'spring-bouncy' | 
  'inertia' | 
  'gravity';

interface AnimatedTransitionProps {
  children: ReactNode;
  isVisible: boolean;
  type?: TransitionType;
  physics?: TransitionPhysics;
  duration?: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  customVariants?: Variants;
  onAnimationComplete?: () => void;
  layoutId?: string;
}

/**
 * AnimatedTransition - A component for smooth transitions between UI states
 * 
 * Features:
 * - Multiple animation types (fade, slide, scale, etc.)
 * - Configurable physics (spring, tween, etc.)
 * - Support for exit animations with AnimatePresence
 * - Custom variant support for advanced animations
 */
const AnimatedTransition: FC<AnimatedTransitionProps> = ({
  children,
  isVisible,
  type = 'fade',
  physics = 'spring-gentle',
  duration = 0.3,
  delay = 0,
  className = '',
  style = {},
  customVariants,
  onAnimationComplete,
  layoutId,
}) => {
  // Predefined variants based on transition type
  const getVariants = (): Variants => {
    if (customVariants) return customVariants;
    
    switch (type) {
      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
          exit: { opacity: 0 },
        };
      
      case 'slide-up':
        return {
          hidden: { y: 50, opacity: 0 },
          visible: { y: 0, opacity: 1 },
          exit: { y: -50, opacity: 0 },
        };
      
      case 'slide-down':
        return {
          hidden: { y: -50, opacity: 0 },
          visible: { y: 0, opacity: 1 },
          exit: { y: 50, opacity: 0 },
        };
      
      case 'slide-left':
        return {
          hidden: { x: 50, opacity: 0 },
          visible: { x: 0, opacity: 1 },
          exit: { x: -50, opacity: 0 },
        };
      
      case 'slide-right':
        return {
          hidden: { x: -50, opacity: 0 },
          visible: { x: 0, opacity: 1 },
          exit: { x: 50, opacity: 0 },
        };
      
      case 'scale':
        return {
          hidden: { scale: 0.8, opacity: 0 },
          visible: { scale: 1, opacity: 1 },
          exit: { scale: 0.8, opacity: 0 },
        };
      
      case 'rotate':
        return {
          hidden: { rotate: -10, opacity: 0 },
          visible: { rotate: 0, opacity: 1 },
          exit: { rotate: 10, opacity: 0 },
        };
      
      case 'flip':
        return {
          hidden: { rotateX: 90, opacity: 0 },
          visible: { rotateX: 0, opacity: 1 },
          exit: { rotateX: -90, opacity: 0 },
        };
      
      case 'bounce':
        return {
          hidden: { y: -50, opacity: 0 },
          visible: { 
            y: 0, 
            opacity: 1,
            transition: {
              type: 'spring',
              stiffness: 400,
              damping: 10
            }
          },
          exit: { y: 50, opacity: 0 },
        };
      
      case 'glow':
        return {
          hidden: { 
            opacity: 0,
            filter: 'blur(8px) brightness(0.8)'
          },
          visible: { 
            opacity: 1,
            filter: 'blur(0px) brightness(1)',
            transition: {
              filter: { duration: 0.4 }
            }
          },
          exit: { 
            opacity: 0,
            filter: 'blur(8px) brightness(1.2)'
          },
        };
      
      case 'morph':
        return {
          hidden: { 
            opacity: 0,
            borderRadius: '50%',
            scale: 0.5,
          },
          visible: { 
            opacity: 1,
            borderRadius: '8px',
            scale: 1,
          },
          exit: { 
            opacity: 0,
            borderRadius: '50%',
            scale: 0.2,
          },
        };
      
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
          exit: { opacity: 0 },
        };
    }
  };
  
  // Physics configuration
  const getTransition = () => {
    switch (physics) {
      case 'tween':
        return {
          type: 'tween',
          duration,
          delay,
        };
      
      case 'spring-gentle':
        return {
          type: 'spring',
          stiffness: 200,
          damping: 30,
          mass: 1,
          delay,
        };
      
      case 'spring-bouncy':
        return {
          type: 'spring',
          stiffness: 400,
          damping: 8,
          mass: 1,
          delay,
        };
      
      case 'inertia':
        return {
          type: 'inertia',
          velocity: 50,
          delay,
        };
      
      case 'gravity':
        return {
          type: 'spring',
          stiffness: 900,
          damping: 30,
          mass: 3,
          delay,
        };
      
      default:
        return {
          type: 'spring',
          stiffness: 200,
          damping: 30,
          mass: 1,
          delay,
        };
    }
  };
  
  const variants = getVariants();
  const transition = getTransition();
  
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className={className}
          style={style}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={transition}
          onAnimationComplete={onAnimationComplete}
          layoutId={layoutId}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedTransition;