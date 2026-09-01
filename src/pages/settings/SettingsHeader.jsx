import { ShieldCheck } from 'lucide-react';

export default function SettingsHeader() {
  return (
    <div className="pb-4 border-b border-gray-200 dark:border-zinc-800">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-md bg-[#003E83] dark:bg-[#60a5fa] text-white dark:text-zinc-950 flex items-center justify-center">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Tourist Emergency & Guidelines
          </h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
            Essential contact numbers, safety protocols, and tourism terms
          </p>
        </div>
      </div>
    </div>
  );
}
