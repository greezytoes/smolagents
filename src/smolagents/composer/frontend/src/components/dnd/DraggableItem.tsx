import React, { FC, ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface DraggableItemProps {
  children: ReactNode;
  className?: string;
  dragType: string;
  dragData: any;
  disabled?: boolean;
  handle?: boolean;
  showPreview?: boolean;
  previewSize?: 'small' | 'medium' | 'large';
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

/**
 * DraggableItem - A component that can be dragged and dropped in the workflow canvas
 * 
 * Features:
 * - Custom drag preview
 * - Visual feedback during dragging
 * - Optional dragging handle
 * - Configurable drag types and data
 * - Rich animation effects
 */
const DraggableItem: FC<DraggableItemProps> = ({
  children,
  className = '',
  dragType,
  dragData,
  disabled = false,
  handle = false,
  showPreview = true,
  previewSize = 'medium',
  onDragStart,
  onDragEnd,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const { darkMode } = useSelector((state: RootState) => state.ui);
  
  // Generate preview size classes
  const getPreviewSizeClass = () => {
    switch (previewSize) {
      case 'small':
        return 'w-8 h-8';
      case 'large':
        return 'w-16 h-16';
      case 'medium':
      default:
        return 'w-12 h-12';
    }
  };
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    e.dataTransfer.effectAllowed = 'move';
    
    // Set drag data
    e.dataTransfer.setData('application/dragType', dragType);
    e.dataTransfer.setData('application/dragData', JSON.stringify(dragData));
    
    // Create drag preview if enabled
    if (showPreview) {
      // We'll create a temporary DOM element for the preview
      const preview = document.createElement('div');
      preview.className = `fixed top-0 left-0 pointer-events-none overflow-hidden rounded-lg ${getPreviewSizeClass()} flex items-center justify-center z-50`;
      preview.style.background = darkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)';
      preview.style.backdropFilter = 'blur(8px)';
      preview.style.border = darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)';
      preview.style.boxShadow = darkMode 
        ? '0 4px 12px rgba(0, 0, 0, 0.5), 0 0 15px rgba(139, 92, 246, 0.5)' 
        : '0 4px 12px rgba(0, 0, 0, 0.1), 0 0 15px rgba(99, 102, 241, 0.3)';
      
      // Add icon or initials to preview
      const label = typeof dragData.name === 'string' ? dragData.name : 'Item';
      const initials = label.split(' ').map((word: string) => word[0]).join('').substring(0, 2).toUpperCase();
      
      preview.textContent = initials;
      preview.style.color = darkMode ? '#f8fafc' : '#0f172a';
      preview.style.fontWeight = 'bold';
      
      // Add preview to document temporarily
      document.body.appendChild(preview);
      e.dataTransfer.setDragImage(preview, preview.offsetWidth / 2, preview.offsetHeight / 2);
      
      // Clean up after a short delay (needs to be after the dragImage is set)
      setTimeout(() => {
        document.body.removeChild(preview);
      }, 0);
    }
    
    setIsDragging(true);
    if (onDragStart) onDragStart();
  };
  
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(false);
    if (onDragEnd) onDragEnd();
  };
  
  // Visual styles for when dragging
  const containerStyles = isDragging
    ? {
        opacity: 0.5,
        boxShadow: 'none',
        cursor: 'grabbing',
      }
    : {};
  
  // Motion animation variants
  const motionVariants = {
    hover: { 
      scale: disabled ? 1 : 1.02,
      boxShadow: disabled 
        ? 'none' 
        : darkMode 
          ? '0 0 12px rgba(139, 92, 246, 0.3)' 
          : '0 0 12px rgba(99, 102, 241, 0.2)',
    },
    tap: { 
      scale: disabled ? 1 : 0.98 
    }
  };
  
  return (
    <motion.div
      className={`${className}`}
      initial={{ opacity: 1 }}
      whileHover="hover"
      whileTap="tap"
      variants={motionVariants}
    >
      <div
        className={`cursor-grab ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        style={containerStyles}
        draggable={!disabled}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {children}
      </div>
    </motion.div>
  );
};

export default DraggableItem;