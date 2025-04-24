import React, { FC, useState, memo } from 'react';
import { Handle, Position, NodeProps, NodeToolbar } from 'reactflow';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { FiSettings, FiPlay, FiTrash2, FiCheck, FiX, FiLoader } from 'react-icons/fi';
import { RootState } from '../../store';

/**
 * WorkflowNode - Represents an agent node in the workflow editor
 * 
 * A highly interactive, visually rich component that displays agent information
 * and provides controls for editing, executing, and managing nodes in the workflow.
 * 
 * Features:
 * - Glassmorphic/neomorphic styling based on dark/light mode
 * - Status indicators with animated transitions
 * - Interactive connection handles with visual feedback
 * - Animated hover and action states
 * - Contextual toolbars for node operations
 */
const WorkflowNode: FC<NodeProps> = memo(({ id, data, selected }) => {
  const [showToolbar, setShowToolbar] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const darkMode = useSelector((state: RootState) => state.ui.darkMode);
  
  // Extract agent data
  const { agent, status, onEdit, onDelete, onExecute } = data;
  
  // Handle status-based styling
  const getStatusColor = () => {
    switch (status) {
      case 'running':
        return 'text-yellow-400';
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };
  
  // Get the status icon based on current node status
  const StatusIcon = () => {
    switch (status) {
      case 'running':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className={`${getStatusColor()} text-lg`}
          >
            <FiLoader />
          </motion.div>
        );
      case 'success':
        return <FiCheck className={`${getStatusColor()} text-lg`} />;
      case 'error':
        return <FiX className={`${getStatusColor()} text-lg`} />;
      default:
        return null;
    }
  };
  
  // Animation variants
  const nodeVariants = {
    idle: { scale: 1 },
    selected: { scale: 1.02 },
    hovered: { scale: 1.01 },
  };
  
  // Get the current animation state
  const getAnimationState = () => {
    if (selected) return 'selected';
    if (isHovered) return 'hovered';
    return 'idle';
  };
  
  return (
    <>
      {/* Node Toolbar */}
      <AnimatePresence>
        {showToolbar && (
          <NodeToolbar
            className={`p-1 rounded-md ${
              darkMode ? 'bg-background-surface/90' : 'bg-white/90'
            } backdrop-blur-sm shadow-lg z-10`}
            position={Position.Top}
            isVisible={showToolbar}
            offset={10}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex space-x-1"
            >
              <button
                className="node-toolbar-btn"
                onClick={() => onEdit(id)}
                title="Edit Agent"
              >
                <FiSettings className="text-accent-blue" />
              </button>
              <button
                className="node-toolbar-btn"
                onClick={() => onExecute(id)}
                title="Execute Agent"
                disabled={status === 'running'}
              >
                <FiPlay className="text-accent-green" />
              </button>
              <button
                className="node-toolbar-btn"
                onClick={() => onDelete(id)}
                title="Delete Agent"
              >
                <FiTrash2 className="text-accent-red" />
              </button>
            </motion.div>
          </NodeToolbar>
        )}
      </AnimatePresence>
      
      {/* Input Handle (Target) */}
      <Handle
        type="target"
        position={Position.Left}
        className={`w-3 h-3 rounded-full ${
          darkMode ? 'bg-background-surface border-accent-blue' : 'bg-white border-blue-500'
        } border-2 transition-all ${isHovered ? 'scale-125' : ''}`}
        style={{ 
          boxShadow: isHovered ? `0 0 8px ${darkMode ? '#6366f1' : '#818cf8'}` : 'none',
          transition: 'all 0.2s ease'
        }}
      />
      
      {/* Agent Node */}
      <motion.div
        className={`px-3 py-3 rounded-xl ${
          darkMode
            ? 'bg-glass-dark border-border'
            : 'bg-glass-light border-gray-200'
        } border ${selected ? 'ring-2 ring-accent-blue' : ''} ${
          darkMode ? 'shadow-neu-normal' : 'shadow-neu-light'
        } overflow-hidden`}
        initial="idle"
        animate={getAnimationState()}
        variants={nodeVariants}
        transition={{ duration: 0.2 }}
        onMouseEnter={() => {
          setIsHovered(true);
          setShowToolbar(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowToolbar(false);
        }}
        style={{
          minWidth: 180,
          maxWidth: 220,
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Agent Header */}
        <div className="flex items-center justify-between mb-2">
          {/* Agent Icon & Type */}
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              darkMode ? 'bg-background-secondary' : 'bg-gray-100'
            }`}>
              <motion.div
                whileHover={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.5 }}
              >
                {agent.icon ? (
                  <img src={agent.icon} alt={agent.type} className="w-5 h-5" />
                ) : (
                  <span className="text-xs font-semibold text-accent-blue">
                    {agent.type?.substr(0, 2).toUpperCase() || 'AG'}
                  </span>
                )}
              </motion.div>
            </div>
            <div>
              <h3 className={`text-sm font-medium ${
                darkMode ? 'text-text-primary' : 'text-gray-800'
              }`}>
                {agent.type || 'Agent'}
              </h3>
              <p className={`text-xs ${
                darkMode ? 'text-text-secondary' : 'text-gray-500'
              }`}>
                {agent.model?.split('/').pop() || 'Unknown Model'}
              </p>
            </div>
          </div>
          
          {/* Status Indicator */}
          <div className="status-indicator">
            <StatusIcon />
          </div>
        </div>
        
        {/* Agent Name */}
        <motion.div
          className={`px-2 py-1.5 rounded-md ${
            darkMode ? 'bg-background-secondary/70' : 'bg-gray-100/70'
          } mb-2`}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <h4 className={`text-sm font-medium truncate ${
            darkMode ? 'text-text-primary' : 'text-gray-700'
          }`}>
            {agent.name || 'Unnamed Agent'}
          </h4>
        </motion.div>
        
        {/* Agent Capabilities */}
        <div className="flex flex-wrap gap-1 mt-2">
          {agent.capabilities?.slice(0, 3).map((capability: string, index: number) => (
            <motion.span
              key={`${capability}-${index}`}
              className={`px-1.5 py-0.5 text-xs rounded-full ${
                darkMode
                  ? 'bg-background-secondary text-text-secondary'
                  : 'bg-gray-100 text-gray-600'
              }`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {capability}
            </motion.span>
          ))}
          {(agent.capabilities?.length || 0) > 3 && (
            <motion.span
              className={`px-1.5 py-0.5 text-xs rounded-full ${
                darkMode
                  ? 'bg-background-tertiary text-text-secondary'
                  : 'bg-gray-200 text-gray-600'
              }`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              +{(agent.capabilities?.length || 0) - 3} more
            </motion.span>
          )}
        </div>
      </motion.div>
      
      {/* Output Handle (Source) */}
      <Handle
        type="source"
        position={Position.Right}
        className={`w-3 h-3 rounded-full ${
          darkMode ? 'bg-background-surface border-accent-purple' : 'bg-white border-purple-500'
        } border-2 transition-all ${isHovered ? 'scale-125' : ''}`}
        style={{ 
          boxShadow: isHovered ? `0 0 8px ${darkMode ? '#8b5cf6' : '#a78bfa'}` : 'none',
          transition: 'all 0.2s ease'
        }}
      />
    </>
  );
});

export default WorkflowNode;