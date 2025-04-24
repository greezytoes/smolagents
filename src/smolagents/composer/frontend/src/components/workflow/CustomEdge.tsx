import React, { FC, useState, useEffect } from 'react';
import { EdgeProps, getBezierPath, useReactFlow } from 'reactflow';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

/**
 * CustomEdge - Advanced edge component for workflow connections
 * 
 * Features:
 * - Animated data flow particles
 * - Glassmorphic styling with dynamic glow effects
 * - Context-aware styling based on edge data and status
 * - Responsive interactions with hover states
 */
const CustomEdge: FC<EdgeProps> = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [particleCount, setParticleCount] = useState(3);
  const darkMode = useSelector((state: RootState) => state.ui.darkMode);
  const { getEdge } = useReactFlow();
  
  // Get edge data
  const edge = getEdge(id);
  const isActive = edge?.data?.status === 'active';
  const isError = edge?.data?.status === 'error';
  
  // Calculate edge path
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  
  // Set default colors based on theme and status
  let strokeColor = darkMode ? '#6366f1' : '#818cf8'; // Default: indigo
  if (isError) {
    strokeColor = darkMode ? '#ef4444' : '#f87171'; // Error: red
  } else if (isActive) {
    strokeColor = darkMode ? '#10b981' : '#34d399'; // Active: green
  }
  
  const glowColor = strokeColor;
  const glowStrength = isHovered ? '6px' : '3px';
  
  // Start animation when edge is active
  useEffect(() => {
    if (isActive) {
      setIsAnimating(true);
      setParticleCount(5);
    } else {
      setIsAnimating(false);
      setParticleCount(isHovered ? 3 : 1);
    }
  }, [isActive, isHovered]);
  
  return (
    <g
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="custom-edge"
    >
      {/* Glass effect background for the edge */}
      <path
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeOpacity={0.15}
        strokeWidth={12}
        style={{
          filter: `blur(${isHovered ? '5px' : '3px'})`,
          transition: 'all 0.3s ease',
        }}
      />
      
      {/* Main edge line */}
      <path
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={isHovered ? 3 : 2}
        className={`${isActive ? 'animated-dash' : ''} transition-all duration-300`}
        style={{
          ...style,
          filter: `drop-shadow(0 0 ${glowStrength} ${glowColor})`,
          strokeDasharray: isActive ? '5,3' : (isHovered ? '3,2' : 'none'),
          transition: 'all 0.3s ease',
        }}
        markerEnd={markerEnd}
      />
      
      {/* Animated particles along the path */}
      {Array.from({ length: particleCount }).map((_, i) => (
        <motion.circle
          key={`particle-${id}-${i}`}
          r={isHovered ? 3 : 2}
          fill={strokeColor}
          filter={`drop-shadow(0 0 ${glowStrength} ${glowColor})`}
          initial={false}
          animate={{
            offsetDistance: ['0%', '100%'],
          }}
          transition={{
            duration: isActive ? 1.2 : 2,
            delay: i * (isActive ? 0.2 : 0.5),
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            offsetPath: `path("${edgePath}")`,
            offsetRotate: 'auto',
            visibility: isAnimating || isHovered ? 'visible' : 'hidden',
          }}
        />
      ))}
      
      {/* Edge interaction area (larger hit area for better UX) */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        className="edge-interaction-area"
        onClick={() => console.log(`Edge clicked: ${id}`)}
      />
      
      {/* Display data flowing indication for active edges */}
      {(isActive || isHovered) && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{ pointerEvents: 'none' }}
        >
          <circle
            cx={labelX}
            cy={labelY}
            r={isHovered ? 18 : 15}
            fill={darkMode ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.7)'}
            className="edge-label-bg backdrop-blur-sm"
            style={{
              backdropFilter: 'blur(4px)',
              boxShadow: `0 0 10px rgba(0, 0, 0, 0.1)`,
            }}
          />
          <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={10}
            fill={darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(30, 41, 59, 0.8)'}
            className="edge-label-text"
          >
            {isActive ? 'active' : 'flow'}
          </text>
        </motion.g>
      )}
    </g>
  );
};

export default CustomEdge;