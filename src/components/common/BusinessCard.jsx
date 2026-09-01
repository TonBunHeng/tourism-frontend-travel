import { Link } from 'react-router-dom';
import { Star, MapPin, CheckCircle, ArrowRight } from 'lucide-react';

export default function BusinessCard({ business }) {
  if (!business) return null;

  const {
    id,
    name,
    category,
    province,
    cover_image_url,
    images = [],
    rating = 0,
    review_count = 0,
    price_range = '$$',
    verification_status,
    description,
  } = business;

  const cover = cover_image_url || (images.length > 0 ? (images[0].image_url || images[0]) : null) || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
  const categoryName = category?.name || category || 'Tourism';
  const provinceName = province?.name || province || 'Cambodia';

  return (
    <div className="group bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden shadow-xs hover:shadow-md hover:border-gray-300 dark:hover:border-zinc-700 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Cover Photo */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-100 dark:bg-zinc-800">
          <img
            src={cover}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
            }}
          />

          {/* Category Tag */}
          <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1">
            <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-white/95 dark:bg-zinc-900/95 text-gray-800 dark:text-zinc-200 shadow-xs border border-gray-100 dark:border-zinc-800">
              {categoryName}
            </span>
          </div>

          {/* Verified Badge */}
          {verification_status === 'approved' && (
            <div className="absolute top-2.5 right-2.5 z-10">
              <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-[#003E83] dark:bg-blue-600 text-white shadow-xs flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Verified
              </span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-zinc-400">
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#003E83] dark:text-[#60a5fa] shrink-0" />
              <span className="truncate">{provinceName}</span>
            </span>

            <div className="flex items-center gap-1 font-bold text-gray-900 dark:text-white shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{Number(rating || 5.0).toFixed(1)}</span>
              <span className="text-[10px] text-gray-400 font-normal">
                ({review_count})
              </span>
            </div>
          </div>

          <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#003E83] dark:group-hover:text-[#60a5fa] transition-colors line-clamp-1">
            {name}
          </h3>

          {description && (
            <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between text-xs">
        <span className="font-semibold text-gray-800 dark:text-zinc-200">
          {price_range || '$$'}
        </span>
        <Link
          to={`/businesses/${id}`}
          className="flex items-center gap-1 font-semibold text-[#003E83] dark:text-[#60a5fa] hover:underline"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
