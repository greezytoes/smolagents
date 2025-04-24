import 'react';
import 'react-redux';
import 'react-router-dom';
import 'framer-motion';
import 'react-icons/fi';
import { Agent } from '../store/slices/agentsSlice';
import { Node, Edge } from 'reactflow';

// Augment existing modules as needed
declare module 'react-icons/fi';
declare module 'framer-motion';

// Extended Agent interface with additional properties for UI
export interface ExtendedAgent extends Agent {
  category?: string;
  custom?: boolean;
  capabilities?: string[];
  position?: { x: number; y: number };
  isCollapsed?: boolean;
  isConfiguring?: boolean;
}

// Connection configuration for workflow nodes
export interface ConnectionConfig {
  label?: string;
  data?: Record<string, any>;
  color?: string;
}

// Custom React Flow node types
export interface NodeData {
  agent?: ExtendedAgent;
  label: string;
  type: 'agent' | 'input' | 'output' | 'processor' | 'team' | 'function';
  color?: string;
  icon?: string;
}

// Custom React Flow types
declare module 'reactflow' {
  interface NodeProps<T = any> {
    data: NodeData;
    isConnectable: boolean;
    selected: boolean;
  }
}

/**
 * Workspace settings for the workflow editor
 */
export interface WorkspaceSettings {
  gridSize: number;
  snapToGrid: boolean;
  autoLayout: boolean;
  theme: 'light' | 'dark' | 'system';
  animationSpeed: 'slow' | 'medium' | 'fast';
  viewMode: 'edit' | 'preview' | 'presentation';
}

/**
 * Animation variants for Framer Motion
 */
export interface AnimationVariants {
  initial: Record<string, any>;
  animate: Record<string, any>;
  exit: Record<string, any>;
  hover?: Record<string, any>;
  tap?: Record<string, any>;
}

/**
 * Theme configuration interface
 */
export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    neon: {
      blue: string;
      green: string;
      pink: string;
      purple: string;
      cyan: string;
    }
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
    glow: string;
  };
  animation: {
    duration: number;
    easing: string;
  };
  glassmorphism: {
    background: string;
    border: string;
    blur: string;
  };
  neomorphism: {
    background: string;
    shadow1: string;
    shadow2: string;
  };
}

/**
 * Agent execution status
 */
export type AgentStatus = 'idle' | 'running' | 'completed' | 'error' | 'paused';

/**
 * Workflow execution status and metrics
 */
export interface WorkflowExecution {
  id: string;
  status: 'idle' | 'running' | 'completed' | 'error' | 'paused';
  startTime?: number;
  endTime?: number;
  nodeStatuses: Record<string, {
    status: AgentStatus;
    message?: string;
    startTime?: number;
    endTime?: number;
    metrics?: Record<string, any>;
  }>;
  metrics: {
    totalTokens?: number;
    executionTime?: number;
    cost?: number;
  };
}