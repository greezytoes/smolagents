import React, { memo, FC, useState } from 'react';
import { Handle, Position, NodeProps, Node } from 'reactflow';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { updateNode } from '../../../store/slices/workflowSlice';

// Define our custom node data structure
export interface AgentNodeData {
  label: string;
  description?: string;
  type: string;
  modelId?: string;
  toolIds?: string[];
  status?: 'idle' | 'running' | 'completed' | 'error' | 'paused';
  message?: string;
  config?: Record<string, any>;
}

// Define props type that extends ReactFlow's NodeProps
interface AgentNodeProps {
  id: string;
  data: AgentNodeData;
  selected?: boolean;
  isConnectable?: boolean;
}

/**
 * AgentNode - A custom ReactFlow node component for representing agents in the workflow
 * 
 * Features:
 * - Glassmorphic/neomorphic design with glow effects
 * - Status indicators (idle, running, completed, error)
 * - Animated transitions between states
 * - Configurable connection points
 * - Quick action buttons for configuration
 */
const AgentNode: FC<AgentNodeProps> = ({ 
  data, 
  selected = false,
  isConnectable = true,
  id
}) => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state: RootState) => state.ui);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  
  // Status colors
  const getStatusColor = () => {
    switch (data.status) {
      case 'running':
        return '#3B82F6'; // Blue
      case 'completed':
        return '#10B981'; // Green
      case 'error':
        return '#EF4444'; // Red
      case 'paused':
        return '#F59E0B'; // Amber
      case 'idle':
      default:
        return darkMode ? '#94A3B8' : '#64748B'; // Gray
    }
  };
  
  // Status indicator pulse animation
  const getPulseAnimation = () => {
    if (data.status === 'running') {
      return {
        scale: [1, 1.1, 1],
        opacity: [0.7, 1, 0.7],
        transition: {
          duration: 2,
          repeat: Infinity,
          repeatType: 'loop' as const,
        },
      };
    }
    return {};
  };
  
  // Base node style
  const getNodeStyle = () => {
    const baseStyle: React.CSSProperties = {
      background: darkMode ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(8px)',
      borderRadius: '8px',
      border: selected
        ? `2px solid ${getStatusColor()}`
        : darkMode
        ? '1px solid rgba(255, 255, 255, 0.1)'
        : '1px solid rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease',
      boxShadow: selected
        ? `0 0 0 2px ${getStatusColor()}, 0 0 20px ${getStatusColor()}40`
        : darkMode
        ? '0 4px 12px rgba(0, 0, 0, 0.3)'
        : '0 4px 12px rgba(0, 0, 0, 0.1)',
    };
    
    return baseStyle;
  };
  
  // Handle connection point style
  const getHandleStyle = (position: Position) => {
    const isLeft = position === Position.Left;
    
    return {
      background: darkMode ? '#1E293B' : '#F8FAFC',
      border: `2px solid ${getStatusColor()}`,
      boxShadow: `0 0 5px ${getStatusColor()}50`,
      width: '12px',
      height: '12px',
      borderRadius: '6px',
      top: isLeft ? 'calc(50% - 6px)' : undefined,
      bottom: isLeft ? undefined : 'calc(50% - 6px)',
      left: isLeft ? '-6px' : undefined,
      right: isLeft ? undefined : '-6px',
    };
  };
  
  // Edit node data
  const updateNodeData = (updates: Partial<AgentNodeData>) => {
    dispatch(updateNode({
      id,
      changes: {
        data: {
          ...data,
          ...updates,
        },
      },
    }));
  };
  
  // Render a tool badge
  const renderToolBadge = (toolId: string, index: number) => {
    return (
      <motion.div
        key={toolId}
        className={`text-xs px-2 py-0.5 rounded-full ${
          darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'
        }`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
      >
        {toolId}
      </motion.div>
    );
  };
  
  return (
    <div className="relative">
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        style={getHandleStyle(Position.Left)}
        isConnectable={isConnectable}
      />
      
      {/* Main node content */}
      <motion.div
        className="min-w-[180px] p-3"
        style={getNodeStyle()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Status indicator */}
        <div className="absolute -top-1 -right-1">
          <motion.div
            className="w-4 h-4 rounded-full"
            style={{ background: getStatusColor() }}
            animate={getPulseAnimation()}
          />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <motion.div 
            className={`font-semibold text-base ${
              darkMode ? 'text-white' : 'text-slate-800'
            }`}
            animate={{ color: selected ? getStatusColor() : undefined }}
          >
            {data.label}
          </motion.div>
          
          {/* Type badge */}
          <div 
            className={`text-xs px-1.5 py-0.5 rounded-md ${
              darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {data.type}
          </div>
        </div>
        
        {/* Description */}
        {data.description && (
          <div className={`text-xs mb-2 ${
            darkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {data.description}
          </div>
        )}
        
        {/* Tools list */}
        {data.toolIds && data.toolIds.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {data.toolIds.map((toolId: string, index: number) => renderToolBadge(toolId, index))}
          </div>
        )}
        
        {/* Status message */}
        {data.message && (
          <motion.div 
            className={`text-xs mt-2 p-1.5 rounded ${
              data.status === 'error'
                ? darkMode 
                  ? 'bg-red-900/30 text-red-200' 
                  : 'bg-red-100 text-red-800'
                : darkMode 
                  ? 'bg-slate-800/60 text-slate-300' 
                  : 'bg-slate-100 text-slate-700'
            }`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.2 }}
          >
            {data.message}
          </motion.div>
        )}
        
        {/* Actions */}
        <div className="flex justify-end gap-1 mt-2">
          <motion.button
            className={`p-1 rounded-full ${
              darkMode 
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            aria-label="Configure"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </motion.button>
        </div>
      </motion.div>
      
      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={getHandleStyle(Position.Right)}
        isConnectable={isConnectable}
      />
      
      {/* Config panel */}
      <AnimatePresence>
        {isConfigOpen && (
          <motion.div
            className={`absolute left-full top-0 ml-2 p-3 rounded-lg z-10 min-w-[220px] ${
              darkMode 
                ? 'bg-slate-800/90 text-slate-200' 
                : 'bg-white/90 text-slate-800'
            }`}
            style={{
              backdropFilter: 'blur(8px)',
              boxShadow: darkMode 
                ? '0 4px 20px rgba(0, 0, 0, 0.5)' 
                : '0 4px 20px rgba(0, 0, 0, 0.15)',
              border: darkMode 
                ? '1px solid rgba(255, 255, 255, 0.1)' 
                : '1px solid rgba(0, 0, 0, 0.1)',
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <div className="flex justify-between items-center mb-3">
              <div className="font-medium">Configure Agent</div>
              <motion.button
                className={`p-1 rounded-full ${
                  darkMode 
                    ? 'hover:bg-slate-700/50' 
                    : 'hover:bg-slate-200/50'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsConfigOpen(false)}
                aria-label="Close configuration"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
            
            {/* Agent configuration form fields would go here */}
            <div className="space-y-3">
              <div>
                <label className={`block text-xs mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Agent Name
                </label>
                <input
                  type="text"
                  className={`w-full p-1.5 rounded text-sm ${
                    darkMode 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-slate-100 border-slate-300 text-slate-800'
                  }`}
                  value={data.label}
                  onChange={(e) => updateNodeData({ label: e.target.value })}
                />
              </div>
              
              <div>
                <label className={`block text-xs mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Description
                </label>
                <textarea
                  className={`w-full p-1.5 rounded text-sm ${
                    darkMode 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-slate-100 border-slate-300 text-slate-800'
                  }`}
                  value={data.description || ''}
                  onChange={(e) => updateNodeData({ description: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Register the node type for React Flow
export default memo(AgentNode);