import { FC, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, 
  FiGrid, 
  FiCpu, 
  FiSettings, 
  FiChevronRight, 
  FiPlusCircle, 
  FiUser 
} from 'react-icons/fi';

import { RootState } from '../../store';
import Logo from '../ui/Logo';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { Agent, AgentTemplate } from '../../store/slices/agentsSlice';
import { Workflow } from '../../store/slices/workflowSlice';

// Type for NavLink isActive function
type IsActiveFunction = (props: { isActive: boolean }) => string;

const Sidebar: FC = () => {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen);
  const { agents, templates } = useSelector((state: RootState) => state.agents);
  const { workflows } = useSelector((state: RootState) => state.workflow);
  
  const [agentsExpanded, setAgentsExpanded] = useState(true);
  const [templatesExpanded, setTemplatesExpanded] = useState(false);
  const [workflowsExpanded, setWorkflowsExpanded] = useState(true);
  
  const sidebarVariants = {
    open: { 
      width: '280px',
      transition: { 
        type: 'spring', 
        stiffness: 400, 
        damping: 30 
      }
    },
    closed: { 
      width: '0px',
      transition: { 
        type: 'spring', 
        stiffness: 400, 
        damping: 40 
      }
    }
  };

  const menuItemVariants = {
    initial: { 
      opacity: 0, 
      x: -20 
    },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.3 
      }
    },
    exit: { 
      opacity: 0, 
      x: -20, 
      transition: { 
        duration: 0.2 
      }
    }
  };

  // Styling function for nav links
  const getNavLinkClass: IsActiveFunction = ({ isActive }) => `
    flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 
    ${isActive 
      ? 'bg-background-surface text-accent-blue shadow-neu-pressed' 
      : 'text-text-secondary hover:text-text-primary hover:bg-background-surface hover:shadow-neu-flat'
    }
  `;

  return (
    <motion.div
      className="h-full bg-background-secondary border-r border-border shadow-neu-flat overflow-hidden z-20"
      initial={sidebarOpen ? 'open' : 'closed'}
      animate={sidebarOpen ? 'open' : 'closed'}
      variants={sidebarVariants}
    >
      <div className="h-full flex flex-col w-[280px]">
        {/* Logo and header */}
        <div className="p-4 border-b border-border">
          <Logo variant="default" />
        </div>
        
        {/* Navigation menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ staggerChildren: 0.05 }}
                className="space-y-1"
              >
                {/* Main navigation links */}
                <motion.div variants={menuItemVariants}>
                  <NavLink 
                    to="/workflows" 
                    className={getNavLinkClass}
                  >
                    <FiGrid className="mr-3" size={18} />
                    Workflows
                  </NavLink>
                </motion.div>
                
                <motion.div variants={menuItemVariants}>
                  <NavLink 
                    to="/agents" 
                    className={getNavLinkClass}
                  >
                    <FiCpu className="mr-3" size={18} />
                    Agents
                  </NavLink>
                </motion.div>
                
                <motion.div variants={menuItemVariants}>
                  <NavLink 
                    to="/templates" 
                    className={getNavLinkClass}
                  >
                    <FiHome className="mr-3" size={18} />
                    Templates
                  </NavLink>
                </motion.div>
                
                <motion.div variants={menuItemVariants}>
                  <NavLink 
                    to="/settings" 
                    className={getNavLinkClass}
                  >
                    <FiSettings className="mr-3" size={18} />
                    Settings
                  </NavLink>
                </motion.div>
                
                {/* Collapsible sections */}
                <div className="mt-6">
                  {/* My Workflows section */}
                  <motion.div variants={menuItemVariants} className="mb-2">
                    <button
                      className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium text-text-primary transition-all duration-200 hover:bg-background-surface"
                      onClick={() => setWorkflowsExpanded(!workflowsExpanded)}
                    >
                      <span className="flex items-center">
                        <FiGrid className="mr-3" size={16} />
                        My Workflows
                      </span>
                      <motion.div
                        animate={{ rotate: workflowsExpanded ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FiChevronRight size={16} />
                      </motion.div>
                    </button>
                    
                    <AnimatePresence>
                      {workflowsExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="ml-6 pt-1 overflow-hidden"
                        >
                          {workflows.length > 0 ? (
                            <div className="space-y-1">
                              {workflows.map((workflow: Workflow) => (
                                <NavLink 
                                  key={workflow.id}
                                  to={`/workflows/${workflow.id}`}
                                  className={getNavLinkClass}
                                >
                                  <span className="truncate">{workflow.name}</span>
                                </NavLink>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-text-secondary px-3 py-1.5">No workflows created</p>
                          )}
                          <button className="flex items-center w-full px-3 py-1.5 rounded-md text-xs font-medium text-accent-blue hover:bg-background-surface mt-1">
                            <FiPlusCircle className="mr-2" size={12} />
                            New Workflow
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  
                  {/* My Agents section */}
                  <motion.div variants={menuItemVariants} className="mb-2">
                    <button
                      className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium text-text-primary transition-all duration-200 hover:bg-background-surface"
                      onClick={() => setAgentsExpanded(!agentsExpanded)}
                    >
                      <span className="flex items-center">
                        <FiCpu className="mr-3" size={16} />
                        My Agents
                      </span>
                      <motion.div
                        animate={{ rotate: agentsExpanded ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FiChevronRight size={16} />
                      </motion.div>
                    </button>
                    
                    <AnimatePresence>
                      {agentsExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="ml-6 pt-1 overflow-hidden"
                        >
                          {agents.length > 0 ? (
                            <div className="space-y-1">
                              {agents.map((agent: Agent) => (
                                <NavLink 
                                  key={agent.id}
                                  to={`/agents/${agent.id}`}
                                  className={getNavLinkClass}
                                >
                                  <span 
                                    className="w-2 h-2 rounded-full mr-2" 
                                    style={{ backgroundColor: agent.color || '#42a5f5' }}
                                  />
                                  <span className="truncate">{agent.name}</span>
                                </NavLink>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-text-secondary px-3 py-1.5">No agents created</p>
                          )}
                          <button className="flex items-center w-full px-3 py-1.5 rounded-md text-xs font-medium text-accent-blue hover:bg-background-surface mt-1">
                            <FiPlusCircle className="mr-2" size={12} />
                            New Agent
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  
                  {/* Templates section */}
                  <motion.div variants={menuItemVariants}>
                    <button
                      className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium text-text-primary transition-all duration-200 hover:bg-background-surface"
                      onClick={() => setTemplatesExpanded(!templatesExpanded)}
                    >
                      <span className="flex items-center">
                        <FiHome className="mr-3" size={16} />
                        Templates
                      </span>
                      <motion.div
                        animate={{ rotate: templatesExpanded ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FiChevronRight size={16} />
                      </motion.div>
                    </button>
                    
                    <AnimatePresence>
                      {templatesExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="ml-6 pt-1 overflow-hidden"
                        >
                          {templates.length > 0 ? (
                            <div className="space-y-1">
                              {templates.map((template: AgentTemplate) => (
                                <NavLink 
                                  key={template.id}
                                  to={`/templates/${template.id}`}
                                  className={getNavLinkClass}
                                >
                                  <span 
                                    className="w-2 h-2 rounded-full mr-2" 
                                    style={{ backgroundColor: template.basedOn.color || '#42a5f5' }}
                                  />
                                  <span className="truncate">{template.name}</span>
                                </NavLink>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-text-secondary px-3 py-1.5">No templates available</p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
        
        {/* User profile */}
        <div className="p-4 border-t border-border">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div 
                variants={menuItemVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex items-center"
              >
                <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue shadow-neu-flat">
                  <FiUser size={16} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-text-primary">User Name</p>
                  <p className="text-xs text-text-secondary">user@example.com</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;