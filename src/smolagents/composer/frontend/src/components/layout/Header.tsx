import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiMenu, FiSettings, FiSave, FiPlay, FiInfo, FiSliders, FiSearch } from 'react-icons/fi';
import { RootState } from '../../store';
import { 
  toggleSidebar, 
  toggleSearch, 
  toggleRightPanel,
  setRightPanelView
} from '../../store/slices/uiSlice';
import { startExecution, resetExecution } from '../../store/slices/workflowSlice';

const Header: FC = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.ui.darkMode);
  const currentWorkflow = useSelector((state: RootState) => state.workflow.currentWorkflow);
  const executionStatus = useSelector((state: RootState) => state.workflow.executionStatus);
  const rightPanelOpen = useSelector((state: RootState) => state.ui.rightPanelOpen);
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen);

  const handleRunWorkflow = () => {
    if (executionStatus === 'running') {
      dispatch(resetExecution());
    } else {
      dispatch(startExecution());
    }
  };

  const handleToggleRightPanel = (view: 'properties' | 'preview' | 'debug') => {
    if (rightPanelOpen && view === 'properties') {
      dispatch(toggleRightPanel());
    } else {
      dispatch(setRightPanelView(view));
    }
  };

  return (
    <header className="h-16 border-b border-border bg-background-secondary shadow-neu-flat z-10">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left section */}
        <div className="flex items-center">
          {/* Menu toggle button with animation */}
          <motion.button
            className="p-2 mr-4 rounded-full hover:bg-background-surface text-text-secondary hover:text-text-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch(toggleSidebar())}
            aria-label="Toggle sidebar"
          >
            <motion.div
              animate={{ rotate: sidebarOpen ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              <FiMenu size={24} />
            </motion.div>
          </motion.button>
          
          {/* Workflow title */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-text-primary">
              {currentWorkflow?.name || 'New Workflow'}
            </h1>
            {currentWorkflow?.status === 'draft' && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-accent-amber/20 text-accent-amber">
                Draft
              </span>
            )}
          </div>
        </div>

        {/* Center section - Search */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <motion.button
            className="px-4 py-2 flex items-center text-sm text-text-secondary rounded-full border border-border bg-background-surface shadow-neu-flat hover:shadow-neu-raised hover:-translate-y-0.5 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => dispatch(toggleSearch())}
          >
            <FiSearch className="mr-2" />
            <span>Search (⌘+K)</span>
          </motion.button>
        </div>
        
        {/* Right section */}
        <div className="flex items-center space-x-2">
          {/* Action buttons */}
          <motion.button
            className="p-2 rounded-lg bg-background-surface text-text-secondary hover:text-text-primary shadow-neu-flat hover:shadow-neu-raised hover:-translate-y-0.5 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => console.log('Save workflow')}
            aria-label="Save workflow"
          >
            <FiSave size={20} />
          </motion.button>
          
          <motion.button
            className={`p-2 rounded-lg shadow-neu-flat hover:shadow-neu-raised hover:-translate-y-0.5 transition-all duration-300 ${
              executionStatus === 'running' 
                ? 'bg-accent-red/20 text-accent-red' 
                : 'bg-accent-green/20 text-accent-green'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRunWorkflow}
            aria-label={executionStatus === 'running' ? 'Stop execution' : 'Run workflow'}
          >
            <FiPlay size={20} />
          </motion.button>
          
          <motion.button
            className={`p-2 rounded-lg shadow-neu-flat hover:shadow-neu-raised hover:-translate-y-0.5 transition-all duration-300 ${
              rightPanelOpen ? 'bg-accent-blue/20 text-accent-blue' : 'bg-background-surface text-text-secondary hover:text-text-primary'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleToggleRightPanel('properties')}
            aria-label="Toggle properties panel"
          >
            <FiSliders size={20} />
          </motion.button>
          
          <motion.button
            className="p-2 rounded-lg bg-background-surface text-text-secondary hover:text-text-primary shadow-neu-flat hover:shadow-neu-raised hover:-translate-y-0.5 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => console.log('Show info')}
            aria-label="Information"
          >
            <FiInfo size={20} />
          </motion.button>
          
          <motion.button
            className="p-2 rounded-lg bg-background-surface text-text-secondary hover:text-text-primary shadow-neu-flat hover:shadow-neu-raised hover:-translate-y-0.5 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => console.log('Open settings')}
            aria-label="Settings"
          >
            <FiSettings size={20} />
          </motion.button>
        </div>
      </div>
      
      {/* Execution status indicator */}
      {executionStatus === 'running' && (
        <motion.div 
          className="h-1 bg-gradient-to-r from-accent-blue to-accent-purple"
          initial={{ width: 0 }}
          animate={{ 
            width: '100%',
            transition: { duration: 3, repeat: Infinity }
          }}
        />
      )}
    </header>
  );
};

export default Header;