import React from 'react';
import { User, LogOut } from 'lucide-react';

export default function ProfileHeader({ user, onLogout }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs transition-colors">
      <div className="flex items-center gap-4">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-zinc-700"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-[#003E83] dark:bg-[#60a5fa] text-white dark:text-zinc-950 flex items-center justify-center font-bold text-xl shadow-xs">
            {user?.name?.charAt(0) || <User className="w-8 h-8" />}
          </div>
        )}

        <div className="space-y-0.5 text-center sm:text-left">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400">{user?.email}</p>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 dark:bg-zinc-800 text-[#003E83] dark:text-[#60a5fa] border border-blue-200 dark:border-zinc-700 mt-1">
            Registered Traveler
          </div>
        </div>
      </div>

      <button
        onClick={onLogout}
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold transition-colors cursor-pointer"
      >
        <LogOut className="w-3.5 h-3.5" />
        Sign Out
      </button>
    </div>
  );
}
