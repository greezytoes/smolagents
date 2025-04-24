import { FC, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { RootState } from '../../store';
import Header from './Header';
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen);
  const rightPanelOpen = useSelector((state: RootState) => state.ui.rightPanelOpen);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background-primary text-text-primary">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && <Sidebar />}
      </AnimatePresence>

      {/* Main content area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Header */}
        <Header />

        {/* Main content */}
        <main className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 overflow-auto p-6">
            <motion.div
              layout
              className="h-full w-full"
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            >
              {children}
            </motion.div>
          </div>
          
          {/* Background grid */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
          
          {/* Glow effects */}
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-accent-blue opacity-10 rounded-full filter blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-40 -right-20 w-80 h-80 bg-accent-purple opacity-10 rounded-full filter blur-[100px] pointer-events-none" />
        </main>
      </div>

      {/* Right panel */}
      <AnimatePresence>
        {rightPanelOpen && <RightPanel />}
      </AnimatePresence>

      {/* Modal container */}
      <div id="modal-root" />
    </div>
  );
};

export default Layout;