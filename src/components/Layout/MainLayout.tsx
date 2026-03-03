import React, { useEffect } from 'react';
import { LeftSidebar } from '../Sidebar/LeftSidebar';
import { RightSidebar } from '../Sidebar/RightSidebar';
import { CanvasArea } from '../Canvas/CanvasArea';
import { useTapestryStore } from '@/store/useTapestryStore';
import './MainLayout.css';

export const MainLayout: React.FC = () => {
  const leftSidebarCollapsed = useTapestryStore((state) => state.leftSidebarCollapsed);
  const rightSidebarCollapsed = useTapestryStore((state) => state.rightSidebarCollapsed);
  const theme = useTapestryStore((state) => state.theme);

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="main-layout">
      <div className="main-content">
        <LeftSidebar collapsed={leftSidebarCollapsed} />
        <CanvasArea />
        <RightSidebar collapsed={rightSidebarCollapsed} />
      </div>
    </div>
  );
};
