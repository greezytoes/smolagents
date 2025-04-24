import React, { FC, useCallback, useRef, useState, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  ConnectionLineType,
  Connection,
  Edge,
  useNodesState,
  useEdgesState,
  Node,
  NodeTypes,
  ReactFlowProvider,
  ReactFlowInstance,
  SelectionMode,
  Panel,
  useReactFlow,
  OnNodesChange,
  OnEdgesChange,
} from 'reactflow';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { 
  addNode, 
  updateNode,
  updateEdge,
  removeNode, 
  removeEdge 
} from '../../store/slices/workflowSlice';
import AgentNode, { AgentNodeData } from './nodes/AgentNode';
import DropZone from '../dnd/DropZone';

import 'reactflow/dist/style.css';

// Define custom node types
const nodeTypes: NodeTypes = {
  agent: AgentNode,
};

interface WorkflowCanvasProps {
  className?: string;
}

/**
 * WorkflowCanvas - The main editing surface for building agent workflows
 * 
 * Features:
 * - Drag & drop interface for adding new nodes
 * - Interactive connections between nodes
 * - Smooth animations for UI interactions
 * - Custom node visualization with status indicators
 * - Minimap and controls for navigation
 * - Responsive layout
 */
const WorkflowCanvas: FC<WorkflowCanvasProps> = ({ className = '' }) => {
  const dispatch = useDispatch();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const { nodes, edges } = useSelector((state: RootState) => state.workflow);
  const { darkMode } = useSelector((state: RootState) => state.ui);
  const [showMinimap, setShowMinimap] = useState(false);
  
  // Add nodes and edges from Redux store to ReactFlow
  const [reactFlowNodes, setReactFlowNodes, onNodesChange] = useNodesState([]);
  const [reactFlowEdges, setReactFlowEdges, onEdgesChange] = useEdgesState([]);
  
  // Sync nodes and edges with Redux store
  useEffect(() => {
    setReactFlowNodes(nodes);
    setReactFlowEdges(edges);
  }, [nodes, edges, setReactFlowNodes, setReactFlowEdges]);
  
  // Custom handler for node changes - updates Redux store
  const handleNodesChange: OnNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      
      // Process node changes and dispatch appropriate actions
      changes.forEach(change => {
        if (change.type === 'position' && change.dragging === false) {
          // Update node position in Redux when drag ends
          const node = reactFlowNodes.find(n => n.id === change.id);
          if (node) {
            dispatch(updateNode({
              id: node.id,
              changes: { position: node.position }
            }));
          }
        }
      });
    },
    [reactFlowNodes, onNodesChange, dispatch]
  );
  
  // Custom handler for edge changes - updates Redux store
  const handleEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      onEdgesChange(changes);
      
      // Process edge changes and dispatch appropriate actions
      changes.forEach(change => {
        if (change.type === 'remove') {
          dispatch(removeEdge(change.id));
        }
      });
    },
    [onEdgesChange, dispatch]
  );
  
  // Handle new connections between nodes
  const onConnect = useCallback(
    (params: Connection) => {
      // Make sure source and target are not null before adding the edge
      if (params.source && params.target) {
        // Create a custom edge with animated path
        const newEdge = {
          ...params,
          id: `edge-${params.source}-${params.target}`,
          type: 'smoothstep',
          animated: true,
          style: {
            strokeWidth: 2,
            stroke: darkMode ? '#8B5CF6' : '#6366F1',
          },
        };
        
        // Add edge to local state
        const updatedEdges = addEdge(newEdge, reactFlowEdges);
        setReactFlowEdges(updatedEdges);
        
        // Find the newly added edge and dispatch to Redux
        const addedEdge = updatedEdges.find(
          e => e.source === params.source && e.target === params.target
        );
        
        if (addedEdge) {
          // Use updateEdge action to add new edge to Redux store
          dispatch(updateEdge({
            id: addedEdge.id,
            changes: addedEdge
          }));
        }
      }
    },
    [reactFlowEdges, setReactFlowEdges, dispatch, darkMode]
  );
  
  // Handle dropping new nodes onto the canvas
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      
      if (!reactFlowInstance || !reactFlowWrapper.current) {
        return;
      }
      
      // Get drop position
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const dragDataStr = event.dataTransfer.getData('application/dragData');
      const dragType = event.dataTransfer.getData('application/dragType');
      
      if (!dragDataStr || dragType !== 'agent') {
        return;
      }
      
      try {
        const agentData = JSON.parse(dragDataStr);
        
        // Get drop coordinates
        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });
        
        // Create a new node
        const newNode: Node<AgentNodeData> = {
          id: `agent-${Date.now()}`,
          type: 'agent',
          position,
          data: {
            label: agentData.name,
            description: agentData.description || '',
            type: agentData.type || 'Agent',
            modelId: agentData.modelId,
            toolIds: agentData.toolIds || [],
            status: 'idle',
          },
        };
        
        dispatch(addNode(newNode));
        
        // Animate the canvas to center on the new node
        setTimeout(() => {
          reactFlowInstance.fitView({ 
            nodes: [newNode],
            padding: 0.2,
            duration: 800,
          });
        }, 50);
      } catch (error) {
        console.error('Error creating node:', error);
      }
    },
    [reactFlowInstance, dispatch]
  );
  
  // Handle node selection
  const onSelectionChange = useCallback(
    // Explicitly mark as unused with underscore prefix
    (_selection: { 
      nodes: Node[]; 
      edges: Edge[];
    }) => {
      // This is a placeholder for future functionality
    },
    []
  );
  
  // Handle flow instance initialization
  const onInit = useCallback(
    (instance: ReactFlowInstance) => {
      setReactFlowInstance(instance);
    },
    []
  );
  
  // Prevent default behavior for dragover
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
  
  // Delete nodes and edges on delete key press
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const selectedNodeIds = reactFlowNodes
          .filter((node) => node.selected)
          .map((node) => node.id);
          
        const selectedEdgeIds = reactFlowEdges
          .filter((edge) => edge.selected)
          .map((edge) => edge.id);
        
        if (selectedNodeIds.length > 0) {
          // Remove nodes one by one
          selectedNodeIds.forEach(id => {
            dispatch(removeNode(id));
          });
        }
        
        if (selectedEdgeIds.length > 0) {
          // Remove edges one by one
          selectedEdgeIds.forEach(id => {
            dispatch(removeEdge(id));
          });
        }
      }
    },
    [reactFlowNodes, reactFlowEdges, dispatch]
  );
  
  return (
    <DropZone
      className={`w-full h-full ${className}`}
      acceptTypes={['agent']}
      glowIntensity="low"
      glowColor={darkMode ? '#8B5CF6' : '#6366F1'}
      onDrop={(type, data) => console.log('Dropped on canvas background', type, data)}
    >
      <div 
        className="w-full h-full" 
        ref={reactFlowWrapper}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <ReactFlow
          nodes={reactFlowNodes}
          edges={reactFlowEdges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          onInit={onInit}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onSelectionChange={onSelectionChange}
          nodeTypes={nodeTypes}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.2}
          maxZoom={4}
          connectionLineType={ConnectionLineType.SmoothStep}
          connectionLineStyle={{
            strokeWidth: 2,
            stroke: darkMode ? '#8B5CF6' : '#6366F1',
          }}
          selectionMode={SelectionMode.Partial}
          snapToGrid={true}
          snapGrid={[15, 15]}
          fitView
          attributionPosition="bottom-right"
        >
          {/* Background with custom styling */}
          <Background
            gap={24}
            size={1.5}
            color={darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}
            style={{
              backgroundColor: darkMode ? '#0F172A' : '#F8FAFC',
              backgroundImage: darkMode 
                ? 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.03) 1px, transparent 0)'
                : 'radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.04) 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />
          
          {/* Controls with custom styling */}
          <Controls
            style={{
              backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(8px)',
              border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              boxShadow: darkMode 
                ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
                : '0 4px 12px rgba(0, 0, 0, 0.1)',
              color: darkMode ? '#F8FAFC' : '#0F172A',
            }}
            showInteractive={false}
          />
          
          {/* Minimap toggle button */}
          <Panel position="top-right" className="mr-12">
            <motion.button
              className={`p-2 rounded-md ${
                darkMode
                  ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
                  : 'bg-white/80 text-slate-700 hover:bg-slate-100/80'
              }`}
              style={{
                backdropFilter: 'blur(8px)',
                border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                boxShadow: darkMode 
                  ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
                  : '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMinimap(!showMinimap)}
              aria-label="Toggle minimap"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <rect x="8" y="8" width="8" height="8" rx="1" ry="1" />
              </svg>
            </motion.button>
          </Panel>
          
          {/* Conditional minimap */}
          {showMinimap && (
            <MiniMap
              nodeStrokeWidth={3}
              nodeColor={(node) => {
                const data = node.data as AgentNodeData;
                switch (data.status) {
                  case 'running':
                    return '#3B82F6';
                  case 'completed':
                    return '#10B981';
                  case 'error':
                    return '#EF4444';
                  case 'paused':
                    return '#F59E0B';
                  default:
                    return darkMode ? '#94A3B8' : '#64748B';
                }
              }}
              maskColor={darkMode ? 'rgba(15, 23, 42, 0.5)' : 'rgba(248, 250, 252, 0.5)'}
              style={{
                backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(8px)',
                border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                boxShadow: darkMode 
                  ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
                  : '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            />
          )}
        </ReactFlow>
      </div>
    </DropZone>
  );
};

// Wrap with the ReactFlowProvider
const WorkflowCanvasWithProvider: FC<WorkflowCanvasProps> = (props) => {
  return (
    <ReactFlowProvider>
      <WorkflowCanvas {...props} />
    </ReactFlowProvider>
  );
};

export default WorkflowCanvasWithProvider;