import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// UI state interface
export interface UIState {
  darkMode: boolean;
  sidebarOpen: boolean;
  rightPanelOpen: boolean;
  rightPanelView: 'properties' | 'preview' | 'debug';
  currentModal: string | null;
  viewportZoom: number;
  notifications: Notification[];
  searchOpen: boolean;
  searchQuery: string;
  contextMenuPosition: { x: number; y: number } | null;
  contextMenuItems: ContextMenuItem[];
  activeTab: string;
}

// Notification interface
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  details?: string;
  timestamp: number;
  dismissed: boolean;
  duration: number; // in milliseconds, 0 for persistent
}

// Context menu item interface
export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: string;
  action: string;
  disabled?: boolean;
  dividerAfter?: boolean;
}

const initialState: UIState = {
  darkMode: true,
  sidebarOpen: true,
  rightPanelOpen: false,
  rightPanelView: 'properties',
  currentModal: null,
  viewportZoom: 1,
  notifications: [],
  searchOpen: false,
  searchQuery: '',
  contextMenuPosition: null,
  contextMenuItems: [],
  activeTab: 'workflow',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state: UIState) => {
      state.darkMode = !state.darkMode;
    },
    toggleSidebar: (state: UIState) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleRightPanel: (state: UIState) => {
      state.rightPanelOpen = !state.rightPanelOpen;
    },
    setRightPanelView: (state: UIState, action: PayloadAction<'properties' | 'preview' | 'debug'>) => {
      state.rightPanelView = action.payload;
      state.rightPanelOpen = true;
    },
    openModal: (state: UIState, action: PayloadAction<string>) => {
      state.currentModal = action.payload;
    },
    closeModal: (state: UIState) => {
      state.currentModal = null;
    },
    setViewportZoom: (state: UIState, action: PayloadAction<number>) => {
      state.viewportZoom = action.payload;
    },
    addNotification: (state: UIState, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'dismissed'>>) => {
      const id = Math.random().toString(36).substring(2, 9);
      state.notifications.push({
        id,
        ...action.payload,
        timestamp: Date.now(),
        dismissed: false,
      });
    },
    dismissNotification: (state: UIState, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification) {
        notification.dismissed = true;
      }
    },
    clearNotifications: (state: UIState) => {
      state.notifications = state.notifications.filter((n) => !n.dismissed);
    },
    toggleSearch: (state: UIState) => {
      state.searchOpen = !state.searchOpen;
      if (!state.searchOpen) {
        state.searchQuery = '';
      }
    },
    setSearchQuery: (state: UIState, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    showContextMenu: (state: UIState, action: PayloadAction<{ position: { x: number; y: number }; items: ContextMenuItem[] }>) => {
      state.contextMenuPosition = action.payload.position;
      state.contextMenuItems = action.payload.items;
    },
    hideContextMenu: (state: UIState) => {
      state.contextMenuPosition = null;
      state.contextMenuItems = [];
    },
    setActiveTab: (state: UIState, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
  },
});

export const {
  toggleDarkMode,
  toggleSidebar,
  toggleRightPanel,
  setRightPanelView,
  openModal,
  closeModal,
  setViewportZoom,
  addNotification,
  dismissNotification,
  clearNotifications,
  toggleSearch,
  setSearchQuery,
  showContextMenu,
  hideContextMenu,
  setActiveTab,
} = uiSlice.actions;

export default uiSlice.reducer;