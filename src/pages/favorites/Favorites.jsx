import { useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import { useAuth } from '../../context/AuthContext';
import FavoritesHeader from './FavoritesHeader';
import FavoritesGrid from './FavoritesGrid';
import Breadcrumb from '../../components/common/Breadcrumb';

export default function Favorites() {
  const { favorites, fetchFavorites } = useTravel();
  const { isAuthenticated, openAuthModal } = useAuth();

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-3">
        <Heart className="w-12 h-12 text-gray-400 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">Your Saved Wishlist</h2>
        <p className="text-xs text-gray-500">Sign in to save and manage your favorite destinations.</p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-4 py-2 bg-[#003E83] hover:bg-[#002e62] text-white text-xs font-semibold rounded-md"
        >
          Sign In
        </button>
      </div>
    );
  }

  const visitedCount = favorites.filter((f) => f.visited).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumb items={[{ label: 'Saved Wishlist' }]} />
      <FavoritesHeader totalCount={favorites.length} visitedCount={visitedCount} />
      <FavoritesGrid favorites={favorites} />
    </div>
  );
}
