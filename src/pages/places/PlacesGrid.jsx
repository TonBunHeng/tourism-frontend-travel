import PlaceCard from '../../components/common/PlaceCard';
import { Compass } from 'lucide-react';

export default function PlacesGrid({ places, loading, onClearFilters }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-64 bg-gray-200 dark:bg-zinc-800 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (!places || places.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6 transition-colors">
        <Compass className="w-10 h-10 text-gray-400 dark:text-zinc-500 mx-auto mb-2" />
        <h3 className="text-sm font-bold text-gray-800 dark:text-zinc-200">No destinations found</h3>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Try clearing filters or changing search query.</p>
        <button
          onClick={onClearFilters}
          className="mt-3 px-3 py-1.5 bg-[#003E83] dark:bg-[#60a5fa] dark:text-zinc-950 text-white text-xs font-semibold rounded-md cursor-pointer"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  );
}
