import { Heart } from 'lucide-react';

export default function FavoritesHeader({ count }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-gray-200 dark:border-zinc-800">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
          Saved Wishlist
        </h1>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
          Your saved attractions, bucket-list destinations, and cultural spots
        </p>
      </div>
      <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
        {count} {count === 1 ? 'Destination' : 'Destinations'} Saved
      </span>
    </div>
  );
}
