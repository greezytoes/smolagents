import { FC, memo, useState } from 'react';
import { Handle, Position, NodeProps, Node } from 'reactflow';
import { motion } from 'framer-motion';
import { FiSettings, FiX, FiMaximize2, FiActivity } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Agent } from '../../store/slices/agentsSlice';
import { ExtendedAgent, NodeData } from '../../types';

/**
 * AgentNode - Custom ReactFlow node component representing an agent in the workflow
 * Features:
 * - Animated interactions and state changes
 * - Input and output handles for connections
 * - Context menu for node operations
 */
const AgentNode: FC<{
  id: string;
  data: NodeData;
  selected: boolean;
}> = ({ id, data, selected }) => {
  const { agent } = data as { agent: ExtendedAgent };
  const darkMode = useSelector((state: RootState) => state.ui.darkMode);
  const [showContextMenu, setShowContextMenu] = useState(false);
  
  // Animation variants for the node
  const nodeVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.2 } },
    selected: { boxShadow: '0 0 0 2px #6366f1', scale: 1.02 },
    hover: { scale: 1.02 },
  };
  
  // Handle right-click for context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowContextMenu(!showContextMenu);
  };
  
  return (
    <>
      {/* Connector Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className={`w-3 h-3 border-2 ${darkMode ? 'border-border bg-background-dark' : 'border-gray-300 bg-white'}`}
      />
      <Handle
        type="source"
        position={Position.Right}
        className={`w-3 h-3 border-2 ${darkMode ? 'border-border bg-background-dark' : 'border-gray-300 bg-white'}`}
      />
      
      {/* Node Container */}
      <motion.div
        initial="initial"
        animate="animate"
        whileHover="hover"
        variants={nodeVariants}
        className={`agent-node rounded-lg shadow-neu-normal overflow-hidden ${
          selected ? 'ring-2 ring-accent-primary' : ''
        } ${darkMode ? 'bg-background-surface' : 'bg-white'}`}
        style={{ width: 220 }}
        onContextMenu={handleContextMenu}
      >
        {/* Node Header */}
        <div 
          className="p-2 flex items-center justify-between" 
          style={{ 
            background: agent.color ? `${agent.color}20` : '#6366f120',
            borderLeft: `4px solid ${agent.color || '#6366f1'}`
          }}
        >
          <div className="flex items-center">
            <div className="text-xl mr-2">{agent.icon || '🤖'}</div>
            <h4 className="font-medium text-sm truncate">{agent.name}</h4>
          </div>
          <div className="flex space-x-1">
            <button className="p-1 rounded hover:bg-black/10">
              <FiSettings size={14} />
            </button>
          </div>
        </div>
        
        {/* Node Content */}
        <div className="p-3">
          <p className="text-xs text-text-secondary mb-2">
            {agent.description}
          </p>
          
          {/* Tools */}
          <div className="mt-2">
            <h5 className="text-xs font-medium mb-1">Tools</h5>
            <div className="space-y-1">
              {agent.tools && agent.tools.length > 0 ? (
                agent.tools.map((tool) => (
                  <div 
                    key={tool.id} 
                    className={`px-2 py-1 text-xs rounded-sm ${
                      darkMode ? 'bg-background-secondary' : 'bg-gray-100'
                    }`}
                  >
                    {tool.name}
                  </div>
                ))
              ) : (
                <div className="text-xs text-text-tertiary">No tools configured</div>
              )}
            </div>
          </div>
          
          {/* Model */}
          <div className="mt-2">
            <h5 className="text-xs font-medium mb-1">Model</h5>
            <div 
              className={`px-2 py-1 text-xs rounded-sm ${
                darkMode ? 'bg-background-secondary' : 'bg-gray-100'
              }`}
            >
              {agent.model?.name || 'Not specified'}
            </div>
          </div>
        </div>
        
        {/* Node Status */}
        <div className={`px-3 py-2 border-t ${darkMode ? 'border-border' : 'border-gray-100'} flex items-center justify-between`}>
          <div className="flex items-center">
            <FiActivity size={12} className="text-accent-primary mr-1" />
            <span className="text-xs">Ready</span>
          </div>
          <div className="text-xs text-text-tertiary">
            ID: {id.substring(0, 8)}
          </div>
        </div>
      </motion.div>
      
      {/* Context Menu */}
      {showContextMenu && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`absolute top-full left-0 mt-1 py-1 rounded-md shadow-lg z-10 ${
            darkMode ? 'bg-background-surface border border-border' : 'bg-white border border-gray-200'
          }`}
          style={{ width: 180 }}
        >
          <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-black/5 flex items-center">
            <FiSettings size={12} className="mr-2" />
            Configure Agent
          </button>
          <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-black/5 flex items-center">
            <FiMaximize2 size={12} className="mr-2" />
            Expand Node
          </button>
          <div className={`my-1 border-b ${darkMode ? 'border-border' : 'border-gray-200'}`}></div>
          <button className="w-full text-left px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 flex items-center">
            <FiX size={12} className="mr-2" />
            Remove Node
          </button>
        </motion.div>
      )}
    </>
  );
};

export default memo(AgentNode);