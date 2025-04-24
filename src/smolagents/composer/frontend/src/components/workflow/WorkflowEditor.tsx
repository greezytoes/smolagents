import { FC, useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  NodeTypes,
  EdgeTypes,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  ReactFlowProvider,
  Panel,
  ConnectionLineComponentProps,
} from 'reactflow';
// Import ReactFlowInstance type directly
import type { ReactFlowInstance } from 'reactflow';
import 'reactflow/dist/style.css';

import { RootState } from '../../store';
import { updateWorkflow } from '../../store/slices/workflowSlice';
import { Agent } from '../../store/slices/agentsSlice';
import AgentLibrary from './AgentLibrary';
import WorkflowNode from './WorkflowNode';
import ConnectionLine from './ConnectionLine';
import CustomEdge from './CustomEdge';
import WorkflowToolbar from './WorkflowToolbar';
import EmptyWorkflow from './EmptyWorkflow';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Define custom node types
// Define custom node types
const nodeTypes: NodeTypes = {
  agentNode: WorkflowNode,
};

// Define custom edge types
const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

/**
 * WorkflowEditor - Main component for creating and editing agent workflows
 * Provides a drag-and-drop interface for connecting agents into workflow pipelines
 */
const WorkflowEditor: FC = () => {
  const dispatch = useDispatch();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [showAgentLibrary, setShowAgentLibrary] = useState(true);
  const [selectedElements, setSelectedElements] = useState<(Node | Edge)[]>([]);
  
  // Get workflow data from Redux
  const currentWorkflow = useSelector((state: RootState) => state.workflow.currentWorkflow);
  const darkMode = useSelector((state: RootState) => state.ui.darkMode);
  
  // Initial nodes and edges setup based on the current workflow
  const initialNodes = currentWorkflow?.nodes || [];
  const initialEdges = currentWorkflow?.edges || [];
  
  // State for managing nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // Sync nodes and edges with Redux when they change
  useEffect(() => {
    if (currentWorkflow) {
      // Update workflow with new nodes and edges directly
      dispatch(updateWorkflow({
        nodes,
        edges,
      }));
    }
  }, [nodes, edges, currentWorkflow, dispatch]);
  
  // Handle new connection between nodes
  const onConnect = (params: Connection) => {
    setEdges((eds) => addEdge({
      ...params,
      animated: true,
      type: 'custom', // Use our custom edge type
      style: { stroke: '#6366f1', strokeWidth: 2 },
    }, eds));
  };
  
  // Handle dropping an agent from the library to the canvas
  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    
    // Get coordinates of drop position
    const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
    if (!reactFlowBounds || !reactFlowInstance) return;
    
    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    
    // Extract agent data from the drop event
    const agentId = event.dataTransfer.getData('application/agentId');
    let agentData;
    
    try {
      const jsonData = event.dataTransfer.getData('application/agentData');
      if (jsonData) {
        agentData = JSON.parse(jsonData);
      } else {
        // Find agent in Redux store
        // Using the useSelector won't work in this event handler function
        // Accessing the store directly requires redux store instance
        const store = require('../../store').default;
        const agents = store.getState()?.agents?.agents || [];
        agentData = agents.find((agent: Agent) => agent.id === agentId);
      }
    } catch (error) {
      console.error('Error parsing agent data:', error);
      return;
    }
    
    if (!agentData) return;
    
    // Create a new node for the agent
    const newNode = {
      id: `agent-${agentId}-${Date.now()}`,
      type: 'agentNode',
      position,
      data: {
        agent: agentData,
        status: 'idle',
        onEdit: (id: string) => {
          console.log(`Edit agent node ${id}`);
          // Handle editing agent node - we'll implement this later
        },
        onDelete: (id: string) => {
          setNodes(nodes => nodes.filter(node => node.id !== id));
          // Also remove any connected edges
          setEdges(edges => edges.filter(
            edge => edge.source !== id && edge.target !== id
          ));
        },
        onExecute: (id: string) => {
          console.log(`Execute agent node ${id}`);
          // Set the node status to running
          setNodes(nodes => nodes.map(node =>
            node.id === id ? { ...node, data: { ...node.data, status: 'running' } } : node
          ));
          
          // Simulate execution completion after 2 seconds
          setTimeout(() => {
            setNodes(nodes => nodes.map(node =>
              node.id === id ? { ...node, data: { ...node.data, status: 'success' } } : node
            ));
          }, 2000);
        }
      },
    };
    
    setNodes((nds) => [...nds, newNode]);
  };
  
  // Handle drag over event
  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };
  
  // Toggle agent library panel
  const toggleAgentLibrary = () => {
    setShowAgentLibrary(!showAgentLibrary);
  };
  
  // Handle selection of nodes or edges
  const onSelectionChange = (elements: any) => {
    setSelectedElements(elements);
  };
  
  // Animation variants for the agent library panel
  const panelVariants = {
    open: { width: 320, opacity: 1, x: 0 },
    closed: { width: 0, opacity: 0, x: -320 },
  };
  
  // Animation variants for toggle button
  const buttonVariants = {
    open: { left: 320, opacity: 1 },
    closed: { left: 0, opacity: 1 },
  };

  return (
    <div className="workflow-editor h-full flex flex-col">
      <WorkflowToolbar 
        selectedElements={selectedElements}
        onDeleteSelected={() => {
          const selectedNodeIds = selectedElements
            .filter(el => el.type !== 'edge')
            .map(el => el.id);
          const selectedEdgeIds = selectedElements
            .filter(el => el.type === 'edge')
            .map(el => el.id);
          
          setNodes(nodes.filter(node => !selectedNodeIds.includes(node.id)));
          setEdges(edges.filter(edge => !selectedEdgeIds.includes(edge.id)));
        }}
      />
      
      <div className="flex-1 relative overflow-hidden">
        <ReactFlowProvider>
          <div 
            className="h-full w-full" 
            ref={reactFlowWrapper}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance as any}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onSelectionChange={onSelectionChange}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              connectionLineComponent={ConnectionLine}
              fitView
              snapToGrid
              snapGrid={[15, 15]}
              defaultViewport={{ x: 0, y: 0, zoom: 1 }}
              deleteKeyCode={['Backspace', 'Delete']}
              multiSelectionKeyCode={['Control', 'Meta']}
              selectionKeyCode={['Shift']}
              className={darkMode ? 'workflow-dark' : 'workflow-light'}
            >
              <Controls
                position="bottom-right"
                showInteractive={false}
                className={`controls-${darkMode ? 'dark' : 'light'}`}
              />
              <MiniMap
                nodeStrokeWidth={3}
                zoomable
                pannable
                className={`minimap-${darkMode ? 'dark' : 'light'}`}
              />
              <Background
                color={darkMode ? '#4b5563' : '#e5e7eb'}
                gap={16}
                size={1}
                // @ts-ignore - ReactFlow types might be outdated, 'dots' is a valid variant
                variant="dots"
              />
              
              {/* Empty Workflow State */}
              {nodes.length === 0 && (
                <Panel position="top-left" className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-10">
                  <div className="pointer-events-auto">
                    <EmptyWorkflow />
                  </div>
                </Panel>
              )}
              
              {/* Panel for edge customization and tools */}
              <Panel position="top-right" className="p-2">
                <div className={`p-3 rounded-lg shadow-neu-normal ${
                  darkMode ? 'bg-background-surface' : 'bg-white'
                }`}>
                  <h3 className="font-medium mb-2 text-sm">Tools</h3>
                  <div className="space-y-1">
                    <button className="w-full text-left px-2 py-1 text-xs rounded hover:bg-background-tertiary transition-colors">
                      Auto Layout
                    </button>
                    <button className="w-full text-left px-2 py-1 text-xs rounded hover:bg-background-tertiary transition-colors">
                      Group Selection
                    </button>
                    <button className="w-full text-left px-2 py-1 text-xs rounded hover:bg-background-tertiary transition-colors">
                      Export Workflow
                    </button>
                  </div>
                </div>
              </Panel>
            </ReactFlow>
          </div>
          
          {/* Agent Library Panel with Animation */}
          <AnimatePresence initial={false}>
            <motion.div
              key="agent-library"
              initial={showAgentLibrary ? "open" : "closed"}
              animate={showAgentLibrary ? "open" : "closed"}
              variants={panelVariants}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 300 
              }}
              className={`absolute top-0 left-0 h-full z-10 overflow-hidden ${
                darkMode ? 'bg-background-dark' : 'bg-white'
              } border-r border-border shadow-lg`}
            >
              <AgentLibrary />
            </motion.div>
          </AnimatePresence>
          
          {/* Toggle button for agent library */}
          <motion.button
            initial={showAgentLibrary ? "open" : "closed"}
            animate={showAgentLibrary ? "open" : "closed"}
            variants={buttonVariants}
            transition={{ type: "spring" }}
            onClick={toggleAgentLibrary}
            className={`absolute top-1/2 transform -translate-y-1/2 z-20 
                       p-1.5 rounded-r-md shadow-md flex items-center justify-center
                       ${darkMode ? 'bg-background-surface' : 'bg-white'}
                       border-t border-r border-b border-border`}
          >
            {showAgentLibrary ? <FiChevronLeft /> : <FiChevronRight />}
          </motion.button>
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default WorkflowEditor;