import { Search } from 'lucide-react';

export default function GalleriesHeader({ 
  filter, 
  setFilter, 
  search, 
  setSearch,
  filters = ['All', 'Photos', 'Videos']
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-zinc-800">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Photo & Media Gallery
        </h1>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
          Authentic photographs, drone tours, and video highlights across Cambodia
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="flex p-0.5 bg-gray-100 dark:bg-zinc-800 rounded-md text-xs font-semibold">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                filter === f
                  ? 'bg-white dark:bg-zinc-700 text-[#003E83] dark:text-[#60a5fa] shadow-xs'
                  : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-48">
          <Search className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search gallery..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-xs rounded-md border border-gray-300 dark:border-zinc-700 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

