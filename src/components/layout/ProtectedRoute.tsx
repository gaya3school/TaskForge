import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
     children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
     const { user, loading } = useAuth();

     // Show nothing while we're checking auth state
     if (loading) {
          return null; // Or a loading spinner
     }

     if (!user) {
          // User is not authenticated, redirect to login page
          return <Navigate to="/login" replace />;
     }

     // User is authenticated, render the children
     return <>{children}</>;
}