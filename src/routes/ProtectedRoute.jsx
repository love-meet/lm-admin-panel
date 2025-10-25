import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requiredPermission }) {
  const { admin, hasPermission } = useAuth();
  try { console.debug('[ProtectedRoute] admin state:', admin); } catch {}

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  // Check permission if required
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
``