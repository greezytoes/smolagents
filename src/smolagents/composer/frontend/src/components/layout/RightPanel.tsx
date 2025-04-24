import { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '../../store';
import { toggleRightPanel, setRightPanelView } from '../../store/slices/uiSlice';
import { RiCloseLine, RiCodeSSlashLine, RiEyeLine, RiInformationLine } from 'react-icons/ri';

// Tabs for the right panel
interface TabItem {
  id: 'properties' | 'preview' | 'debug';
  label: string;
  icon: JSX.Element;
}

const RightPanel: FC = () => {
  const dispatch = useDispatch();
  const rightPanelView = useSelector((state: RootState) => state.ui.rightPanelView);
  const selectedElementId = useSelector((state: RootState) => state.workflow.selectedElementId);
  const currentWorkflow = useSelector((state: RootState) => state.workflow.currentWorkflow);
  
  // Define the available tabs
  const tabs: TabItem[] = [
    {
      id: 'properties',
      label: 'Properties',
      icon: <RiInformationLine className="w-5 h-5" />,
    },
    {
      id: 'preview',
      label: 'Preview',
      icon: <RiEyeLine className="w-5 h-5" />,
    },
    {
      id: 'debug',
      label: 'Code',
      icon: <RiCodeSSlashLine className="w-5 h-5" />,
    },
  ];

  // Animation variants
  const panelVariants = {
    hidden: { x: 300, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 300 } },
    exit: { x: 300, opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={panelVariants}
      className="w-72 h-full bg-background-secondary border-l border-border shadow-neu-flat z-20"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="font-semibold text-text-primary">
          {selectedElementId ? 'Element Properties' : 'Workflow Properties'}
        </h2>
        <button 
          onClick={() => dispatch(toggleRightPanel())}
          className="p-2 rounded-md hover:bg-background-surface transition-colors"
        >
          <RiCloseLine className="w-5 h-5" />
        </button>
      </div>

      {/* Tab navigation */}
      <div className="flex items-center border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => dispatch(setRightPanelView(tab.id))}
            className={`flex items-center px-4 py-3 border-b-2 transition-all duration-300 ${
              rightPanelView === tab.id
                ? 'border-accent-blue text-accent-blue'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content based on selected tab */}
      <div className="p-4 overflow-y-auto" style={{ height: 'calc(100% - 120px)' }}>
        {rightPanelView === 'properties' && (
          <div className="space-y-4">
            {selectedElementId ? (
              <ElementProperties elementId={selectedElementId} />
            ) : currentWorkflow ? (
              <WorkflowProperties workflow={currentWorkflow} />
            ) : (
              <div className="text-center text-text-secondary p-8">
                <RiInformationLine className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Select an element to view its properties</p>
              </div>
            )}
          </div>
        )}
        
        {rightPanelView === 'preview' && (
          <div className="text-center text-text-secondary p-8">
            <RiEyeLine className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Preview will be available here</p>
          </div>
        )}
        
        {rightPanelView === 'debug' && (
          <div className="text-center text-text-secondary p-8">
            <RiCodeSSlashLine className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Debug information will be shown here</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Placeholder component for element properties
const ElementProperties: FC<{ elementId: string }> = ({ elementId }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium text-text-primary">Element ID: {elementId}</h3>
      <div className="card-glass p-4">
        <p className="text-sm text-text-secondary mb-3">Properties panel content will go here</p>
      </div>
    </div>
  );
};

// Placeholder component for workflow properties
const WorkflowProperties: FC<{ workflow: any }> = ({ workflow }) => {
  return (
    <div className="space-y-4">
      <div className="card-glass p-4">
        <h3 className="text-md font-medium text-text-primary mb-2">{workflow.name}</h3>
        <p className="text-sm text-text-secondary">{workflow.description}</p>
      </div>
      
      <div className="card-glass p-4">
        <h4 className="text-sm font-medium text-text-primary mb-2">Details</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">Status:</span>
            <span className="text-text-primary">{workflow.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Created:</span>
            <span className="text-text-primary">{new Date(workflow.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Updated:</span>
            <span className="text-text-primary">{new Date(workflow.updatedAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Nodes:</span>
            <span className="text-text-primary">{workflow.nodes.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Connections:</span>
            <span className="text-text-primary">{workflow.edges.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;