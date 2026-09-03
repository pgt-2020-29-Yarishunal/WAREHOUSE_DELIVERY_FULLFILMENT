import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { Icon } from '../components/common/index.js';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'var(--color-bg-main, #f4f6f9)',
        color: 'var(--color-text-main, #1a202c)',
        gap: '16px',
      }}>
        <Icon name="progress_activity" size={32} color="var(--color-primary, #003b73)" className="spin-animation" />
        <span style={{ fontSize: '14px', fontWeight: 500 }}>Memuat sesi gudang...</span>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
