import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout/MainLayout.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { LoginPage } from '../pages/Auth/LoginPage.jsx';
import { DashboardPage } from '../pages/Dashboard/DashboardPage.jsx';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes inside Main Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;