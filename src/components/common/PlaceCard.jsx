import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Heart, ArrowRight } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';

const PlaceCard = ({ place }) => {
  const { isFavorite, toggleFavorite } = useTravel();
  const favorited = isFavorite(place.id);
  const imageUrl = place.image_url || place.image || 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Cover Photo */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-100 dark:bg-zinc-800">
          <img
            src={imageUrl}
            alt={place.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80';
            }}
          />

          {/* Favorite Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(place);
            }}
            className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              favorited
                ? 'bg-rose-500 text-white'
                : 'bg-white/90 dark:bg-zinc-900/90 text-gray-700 dark:text-zinc-300 hover:text-rose-500'
            }`}
            title={favorited ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-current' : ''}`} />
          </button>

          {/* Category Tag */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-white/95 dark:bg-zinc-900/95 text-gray-800 dark:text-zinc-200 shadow-xs border border-gray-100 dark:border-zinc-800">
              {place.category || 'Attraction'}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-zinc-400">
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#003E83] dark:text-[#60a5fa] shrink-0" />
              <span className="truncate">{place.province || 'Cambodia'}</span>
            </span>

            <div className="flex items-center gap-1 font-bold text-gray-900 dark:text-white shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{Number(place.rating || 5.0).toFixed(1)}</span>
              <span className="text-[10px] text-gray-400 font-normal">
                ({place.reviews_count || 0})
              </span>
            </div>
          </div>

          <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#003E83] dark:group-hover:text-[#60a5fa] transition-colors line-clamp-1">
            {place.name}
          </h3>

          {place.description && (
            <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
              {place.description}
            </p>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between text-xs">
        <span className="font-semibold text-gray-800 dark:text-zinc-200">
          {place.price || 'Free Admission'}
        </span>
        <Link
          to={`/places/${place.id}`}
          className="flex items-center gap-1 font-semibold text-[#003E83] dark:text-[#60a5fa] hover:underline"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default PlaceCard;
