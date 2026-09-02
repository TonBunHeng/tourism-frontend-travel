import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function BusinessesHeader({ totalCount }) {
  const { isBusinessOwner } = useAuth();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-zinc-800">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Local Tourism Businesses
        </h1>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
          Discover verified hotels, dining, tours, and hospitality services across Cambodia
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium hidden sm:inline">
          Total: {totalCount} businesses
        </span>

        {isBusinessOwner && (
          <Link
            to="/business/businesses/new"
            className="px-3.5 py-1.5 bg-[#003E83] hover:bg-[#002e62] dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] dark:text-zinc-950 text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Business</span>
          </Link>
        )}
      </div>
    </div>
  );
}
