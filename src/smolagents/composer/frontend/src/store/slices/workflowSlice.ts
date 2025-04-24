import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define basic node and edge types since we can't import from reactflow
export interface NodePosition {
  x: number;
  y: number;
}

export interface NodeData {
  label: string;
  [key: string]: any;
}

export interface Node {
  id: string;
  type?: string;
  position: NodePosition;
  data: NodeData;
  selected?: boolean;
  [key: string]: any;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  style?: Record<string, any>;
  selected?: boolean;
  [key: string]: any;
}

// Define the workflow interfaces
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: Node[];
  edges: Edge[];
  createdAt: string;
  updatedAt: string;
  isTemplate?: boolean;
}

// Define the workflow update interface
export interface WorkflowUpdate {
  name?: string;
  description?: string;
  nodes?: Node[];
  edges?: Edge[];
  isTemplate?: boolean;
}

// Define the workflow state interface
interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  selectedNodeIds: string[];
  selectedEdgeIds: string[];
  isReadOnly: boolean;
  isDirty: boolean;
  lastSaved: string | null;
  currentWorkflow: Workflow | null;
  isLoading: boolean;
  isExecuting: boolean;
  executionErrors: string[];
}

// Initial state
const initialState: WorkflowState = {
  nodes: [],
  edges: [],
  selectedNodeIds: [],
  selectedEdgeIds: [],
  isReadOnly: false,
  isDirty: false,
  lastSaved: null,
  currentWorkflow: null,
  isLoading: false,
  isExecuting: false,
  executionErrors: [],
};

/**
 * Redux slice for managing workflow state
 * 
 * This slice handles nodes, edges, and selection state in the workflow canvas.
 * It provides actions for adding, updating, and removing nodes and edges,
 * as well as selection management and workflow metadata.
 */
const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    // Add a new node to the workflow
    addNode: (state, action: PayloadAction<Node>) => {
      state.nodes.push(action.payload);
      state.isDirty = true;
    },
    
    // Update an existing node
    updateNode: (state, action: PayloadAction<{ id: string; changes: any }>) => {
      const { id, changes } = action.payload;
      const nodeIndex = state.nodes.findIndex((node: Node) => node.id === id);
      
      if (nodeIndex !== -1) {
        state.nodes[nodeIndex] = {
          ...state.nodes[nodeIndex],
          ...changes,
          data: {
            ...state.nodes[nodeIndex].data,
            ...(changes.data || {}),
          },
        };
        state.isDirty = true;
      }
    },
    
    // Remove a node by ID
    removeNode: (state, action: PayloadAction<string>) => {
      const nodeId = action.payload;
      
      // Remove node
      state.nodes = state.nodes.filter((node: Node) => node.id !== nodeId);
      
      // Remove any connected edges
      state.edges = state.edges.filter(
        (edge: Edge) => edge.source !== nodeId && edge.target !== nodeId
      );
      
      // Update selection if needed
      state.selectedNodeIds = state.selectedNodeIds.filter(id => id !== nodeId);
      
      state.isDirty = true;
    },
    
    // Update an existing edge
    updateEdge: (state, action: PayloadAction<{ id: string; changes: any }>) => {
      const { id, changes } = action.payload;
      const edgeIndex = state.edges.findIndex((edge: Edge) => edge.id === id);
      
      if (edgeIndex !== -1) {
        state.edges[edgeIndex] = {
          ...state.edges[edgeIndex],
          ...changes,
        };
        state.isDirty = true;
      } else {
        // If edge not found, add it (useful for new connections)
        state.edges.push(changes);
        state.isDirty = true;
      }
    },
    
    // Remove an edge by ID
    removeEdge: (state, action: PayloadAction<string>) => {
      const edgeId = action.payload;
      state.edges = state.edges.filter((edge: Edge) => edge.id !== edgeId);
      state.selectedEdgeIds = state.selectedEdgeIds.filter(id => id !== edgeId);
      state.isDirty = true;
    },
    
    // Set node selection state
    setSelectedNodes: (state, action: PayloadAction<string[]>) => {
      state.selectedNodeIds = action.payload;
    },
    
    // Set edge selection state
    setSelectedEdges: (state, action: PayloadAction<string[]>) => {
      state.selectedEdgeIds = action.payload;
    },
    
    // Mark workflow as saved
    markAsSaved: (state) => {
      state.isDirty = false;
      state.lastSaved = new Date().toISOString();
    },
    
    // Set read-only mode
    setReadOnly: (state, action: PayloadAction<boolean>) => {
      state.isReadOnly = action.payload;
    },
    
    // Clear the workflow
    clearWorkflow: (state) => {
      state.nodes = [];
      state.edges = [];
      state.selectedNodeIds = [];
      state.selectedEdgeIds = [];
      state.isDirty = true;
    },
    
    // Load a workflow
    loadWorkflow: (state, action: PayloadAction<{ nodes: Node[]; edges: Edge[] }>) => {
      state.nodes = action.payload.nodes;
      state.edges = action.payload.edges;
      state.selectedNodeIds = [];
      state.selectedEdgeIds = [];
      state.isDirty = false;
      state.lastSaved = new Date().toISOString();
    },

    // Set current workflow by ID - this is for loading a workflow ID before the workflow data is fetched
    setCurrentWorkflowId: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      if (state.currentWorkflow) {
        state.currentWorkflow = null;
        state.nodes = [];
        state.edges = [];
      }
    },

    // Set current workflow with full workflow data
    setCurrentWorkflow: (state, action: PayloadAction<Workflow>) => {
      state.currentWorkflow = action.payload;
      state.nodes = action.payload.nodes;
      state.edges = action.payload.edges;
      state.isDirty = false;
      state.lastSaved = action.payload.updatedAt;
      state.isLoading = false;
    },
    
    // Update workflow
    updateWorkflow: (state, action: PayloadAction<WorkflowUpdate>) => {
      if (state.currentWorkflow) {
        state.currentWorkflow = {
          ...state.currentWorkflow,
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        
        // If nodes or edges are provided, update them
        if (action.payload.nodes) {
          state.nodes = action.payload.nodes;
        }
        
        if (action.payload.edges) {
          state.edges = action.payload.edges;
        }
        
        state.isDirty = true;
      }
    },
    
    // Set workflow loading state
    setWorkflowLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // Execution control actions
    startExecution: (state) => {
      state.isExecuting = true;
      state.executionErrors = [];
    },
    
    resetExecution: (state) => {
      state.isExecuting = false;
      state.executionErrors = [];
      // Reset node statuses
      state.nodes = state.nodes.map((node: Node) => ({
        ...node,
        data: {
          ...node.data,
          status: 'idle',
        },
      }));
    },
    
    // Set execution error
    setExecutionError: (state, action: PayloadAction<string>) => {
      state.executionErrors.push(action.payload);
      state.isExecuting = false;
    },
  },
});

// Export actions and reducer
export const {
  addNode,
  updateNode,
  removeNode,
  updateEdge,
  removeEdge,
  setSelectedNodes,
  setSelectedEdges,
  markAsSaved,
  setReadOnly,
  clearWorkflow,
  loadWorkflow,
  setCurrentWorkflowId,
  setCurrentWorkflow,
  updateWorkflow,
  setWorkflowLoading,
  startExecution,
  resetExecution,
  setExecutionError,
} = workflowSlice.actions;

export default workflowSlice.reducer;