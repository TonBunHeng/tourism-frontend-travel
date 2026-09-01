import { Search } from 'lucide-react';

export default function ProvincesHeader({ search, setSearch }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-zinc-800">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Provinces of Cambodia
        </h1>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
          Explore heritage sites across all 25 provinces and municipalities
        </p>
      </div>

      <div className="relative w-full sm:w-60">
        <Search className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter provinces..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-xs rounded-md border border-gray-300 dark:border-zinc-700 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none"
        />
      </div>
    </div>
  );
}
