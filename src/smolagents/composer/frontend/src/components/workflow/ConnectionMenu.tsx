import React, { FC, useState } from 'react';
import { motion } from 'framer-motion';
import { FiLink2, FiX, FiCheck } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ConnectionConfig } from '../../types';
import { Node } from 'reactflow';

interface ConnectionMenuProps {
  position: { x: number; y: number };
  sourceNodeId: string;
  onClose: () => void;
  onConnect: (targetNodeId: string, config: ConnectionConfig) => void;
}

/**
 * ConnectionMenu - Floating menu to configure connections between nodes
 * 
 * Features:
 * - Animated appearance and disappearance
 * - Connection type selection
 * - Custom labels and parameters
 */
const ConnectionMenu: FC<ConnectionMenuProps> = ({ 
  position, 
  sourceNodeId, 
  onClose, 
  onConnect 
}) => {
  const darkMode = useSelector((state: RootState) => state.ui.darkMode);
  const { nodes } = useSelector((state: RootState) => state.workflow);
  
  const [selectedNodeId, setSelectedNodeId] = useState<string>('');
  const [connectionLabel, setConnectionLabel] = useState<string>('');
  const [connectionColor, setConnectionColor] = useState<string>('#4299e1');
  
  // Available target nodes (excluding source node)
  const availableNodes = nodes.filter((node: Node) => node.id !== sourceNodeId);
  
  // Available connection colors
  const connectionColors = [
    '#4299e1', // blue
    '#48bb78', // green
    '#ed8936', // orange
    '#a0aec0', // gray
    '#d53f8c', // pink
    '#805ad5', // purple
  ];
  
  const handleConnect = () => {
    if (!selectedNodeId) return;
    
    onConnect(selectedNodeId, {
      label: connectionLabel,
      color: connectionColor,
      data: {}
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`absolute rounded-lg shadow-neu-normal overflow-hidden z-20 ${
        darkMode ? 'bg-background-surface border border-border/50' : 'bg-white border border-gray-200'
      }`}
      style={{
        left: position.x,
        top: position.y,
        width: 280,
      }}
    >
      {/* Header */}
      <div className={`p-3 border-b ${darkMode ? 'border-border' : 'border-gray-200'} flex items-center justify-between`}>
        <div className="flex items-center">
          <FiLink2 className="mr-2" />
          <h3 className="font-medium text-sm">Create Connection</h3>
        </div>
        <button 
          onClick={onClose}
          className={`p-1 rounded-full ${darkMode ? 'hover:bg-background-secondary' : 'hover:bg-gray-100'}`}
        >
          <FiX size={14} />
        </button>
      </div>
      
      {/* Content */}
      <div className="p-3 space-y-3">
        {/* Target Node Selection */}
        <div>
          <label className="block text-xs font-medium mb-1">Connect to</label>
          <select
            value={selectedNodeId}
            onChange={(e) => setSelectedNodeId(e.target.value)}
            className={`w-full rounded-md border px-3 py-2 text-sm ${
              darkMode 
                ? 'bg-background-secondary border-border/50 text-text-primary' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">Select a node</option>
            {availableNodes.map((node: Node) => (
              <option key={node.id} value={node.id}>
                {node.data.label || `Node ${node.id.substring(0, 6)}`}
              </option>
            ))}
          </select>
        </div>
        
        {/* Connection Label */}
        <div>
          <label className="block text-xs font-medium mb-1">Connection Label</label>
          <input
            type="text"
            value={connectionLabel}
            onChange={(e) => setConnectionLabel(e.target.value)}
            placeholder="E.g., Sends data to..."
            className={`w-full rounded-md border px-3 py-2 text-sm ${
              darkMode 
                ? 'bg-background-secondary border-border/50 text-text-primary placeholder-text-tertiary' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>
        
        {/* Connection Color */}
        <div>
          <label className="block text-xs font-medium mb-1">Connection Color</label>
          <div className="flex space-x-2">
            {connectionColors.map(color => (
              <button
                key={color}
                onClick={() => setConnectionColor(color)}
                className={`w-6 h-6 rounded-full ${connectionColor === color ? 'ring-2 ring-offset-2 ring-accent-primary' : ''}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className={`p-3 border-t ${darkMode ? 'border-border' : 'border-gray-200'} flex items-center justify-end`}>
        <button
          onClick={onClose}
          className={`px-3 py-1 rounded-md text-sm mr-2 ${
            darkMode ? 'bg-background-secondary hover:bg-background-tertiary' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Cancel
        </button>
        <button
          onClick={handleConnect}
          disabled={!selectedNodeId}
          className={`px-3 py-1 rounded-md text-sm flex items-center ${
            selectedNodeId 
              ? 'bg-accent-primary hover:bg-accent-primary-darker text-white' 
              : `${darkMode ? 'bg-background-tertiary text-text-tertiary' : 'bg-gray-200 text-gray-500'}`
          }`}
        >
          <FiCheck size={14} className="mr-1" />
          Connect
        </button>
      </div>
    </motion.div>
  );
};

export default ConnectionMenu;