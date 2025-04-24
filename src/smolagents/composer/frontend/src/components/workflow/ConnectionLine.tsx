import React, { FC } from 'react';
import { ConnectionLineComponentProps } from 'reactflow';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

/**
 * ConnectionLine - Custom component for rendering connection lines during drag operations
 * 
 * Features:
 * - Dynamic styling based on connection validity
 * - Motion-based animations for fluid interaction
 * - Particle effects for data flow visualization
 * - Adaptive glow effects for enhanced visibility
 */
const ConnectionLine: FC<ConnectionLineComponentProps> = ({
  fromX,
  fromY,
  toX,
  toY,
  connectionStatus,
}) => {
  const darkMode = useSelector((state: RootState) => state.ui.darkMode);
  
  // Determine if the connection is valid
  const isValid = connectionStatus !== 'invalid';
  
  // Calculate path details
  const [edgePath, offsetPath] = getBezierPath(fromX, fromY, toX, toY);
  
  // Setup dynamic styling based on connection status and theme
  const strokeColor = isValid 
    ? darkMode ? '#6366f1' : '#818cf8'
    : darkMode ? '#f87171' : '#ef4444';
    
  const strokeWidth = 2;
  const dashArray = '5,3';
  
  return (
    <g>
      {/* Shadow/Glow Layer */}
      <path
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={6}
        strokeOpacity={0.3}
        strokeLinecap="round"
        filter={`drop-shadow(0 0 3px ${strokeColor})`}
        style={{ pointerEvents: 'none' }}
      />
      
      {/* Primary Connection Line */}
      <path
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
        className="connection-line stroke-accent-glow"
        style={{ pointerEvents: 'none' }}
      />
      
      {/* Animated Particles (only shown for valid connections) */}
      {isValid && (
        <g className="connection-particles">
          <motion.circle
            cx={fromX}
            cy={fromY}
            r={2}
            fill={strokeColor}
            className="fill-accent-glow"
            animate={{
              cx: [fromX, toX],
              cy: [fromY, toY],
            }}
            transition={{
              duration: 1,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
            }}
            style={{ pointerEvents: 'none' }}
          />
        </g>
      )}
    </g>
  );
};

/**
 * Helper function to create a bezier path between two points
 * 
 * @param fromX - Starting X coordinate
 * @param fromY - Starting Y coordinate
 * @param toX - Ending X coordinate
 * @param toY - Ending Y coordinate
 * @returns An array containing the bezier path string and an offset path for effects
 */
function getBezierPath(fromX: number, fromY: number, toX: number, toY: number): [string, string] {
  // Calculate control points for the bezier curve
  const deltaX = Math.abs(toX - fromX);
  const deltaY = Math.abs(toY - fromY);
  
  // Adjust control point distance based on the distance between nodes
  const controlPointOffset = Math.min(deltaX, deltaY) * 0.5 + 50;
  
  // Calculate the mid point for creating offset paths
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;
  
  // Determine direction and create appropriate curve
  const path = `M${fromX},${fromY} C${fromX + controlPointOffset},${fromY} ${toX - controlPointOffset},${toY} ${toX},${toY}`;
  
  // Create a slightly offset path for layered effects (if needed)
  const offsetPath = `M${fromX},${fromY} Q${midX},${midY + 20} ${toX},${toY}`;
  
  return [path, offsetPath];
}

export default ConnectionLine;