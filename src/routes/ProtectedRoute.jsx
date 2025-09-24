import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const isAuthenticated = true; // Simulating a check, e.g., from an auth context or a token check

export default function ProtectedRoute() {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}