export default function BusinessesHeader({ totalCount }) {
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
      </div>
    </div>
  );
}
