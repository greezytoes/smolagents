import React, { FC, ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface DropZoneProps {
  children?: ReactNode;
  className?: string;
  acceptTypes?: string[];
  disabled?: boolean;
  highlightOnDragOver?: boolean;
  onDrop?: (type: string, data: any) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void;
  placeholder?: ReactNode;
  showPlaceholderOnDragOver?: boolean;
  glowColor?: string;
  glowIntensity?: 'none' | 'low' | 'medium' | 'high';
}

/**
 * DropZone - A component that accepts dropped items from DraggableItem
 * 
 * Features:
 * - Visual feedback when items are dragged over
 * - Type filtering to accept only certain types of draggable items
 * - Custom placeholder content
 * - Configurable glow effects
 * - Animation effects
 */
const DropZone: FC<DropZoneProps> = ({
  children,
  className = '',
  acceptTypes = [],
  disabled = false,
  highlightOnDragOver = true,
  onDrop,
  onDragOver,
  onDragLeave,
  placeholder,
  showPlaceholderOnDragOver = true,
  glowColor,
  glowIntensity = 'medium',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const { darkMode } = useSelector((state: RootState) => state.ui);
  
  // Default glow color based on theme
  const defaultGlowColor = darkMode ? '#8B5CF6' : '#6366F1';
  const activeGlowColor = glowColor || defaultGlowColor;
  
  // Glow intensity values
  const getGlowValue = () => {
    if (glowIntensity === 'none') return 'none';
    
    const intensityMap = {
      low: '0 0 10px',
      medium: '0 0 20px',
      high: '0 0 30px',
    };
    
    return `${intensityMap[glowIntensity]} ${activeGlowColor}`;
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (disabled) return;
    
    // Check if the dragged item type is accepted
    const dragType = e.dataTransfer.types.includes('application/dragType')
      ? e.dataTransfer.getData('application/dragType')
      : '';
    
    if (acceptTypes.length > 0 && !acceptTypes.includes(dragType)) {
      e.dataTransfer.dropEffect = 'none';
      return;
    }
    
    e.dataTransfer.dropEffect = 'move';
    
    if (!isDragOver) {
      setIsDragOver(true);
    }
    
    if (onDragOver) {
      onDragOver(e);
    }
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    // Only trigger if leaving the element (not entering a child)
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    
    setIsDragOver(false);
    
    if (onDragLeave) {
      onDragLeave(e);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (disabled) return;
    
    setIsDragOver(false);
    
    // Get drag data
    const dragType = e.dataTransfer.getData('application/dragType');
    
    // If we have accept types and this type isn't in there, reject the drop
    if (acceptTypes.length > 0 && !acceptTypes.includes(dragType)) {
      return;
    }
    
    try {
      const dragData = JSON.parse(e.dataTransfer.getData('application/dragData'));
      
      if (onDrop) {
        onDrop(dragType, dragData);
      }
    } catch (error) {
      console.error('Error parsing drop data:', error);
    }
  };
  
  // Dynamic styles based on state
  const getContainerStyles = () => {
    // Base styles
    const baseStyle: React.CSSProperties = {
      position: 'relative',
      transition: 'all 0.2s ease',
    };
    
    // Add highlight styles when dragging over and highlight is enabled
    if (isDragOver && highlightOnDragOver) {
      return {
        ...baseStyle,
        boxShadow: getGlowValue(),
        borderColor: activeGlowColor,
      };
    }
    
    return baseStyle;
  };
  
  return (
    <motion.div
      className={`${className}`}
      style={getContainerStyles()}
      animate={{ 
        scale: isDragOver ? 1.01 : 1,
      }}
      transition={{ 
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Main content */}
      {children}
      
      {/* Placeholder displayed during drag over */}
      {isDragOver && showPlaceholderOnDragOver && placeholder && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {placeholder}
        </motion.div>
      )}
      
      {/* Disabled overlay */}
      {disabled && (
        <div 
          className="absolute inset-0 bg-slate-900 bg-opacity-50 cursor-not-allowed z-10"
          style={{ backdropFilter: 'blur(2px)' }}
        />
      )}
    </motion.div>
  );
};

export default DropZone;