
export default function PlacesHeader({ totalCount }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-gray-200 dark:border-zinc-800">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Destinations & Attractions
        </h1>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
          Browse and search heritage sites, temples, and attractions across Cambodia
        </p>
      </div>
      <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium">
        Total: {totalCount} attractions
      </span>
    </div>
  );
}
