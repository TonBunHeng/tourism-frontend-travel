import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute() {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  // If initial auth check is in progress, display a loading spinner
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#003E83] dark:text-blue-400 animate-spin" />
          <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  // If not authenticated or missing valid token/user, redirect to login page
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
