import { configureStore } from '@reduxjs/toolkit';
import agentsReducer from './slices/agentsSlice';
import workflowReducer from './slices/workflowSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    agents: agentsReducer,
    workflow: workflowReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;