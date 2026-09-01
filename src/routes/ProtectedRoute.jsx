import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, token, loading, role } = useAuth();
  const location = useLocation();

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

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Normalize user role string
  const normRole = (role || user?.role || 'user').toLowerCase().trim().replace(/[\s/-]+/g, '_');

  if (allowedRoles && allowedRoles.length > 0) {
    const normAllowed = allowedRoles.map((r) => r.toLowerCase().trim().replace(/[\s/-]+/g, '_'));

    const hasPermission = normAllowed.includes(normRole) || normRole === 'super_admin' || normRole === 'admin';

    if (!hasPermission) {
      // Direct user to their appropriate role home
      let redirectPath = '/';
      if (normRole === 'business_owner') redirectPath = '/business/dashboard';
      if (normRole === 'guide_editor') redirectPath = '/guide/dashboard';

      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
          <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950/50 rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Restricted</h2>
          <p className="text-sm text-gray-600 dark:text-zinc-400 max-w-md mb-6">
            You do not have permission to view this dashboard. Your current role is{' '}
            <span className="font-semibold text-[#003E83] dark:text-blue-400 capitalize">{normRole.replace('_', ' ')}</span>.
          </p>
          <a
            href={redirectPath}
            className="px-5 py-2.5 bg-[#003E83] hover:bg-[#002e62] text-white text-sm font-semibold rounded-xl transition-all shadow-md"
          >
            Go to My Dashboard
          </a>
        </div>
      );
    }
  }

  return <Outlet />;
}
