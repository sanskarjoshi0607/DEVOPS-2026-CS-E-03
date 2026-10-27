import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute Component
 * Restricts routes based on authentication status and user roles.
 */
export default function ProtectedRoute({ currentUser, requiredRole, children }) {
  // If not logged in, redirect to login gateway
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If route requires a specific role (e.g. 'teacher') and user does not match
  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/quizzes" replace />;
  }

  return children;
}
