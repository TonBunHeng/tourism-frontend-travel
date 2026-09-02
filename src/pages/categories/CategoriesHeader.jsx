
export default function CategoriesHeader({ totalCount }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-gray-200 dark:border-zinc-800">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Tourism Categories
        </h1>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
          Explore travel destinations and experiences sorted by themes
        </p>
      </div>
      {totalCount !== undefined && (
        <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium">
          Total: {totalCount} categories
        </span>
      )}
    </div>
  );
}
