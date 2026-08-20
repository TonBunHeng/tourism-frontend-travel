import React from 'react';
import { LogOut, User } from 'lucide-react';

export default function ProfileHeader({ onLogout }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-zinc-800">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          My Account & Profile
        </h1>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
          Manage your personal details, travel identity, and security credentials
        </p>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>Sign Out</span>
      </button>
    </div>
  );
}
