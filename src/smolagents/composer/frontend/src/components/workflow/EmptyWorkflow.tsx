import { FC } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { IconArrowRight } from '../ui/icons';
import { setActiveTab } from '../../store/slices/uiSlice';

interface EmptyWorkflowProps {
  /**
   * Additional CSS class names
   */
  className?: string;
}

/**
 * EmptyWorkflow - A visually engaging component displayed when no workflow exists
 * 
 * Features:
 * - Animated guidance for new users
 * - Glassmorphic and neomorphic design elements
 * - Clear call-to-action to help users get started
 * - Smooth animations to enhance the UX
 */
const EmptyWorkflow: FC<EmptyWorkflowProps> = ({ className = '' }) => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.ui.darkMode);
  
  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };
  
  const handleOpenAgentLibrary = () => {
    dispatch(setActiveTab('agentLibrary'));
  };
  
  return (
    <div className={`flex items-center justify-center h-full w-full ${className}`}>
      <motion.div
        className={`max-w-md ${
          darkMode 
            ? 'bg-glass-dark' 
            : 'bg-glass-light'
        } p-8 rounded-xl text-center`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Decorative circles for a futuristic look */}
        <div className="absolute -left-4 -top-4 w-24 h-24 rounded-full bg-accent-blue/10 blur-xl"></div>
        <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-accent-purple/10 blur-xl"></div>
        
        <motion.div 
          className="relative mb-8 flex justify-center"
          variants={itemVariants}
        >
          <div className={`w-20 h-20 rounded-full ${
            darkMode ? 'shadow-neu-normal bg-background-surface' : 'shadow-neu-light bg-gray-50'
          } flex items-center justify-center`}>
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <svg 
                width="48" 
                height="48" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke={darkMode ? '#6366f1' : '#818cf8'} 
                strokeWidth="1.5" 
                className="animate-glow-pulse"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.h2 
          className={`text-2xl font-semibold mb-3 ${darkMode ? 'text-text-primary' : 'text-gray-800'}`}
          variants={itemVariants}
        >
          Create Your First Workflow
        </motion.h2>
        
        <motion.p 
          className={`mb-6 ${darkMode ? 'text-text-secondary' : 'text-gray-600'}`}
          variants={itemVariants}
        >
          Drag and drop agents from the library to create powerful workflows that solve complex tasks automatically.
        </motion.p>
        
        <motion.div variants={itemVariants}>
          <motion.button
            className={`btn btn-primary w-full flex items-center justify-center gap-2`}
            onClick={handleOpenAgentLibrary}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Open Agent Library
            <IconArrowRight size={18} animated glow />
          </motion.button>
        </motion.div>
        
        <motion.div 
          className="mt-10 grid grid-cols-3 gap-4"
          variants={itemVariants}
        >
          {/* Step 1 */}
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-background-surface/50' : 'bg-white/50'} text-center`}>
            <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${
              darkMode ? 'bg-background-secondary' : 'bg-gray-100'
            } ${darkMode ? 'text-accent-blue' : 'text-blue-600'}`}>
              1
            </div>
            <p className={`text-xs ${darkMode ? 'text-text-secondary' : 'text-gray-600'}`}>
              Select Agents
            </p>
          </div>
          
          {/* Step 2 */}
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-background-surface/50' : 'bg-white/50'} text-center`}>
            <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${
              darkMode ? 'bg-background-secondary' : 'bg-gray-100'
            } ${darkMode ? 'text-accent-purple' : 'text-purple-600'}`}>
              2
            </div>
            <p className={`text-xs ${darkMode ? 'text-text-secondary' : 'text-gray-600'}`}>
              Connect Flows
            </p>
          </div>
          
          {/* Step 3 */}
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-background-surface/50' : 'bg-white/50'} text-center`}>
            <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${
              darkMode ? 'bg-background-secondary' : 'bg-gray-100'
            } ${darkMode ? 'text-accent-green' : 'text-green-600'}`}>
              3
            </div>
            <p className={`text-xs ${darkMode ? 'text-text-secondary' : 'text-gray-600'}`}>
              Run Workflow
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EmptyWorkflow;