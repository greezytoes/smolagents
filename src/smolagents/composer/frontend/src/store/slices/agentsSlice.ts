import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

// Define the types for our agent state
export interface AgentTool {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
  icon?: string;
}

export interface AgentModel {
  id: string;
  name: string;
  provider: string;
  version: string;
  capabilities: string[];
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  model: AgentModel;
  tools: AgentTool[];
  systemPrompt?: string;
  icon?: string;
  color?: string;
  tags: string[];
  metadata: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  modelRequirements?: string[];
  basedOn: Partial<Agent>;
}

interface AgentsState {
  agents: Agent[];
  templates: AgentTemplate[];
  selectedAgentId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AgentsState = {
  agents: [],
  templates: [
    {
      id: 'research-agent',
      name: 'Research Agent',
      description: 'Agent specialized in deep research and information gathering',
      category: 'Research',
      basedOn: {
        tools: [],
        systemPrompt: 'You are a research assistant specialized in finding and synthesizing information.',
        color: '#42a5f5',
        tags: []
      }
    },
    {
      id: 'code-agent',
      name: 'Code Agent',
      description: 'Agent specialized in writing and reviewing code',
      category: 'Development',
      basedOn: {
        tools: [],
        systemPrompt: 'You are a software development assistant specialized in writing clean, maintainable code.',
        color: '#66bb6a',
        tags: []
      }
    },
    {
      id: 'planning-agent',
      name: 'Planning Agent',
      description: 'Agent specialized in planning and task decomposition',
      category: 'Planning',
      basedOn: {
        tools: [],
        systemPrompt: 'You are a planning assistant specialized in breaking down complex tasks into manageable steps.',
        color: '#ffb300',
        tags: []
      }
    }
  ],
  selectedAgentId: null,
  isLoading: false,
  error: null,
};

export const agentsSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
    addAgent: (state: AgentsState, action: PayloadAction<Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const timestamp = Date.now();
      const newAgent: Agent = {
        ...action.payload,
        id: uuidv4(),
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      state.agents.push(newAgent);
    },
    updateAgent: (state: AgentsState, action: PayloadAction<{ id: string; updates: Partial<Agent> }>) => {
      const { id, updates } = action.payload;
      const agentIndex = state.agents.findIndex((agent: Agent) => agent.id === id);
      if (agentIndex !== -1) {
        state.agents[agentIndex] = {
          ...state.agents[agentIndex],
          ...updates,
          updatedAt: Date.now(),
        };
      }
    },
    removeAgent: (state: AgentsState, action: PayloadAction<string>) => {
      state.agents = state.agents.filter((agent: Agent) => agent.id !== action.payload);
      if (state.selectedAgentId === action.payload) {
        state.selectedAgentId = null;
      }
    },
    selectAgent: (state: AgentsState, action: PayloadAction<string | null>) => {
      state.selectedAgentId = action.payload;
    },
    addToolToAgent: (state: AgentsState, action: PayloadAction<{ agentId: string; tool: Omit<AgentTool, 'id'> }>) => {
      const { agentId, tool } = action.payload;
      const agentIndex = state.agents.findIndex((agent: Agent) => agent.id === agentId);
      if (agentIndex !== -1) {
        const newTool: AgentTool = {
          ...tool,
          id: uuidv4(),
        };
        state.agents[agentIndex].tools.push(newTool);
        state.agents[agentIndex].updatedAt = Date.now();
      }
    },
    removeToolFromAgent: (state: AgentsState, action: PayloadAction<{ agentId: string; toolId: string }>) => {
      const { agentId, toolId } = action.payload;
      const agentIndex = state.agents.findIndex((agent: Agent) => agent.id === agentId);
      if (agentIndex !== -1) {
        state.agents[agentIndex].tools = state.agents[agentIndex].tools.filter(
          (tool: AgentTool) => tool.id !== toolId
        );
        state.agents[agentIndex].updatedAt = Date.now();
      }
    },
    setAgentLoading: (state: AgentsState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAgentError: (state: AgentsState, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addAgent,
  updateAgent,
  removeAgent,
  selectAgent,
  addToolToAgent,
  removeToolFromAgent,
  setAgentLoading,
  setAgentError,
} = agentsSlice.actions;

export default agentsSlice.reducer;