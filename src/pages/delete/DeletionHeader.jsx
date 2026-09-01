import { ShieldAlert } from 'lucide-react';

export default function DeletionHeader() {
  return (
    <div className="pb-4 border-b border-gray-200 dark:border-zinc-800">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-md bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Account Deletion & Data Privacy
          </h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
            Submit an official data deletion request in compliance with GDPR and privacy laws
          </p>
        </div>
      </div>
    </div>
  );
}
