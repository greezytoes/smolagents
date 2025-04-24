import React, { FC, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiPlusCircle, FiFolder } from 'react-icons/fi';
import { RootState } from '../../store';
import { Agent } from '../../store/slices/agentsSlice';

// Extended Agent interface with additional properties for our UI
interface ExtendedAgent extends Agent {
  category?: string;
  custom?: boolean;
  capabilities?: string[];
}

/**
 * AgentLibrary - Component for browsing and selecting agents to add to workflows
 * 
 * Features:
 * - Searchable and filterable agent catalog
 * - Drag and drop functionality for workflow creation
 * - Interactive card animations and hover effects
 * - Category-based organization for different agent types
 */
const AgentLibrary: FC = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('preset');
  const darkMode = useSelector((state: RootState) => state.ui.darkMode);
  
  // Get agents from Redux
  const agents: ExtendedAgent[] = useSelector((state: RootState) => state.agents.agents);
  
  // Extract unique categories from agents
  const categories = [...new Set(agents.map((agent: ExtendedAgent) => agent.category))].filter(Boolean) as string[];
  
  // Filter agents based on search term and category
  const filteredAgents = agents.filter((agent: ExtendedAgent) => {
    const matchesSearch = searchTerm === '' ||
      agent.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filterCategory || agent.category === filterCategory;
    
    const matchesTab = activeTab === 'preset' ? !agent.custom : agent.custom;
    
    return matchesSearch && matchesCategory && matchesTab;
  });
  
  // Handle drag start for agent card
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, agent: ExtendedAgent) => {
    // Add data to the drag event
    event.dataTransfer.setData('application/agentId', agent.id);
    event.dataTransfer.setData('application/agentData', JSON.stringify(agent));
    event.dataTransfer.effectAllowed = 'move';
  };
  
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className={`px-4 py-3 border-b ${
        darkMode ? 'border-border' : 'border-gray-200'
      }`}>
        <h3 className={`text-lg font-medium ${
          darkMode ? 'text-text-primary' : 'text-gray-800'
        }`}>
          Agent Library
        </h3>
        <p className={`text-sm ${
          darkMode ? 'text-text-secondary' : 'text-gray-500'
        }`}>
          Drag agents to the canvas
        </p>
      </div>
      
      {/* Search and filter */}
      <div className={`p-3 border-b ${
        darkMode ? 'border-border' : 'border-gray-200'
      }`}>
        <div className="relative mb-3">
          <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
            darkMode ? 'text-text-secondary' : 'text-gray-400'
          }`} />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-3 py-2 rounded-md border ${
              darkMode 
                ? 'bg-background-secondary/50 border-border text-text-primary' 
                : 'bg-gray-50 border-gray-200 text-gray-800'
            } focus:outline-none focus:ring-2 focus:ring-accent-blue/30`}
          />
        </div>
        
        {/* Category filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterCategory(null)}
              className={`px-2 py-1 text-xs rounded-full flex items-center gap-1.5 transition-all ${
                filterCategory === null 
                  ? (darkMode ? 'bg-accent-blue/20 text-accent-blue' : 'bg-blue-100 text-blue-700')
                  : (darkMode ? 'bg-background-secondary text-text-secondary hover:bg-background-surface hover:text-text-primary' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700')
              }`}
            >
              <FiFilter size={10} />
              All
            </button>
            
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilterCategory(category === filterCategory ? null : category)}
                className={`px-2 py-1 text-xs rounded-full flex items-center gap-1.5 transition-all ${
                  category === filterCategory 
                    ? (darkMode ? 'bg-accent-purple/20 text-accent-purple' : 'bg-purple-100 text-purple-700')
                    : (darkMode ? 'bg-background-secondary text-text-secondary hover:bg-background-surface hover:text-text-primary' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700')
                }`}
              >
                <FiFolder size={10} />
                {category}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Tabs */}
      <div className={`flex border-b ${
        darkMode ? 'border-border' : 'border-gray-200'
      }`}>
        <button
          onClick={() => setActiveTab('preset')}
          className={`flex-1 py-2 text-sm font-medium relative ${
            activeTab === 'preset' 
              ? (darkMode ? 'text-accent-blue' : 'text-blue-600') 
              : (darkMode ? 'text-text-secondary' : 'text-gray-500')
          }`}
        >
          Preset Agents
          {activeTab === 'preset' && (
            <motion.div 
              className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                darkMode ? 'bg-accent-blue' : 'bg-blue-500'
              }`}
              layoutId="activeTabIndicator"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`flex-1 py-2 text-sm font-medium relative ${
            activeTab === 'custom' 
              ? (darkMode ? 'text-accent-blue' : 'text-blue-600') 
              : (darkMode ? 'text-text-secondary' : 'text-gray-500')
          }`}
        >
          Custom Agents
          {activeTab === 'custom' && (
            <motion.div
              className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                darkMode ? 'bg-accent-blue' : 'bg-blue-500'
              }`}
              layoutId="activeTabIndicator"
            />
          )}
        </button>
      </div>
      
      {/* Agent List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <AnimatePresence>
          {filteredAgents.length > 0 ? (
            filteredAgents.map((agent: ExtendedAgent) => (
              <motion.div
                key={agent.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  draggable
                  onDragStart={(e: React.DragEvent<HTMLDivElement>) => onDragStart(e, agent)}
                  className={`p-3 rounded-lg cursor-grab active:cursor-grabbing ${
                    darkMode
                      ? 'bg-glass-dark hover:bg-glass-dark-hover shadow-neu-normal'
                      : 'bg-white hover:bg-gray-50 shadow-neu-light'
                  } border border-border/30 transition-all duration-200 hover:scale-[1.02]`}
              >
                <div className="flex items-start gap-3">
                  {/* Agent Icon */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    darkMode ? 'bg-background-secondary' : 'bg-gray-100'
                  }`}>
                    <motion.div 
                      whileHover={{ rotate: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {agent.icon ? (
                        <img src={agent.icon} alt={agent.name} className="w-6 h-6" />
                      ) : (
                        <span className={`text-sm font-semibold ${
                          darkMode ? 'text-accent-blue' : 'text-blue-500'
                        }`}>
                          {agent.name?.substr(0, 2).toUpperCase() || 'AG'}
                        </span>
                      )}
                    </motion.div>
                  </div>
                  
                  {/* Agent Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-medium truncate ${
                      darkMode ? 'text-text-primary' : 'text-gray-800'
                    }`}>
                      {agent.name || 'Unnamed Agent'}
                    </h4>
                    
                    <p className={`text-xs mt-0.5 line-clamp-2 ${
                      darkMode ? 'text-text-secondary' : 'text-gray-500'
                    }`}>
                      {agent.description || 'No description available'}
                    </p>
                    
                    {/* Agent Tags/Capabilities */}
                    {agent.capabilities && agent.capabilities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {agent.capabilities?.slice(0, 2).map((capability: string, index: number) => (
                          <span
                            key={`${agent.id}-${capability}-${index}`}
                            className={`px-1.5 py-0.5 text-[10px] rounded-full ${
                              darkMode 
                                ? 'bg-background-tertiary text-text-secondary' 
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {capability}
                          </span>
                        ))}
                        
                        {agent.capabilities && agent.capabilities.length > 2 && (
                          <span className={`px-1.5 py-0.5 text-[10px] rounded-full ${
                            darkMode 
                              ? 'bg-background-tertiary text-text-secondary' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            +{agent.capabilities.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Drag handle visual indicator */}
                <div className={`absolute top-1 right-1 opacity-60 ${
                  darkMode ? 'text-text-secondary' : 'text-gray-400'
                }`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 9h14M5 15h14"></path>
                  </svg>
                </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-6 text-center rounded-lg ${
                darkMode ? 'bg-background-surface' : 'bg-gray-50'
              }`}
            >
              <div className="flex justify-center mb-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  darkMode ? 'bg-background-secondary' : 'bg-gray-100'
                }`}>
                  <FiSearch className={darkMode ? 'text-text-secondary' : 'text-gray-400'} size={20} />
                </div>
              </div>
              <h4 className={`text-sm font-medium ${
                darkMode ? 'text-text-primary' : 'text-gray-700'
              }`}>
                No agents found
              </h4>
              <p className={`text-xs mt-1 ${
                darkMode ? 'text-text-secondary' : 'text-gray-500'
              }`}>
                Try adjusting your search or filters
              </p>
              
              {activeTab === 'custom' && (
                <motion.button
                  className="mt-4 btn btn-primary py-1.5 px-3 text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiPlusCircle className="mr-1.5" size={14} />
                  Create Agent
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Footer with actions */}
      <div className={`p-3 border-t ${
        darkMode ? 'border-border' : 'border-gray-200'
      }`}>
        <motion.button
          className="btn btn-primary w-full py-1.5 flex items-center justify-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiPlusCircle className="mr-1.5" size={16} />
          Create New Agent
        </motion.button>
      </div>
    </div>
  );
};

export default AgentLibrary;