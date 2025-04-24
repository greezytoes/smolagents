import { FC, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Node, Edge } from 'reactflow';
import { 
  FiSave, FiTrash2, FiLayout, FiDownload, FiUpload, 
  FiPlay, FiPause, FiMaximize2, FiZoomIn, FiZoomOut, 
  FiCheck
} from 'react-icons/fi';
import { RootState } from '../../store';

interface WorkflowToolbarProps {
  selectedElements: (Node | Edge)[];
  onDeleteSelected: () => void;
}

/**
 * WorkflowToolbar - Component providing actions for manipulating the workflow
 * Features:
 * - Save/load workflow
 * - Delete selected elements
 * - Execute/debug workflow
 * - Layout adjustments
 * - Export/import functionality
 */
const WorkflowToolbar: FC<WorkflowToolbarProps> = ({ 
  selectedElements,
  onDeleteSelected
}) => {
  const darkMode = useSelector((state: RootState) => state.ui.darkMode);
  const currentWorkflow = useSelector((state: RootState) => state.workflow.currentWorkflow);
  const [isSaving, setIsSaving] = useState(false);
  const dispatch = useDispatch();
  
  // Handle saving the workflow
  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      
      // Here we would actually dispatch an action to persist the workflow
      // dispatch(saveWorkflow(currentWorkflow.id));
    }, 800);
  };
  
  // Check if delete button should be disabled
  const isDeleteDisabled = selectedElements.length === 0;
  
  // Animation variants for buttons
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    disabled: { opacity: 0.5, scale: 1 }
  };
  
  // Animation variants for the save success indicator
  const saveIndicatorVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 }
  };
  
  return (
    <div className={`workflow-toolbar py-2 px-4 border-b ${
      darkMode ? 'bg-background-surface border-border' : 'bg-white border-gray-200'
    } flex items-center justify-between`}>
      {/* Left Section: Workflow Actions */}
      <div className="flex items-center space-x-1.5">
        {/* Save Button */}
        <div className="relative">
          <motion.button
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            disabled={isSaving}
            onClick={handleSave}
            className={`p-2 rounded-md ${
              darkMode 
                ? 'hover:bg-background-tertiary text-text-primary' 
                : 'hover:bg-gray-100 text-gray-700'
            } relative transition-colors`}
            aria-label="Save workflow"
          >
            <FiSave size={18} className={isSaving ? 'opacity-0' : ''} />
            {isSaving && (
              <span className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{
                    rotate: 360
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <div className="h-4 w-4 border-2 border-t-accent-primary border-r-accent-primary border-b-transparent border-l-transparent rounded-full" />
                </motion.div>
              </span>
            )}
          </motion.button>
          
          {/* Save Success Indicator */}
          <AnimatePresence>
            {!isSaving && (
              <motion.div
                variants={saveIndicatorVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ type: "spring", duration: 0.3 }}
                className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5 shadow-lg"
              >
                <FiCheck size={10} className="text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Delete Button */}
        <motion.button
          variants={buttonVariants}
          initial="initial"
          whileHover={isDeleteDisabled ? "disabled" : "hover"}
          whileTap={isDeleteDisabled ? "disabled" : "tap"}
          disabled={isDeleteDisabled}
          onClick={onDeleteSelected}
          className={`p-2 rounded-md ${
            isDeleteDisabled 
              ? darkMode ? 'text-text-tertiary' : 'text-gray-300'
              : darkMode 
                ? 'hover:bg-background-tertiary text-text-primary hover:text-red-400' 
                : 'hover:bg-gray-100 text-gray-700 hover:text-red-500'
          } transition-colors`}
          aria-label="Delete selected elements"
        >
          <FiTrash2 size={18} />
        </motion.button>
        
        {/* Layout Button */}
        <motion.button
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          className={`p-2 rounded-md ${
            darkMode 
              ? 'hover:bg-background-tertiary text-text-primary' 
              : 'hover:bg-gray-100 text-gray-700'
          } transition-colors`}
          aria-label="Auto-layout workflow"
        >
          <FiLayout size={18} />
        </motion.button>
      </div>
      
      {/* Center Section: Workflow Title */}
      <div className="flex-1 text-center">
        <input
          type="text"
          value={currentWorkflow?.name || 'Untitled Workflow'}
          onChange={(e) => {
            // Here we would dispatch an action to update the workflow name
            // dispatch(updateWorkflowName(currentWorkflow.id, e.target.value));
          }}
          className={`px-2 py-1 text-sm font-medium rounded-md border-0 ${
            darkMode 
              ? 'bg-background-surface focus:bg-background-secondary text-center' 
              : 'bg-white focus:bg-gray-50 text-center'
          } focus:ring-1 focus:ring-accent-primary focus:outline-none transition-colors`}
        />
      </div>
      
      {/* Right Section: Workflow Execution & Export */}
      <div className="flex items-center space-x-1.5">
        {/* Execute Button */}
        <motion.button
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          className={`px-3 py-1.5 rounded-md flex items-center space-x-1 ${
            darkMode 
              ? 'bg-accent-primary hover:bg-accent-primary-dark text-white' 
              : 'bg-accent-primary hover:bg-accent-primary-dark text-white'
          } transition-colors`}
          aria-label="Execute workflow"
        >
          <FiPlay size={14} />
          <span className="text-sm font-medium">Run</span>
        </motion.button>
        
        {/* Export Button */}
        <motion.button
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          className={`p-2 rounded-md ${
            darkMode 
              ? 'hover:bg-background-tertiary text-text-primary' 
              : 'hover:bg-gray-100 text-gray-700'
          } transition-colors`}
          aria-label="Export workflow"
        >
          <FiDownload size={18} />
        </motion.button>
        
        {/* Import Button */}
        <motion.button
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          className={`p-2 rounded-md ${
            darkMode 
              ? 'hover:bg-background-tertiary text-text-primary' 
              : 'hover:bg-gray-100 text-gray-700'
          } transition-colors`}
          aria-label="Import workflow"
        >
          <FiUpload size={18} />
        </motion.button>
      </div>
      
      {/* Additional Controls (can be toggled on/off) */}
      <div className="ml-4 border-l pl-4 border-border hidden sm:flex items-center space-x-1.5">
        <motion.button
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          className={`p-1.5 rounded-md ${
            darkMode 
              ? 'hover:bg-background-tertiary text-text-secondary' 
              : 'hover:bg-gray-100 text-gray-500'
          } transition-colors`}
          aria-label="Zoom in"
        >
          <FiZoomIn size={16} />
        </motion.button>
        
        <motion.button
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          className={`p-1.5 rounded-md ${
            darkMode 
              ? 'hover:bg-background-tertiary text-text-secondary' 
              : 'hover:bg-gray-100 text-gray-500'
          } transition-colors`}
          aria-label="Zoom out"
        >
          <FiZoomOut size={16} />
        </motion.button>
        
        <motion.button
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          className={`p-1.5 rounded-md ${
            darkMode 
              ? 'hover:bg-background-tertiary text-text-secondary' 
              : 'hover:bg-gray-100 text-gray-500'
          } transition-colors`}
          aria-label="Fit view"
        >
          <FiMaximize2 size={16} />
        </motion.button>
      </div>
    </div>
  );
};

export default WorkflowToolbar;