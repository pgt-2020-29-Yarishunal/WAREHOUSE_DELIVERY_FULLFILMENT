import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar/Sidebar.jsx';
import { Header } from '../Header/Header.jsx';
import { ToastContainer } from '../../components/common/index.js';
import styles from './MainLayout.module.css';

export const MainLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Handle escape key to close mobile drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsMobileOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={styles.layoutRoot}>
      {/* Global Toast Alerts */}
      <ToastContainer />

      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className={styles.mobileBackdrop}
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileOpen}
        onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className={styles.mainWrapper}>
        <Header
          searchTerm={globalSearch}
          onSearchChange={setGlobalSearch}
          onOpenMobileSidebar={() => setIsMobileOpen(true)}
        />
        <main className={styles.contentArea}>
          <Outlet context={{ globalSearch }} />
        </main>
      </div>
    </div>
  );
};
