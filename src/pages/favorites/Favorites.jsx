import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import { useAuth } from '../../context/AuthContext';
import FavoritesHeader from './FavoritesHeader';
import FavoritesGrid from './FavoritesGrid';
import Breadcrumb from '../../components/common/Breadcrumb';
import SimplePagination from '../../components/common/SimplePagination';

export default function Favorites() {
  const { favorites, fetchFavorites } = useTravel();
  const { isAuthenticated, openAuthModal } = useAuth();
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-3">
        <Heart className="w-12 h-12 text-gray-400 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Saved Wishlist</h2>
        <p className="text-xs text-gray-500 dark:text-zinc-400">Sign in to save and manage your favorite destinations.</p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-4 py-2 bg-[#003E83] dark:bg-[#60a5fa] dark:text-zinc-950 hover:bg-[#002e62] text-white text-xs font-semibold rounded-md cursor-pointer"
        >
          Sign In
        </button>
      </div>
    );
  }

  const visitedCount = favorites.filter((f) => f.visited).length;

  const ITEMS_PER_PAGE = 9;
  const totalPages = Math.ceil(favorites.length / ITEMS_PER_PAGE) || 1;
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, favorites.length);
  const paginatedFavorites = favorites.slice(startIndex, endIndex);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumb items={[{ label: 'Saved Wishlist' }]} />
      <FavoritesHeader totalCount={favorites.length} visitedCount={visitedCount} />
      <FavoritesGrid favorites={paginatedFavorites} />

      <SimplePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(p) => {
          setPage(p);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        startIndex={startIndex}
        endIndex={endIndex}
        totalRecords={favorites.length}
        label="wishlist destinations"
        className="rounded-lg border border-gray-200 dark:border-zinc-800 shadow-xs"
      />
    </div>
  );
}
