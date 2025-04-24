import React, { FC, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Layout from './components/layout/Layout';
import WorkflowEditorPage from './components/pages/WorkflowEditor';

/**
 * Main application component
 * 
 * Handles routing and global UI state like dark mode
 */
const App: FC = () => {
  const darkMode = useSelector((state: RootState) => state.ui.darkMode);
  
  // Update document theme color when dark mode changes
  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', darkMode ? '#121212' : '#ffffff');
    }
    
    // Also update body class for Tailwind dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Routes>
      <Route element={<Layout children={<Outlet />} />}>
        <Route index element={<Navigate to="/workflows" replace />} />
        <Route path="workflows" element={<WorkflowEditorPage />} />
        <Route path="workflows/:id" element={<WorkflowEditorPage />} />
        
        {/* Placeholder routes for upcoming features */}
        <Route 
          path="agents" 
          element={<div className="p-8">Agent Manager Page (Coming Soon)</div>} 
        />
        <Route 
          path="templates" 
          element={<div className="p-8">Template Library Page (Coming Soon)</div>} 
        />
        <Route 
          path="settings" 
          element={<div className="p-8">Settings Page (Coming Soon)</div>} 
        />
        
        {/* 404 Page */}
        <Route 
          path="*" 
          element={<div className="p-8">404 - Page Not Found</div>} 
        />
      </Route>
    </Routes>
  );
};

export default App;