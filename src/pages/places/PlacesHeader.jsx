export default function PlacesHeader({ totalCount, provinceName }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-gray-200 dark:border-zinc-800">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          {provinceName ? `Attractions in ${provinceName}` : 'Discover Heritage Sites & Attractions'}
        </h1>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
          {provinceName 
            ? `Browse and search heritage sites and attractions in ${provinceName}`
            : 'Browse and search heritage sites, temples, and attractions across Cambodia'}
        </p>
      </div>
      <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium">
        Total: {totalCount} attractions
      </span>
    </div>
  );
}
