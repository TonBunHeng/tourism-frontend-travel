import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Star, 
  Heart, 
  ArrowLeft, 
  ExternalLink,
  Share2,
  ChevronRight
} from 'lucide-react';
import { placeService } from '../../services/placeService';
import { useTravel } from '../../context/TravelContext';
import { useAuth } from '../../context/AuthContext';
import ReviewModal from '../../components/reviews/ReviewModal';
import Breadcrumb from '../../components/common/Breadcrumb';

export default function PlaceDetails() {
  const { id } = useParams();
  const { isFavorite, toggleFavorite, showToast } = useTravel();
  const { isAuthenticated, openAuthModal } = useAuth();

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const fetchPlaceDetail = useCallback(async () => {
    try {
      setLoading(true);
      const res = await placeService.getPlaceById(id);
      if (res?.data) {
        setPlace(res.data);
        document.title = `${res.data.name} | AngkorVerses`;
      }
    } catch (err) {
      setError(err.message || 'Failed to load destination details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPlaceDetail();
    window.scrollTo(0, 0);
  }, [id, fetchPlaceDetail]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center animate-pulse">
        <div className="h-72 bg-gray-200 dark:bg-zinc-800 rounded-lg mb-6"></div>
        <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded w-1/4 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-1/2 mx-auto"></div>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-3">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Destination Not Found</h2>
        <p className="text-xs text-gray-500 dark:text-zinc-400">{error || 'This attraction is unavailable.'}</p>
        <Link
          to="/places"
          className="inline-flex items-center gap-1 px-4 py-2 bg-[#003E83] dark:bg-[#60a5fa] dark:text-zinc-950 text-white text-xs font-semibold rounded-md shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Destinations
        </Link>
      </div>
    );
  }

  const favorited = isFavorite(place.id);
  // Normalize and deduplicate images by base path (stripping resolution query params like w=800 vs w=1200)
  const getBaseImageUrl = (url) => {
    if (!url || typeof url !== 'string') return '';
    try {
      return url.split('?')[0].trim().toLowerCase();
    } catch {
      return url.trim().toLowerCase();
    }
  };

  const rawImages = [
    place.image_url || place.image,
    ...(Array.isArray(place.gallery) ? place.gallery.map((g) => (typeof g === 'string' ? g : g?.url || g?.media_url || g?.image_url)) : []),
    ...(Array.isArray(place.images) ? place.images.map((img) => (typeof img === 'string' ? img : img?.url || img?.image_url)) : []),
  ].filter(Boolean);

  const seenBases = new Set();
  const images = [];
  for (const img of rawImages) {
    const base = getBaseImageUrl(img);
    if (base && !seenBases.has(base)) {
      seenBases.add(base);
      images.push(img);
    }
  }

  if (images.length === 0) {
    images.push('https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80');
  }

  const mapQuery = encodeURIComponent(place.address || place.name || 'Cambodia');
  const googleMapsUrl = place.coordinates
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.coordinates)}`
    : `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const embedMapUrl = `https://maps.google.com/maps?q=${mapQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: place.name,
        text: place.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'success');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <Breadcrumb
        items={[
          { label: 'Destinations', to: '/places' },
          { label: place.name }
        ]}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-zinc-800 text-[#003E83] dark:text-[#60a5fa] border border-blue-200 dark:border-zinc-700 text-[11px] font-semibold">
              {place.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-zinc-400">
              <MapPin className="w-3.5 h-3.5 text-[#003E83] dark:text-[#60a5fa]" />
              {place.province}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            {place.name}
          </h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">{place.address}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-md border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => toggleFavorite(place)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
              favorited
                ? 'bg-rose-500 text-white'
                : 'bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-700'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-current' : ''}`} />
            <span>{favorited ? 'In Wishlist' : 'Add to Wishlist'}</span>
          </button>

          <button
            onClick={() => {
              if (!isAuthenticated) openAuthModal('login');
              else setReviewModalOpen(true);
            }}
            className="px-3.5 py-2 bg-[#003E83] hover:bg-[#002e62] dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] dark:text-zinc-950 text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
          >
            Write a Review
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden transition-colors">
            <div className="aspect-16/9 w-full bg-gray-100 dark:bg-zinc-800 relative">
              <img
                src={images[activeImageIndex] || images[0]}
                alt={place.name}
                className="w-full h-full object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="p-3 bg-gray-50 dark:bg-zinc-800/60 border-t border-gray-200 dark:border-zinc-800 flex gap-2 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-12 rounded overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIndex === idx ? 'border-[#003E83] dark:border-[#60a5fa] ring-1 ring-[#003E83] dark:ring-[#60a5fa]' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-md p-3 transition-colors">
              <span className="text-[11px] font-semibold text-gray-400 dark:text-zinc-500 block mb-0.5">Rating</span>
              <div className="flex items-center gap-1 text-sm font-bold text-gray-900 dark:text-white">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{Number(place.rating || 5.0).toFixed(1)}</span>
                <span className="text-gray-400 dark:text-zinc-500 text-xs font-normal">({place.reviews_count || 0})</span>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-md p-3 transition-colors">
              <span className="text-[11px] font-semibold text-gray-400 dark:text-zinc-500 block mb-0.5">Entrance Fee</span>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{place.price || 'Free'}</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-md p-3 transition-colors">
              <span className="text-[11px] font-semibold text-gray-400 dark:text-zinc-500 block mb-0.5">Best Time</span>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{place.best_time || 'Morning'}</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-md p-3 transition-colors">
              <span className="text-[11px] font-semibold text-gray-400 dark:text-zinc-500 block mb-0.5">Duration</span>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{place.duration || '2-3 Hours'}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6 space-y-3 transition-colors">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              About {place.name}
            </h2>
            <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
              {place.description || 'Discover authentic cultural history and picturesque scenery at this destination.'}
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6 space-y-4 transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Tourist Reviews ({place.reviews?.length || 0})
                </h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400">Verified feedback from travelers</p>
              </div>

              <button
                onClick={() => {
                  if (!isAuthenticated) openAuthModal('login');
                  else setReviewModalOpen(true);
                }}
                className="px-3 py-1.5 bg-[#003E83] hover:bg-[#002e62] dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] dark:text-zinc-950 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
              >
                Write Review
              </button>
            </div>

            {(!place.reviews || place.reviews.length === 0) ? (
              <div className="text-center py-8 text-gray-400 dark:text-zinc-500 text-xs">
                <p className="font-semibold text-gray-700 dark:text-zinc-300">No reviews published yet</p>
                <p className="text-[11px] mt-0.5">Be the first traveler to post a review.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {place.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-md bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#003E83] dark:bg-[#60a5fa] text-white dark:text-zinc-950 font-bold text-[10px] flex items-center justify-center">
                          {rev.user_name?.charAt(0) || 'T'}
                        </div>
                        <span className="text-xs font-bold text-gray-900 dark:text-white">{rev.user_name || 'Traveler'}</span>
                      </div>

                      <div className="flex items-center gap-1 bg-white dark:bg-zinc-800 px-2 py-0.5 rounded border border-gray-200 dark:border-zinc-700 text-xs font-bold text-amber-500">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>

                    {rev.title && (
                      <h4 className="text-xs font-bold text-gray-800 dark:text-zinc-200">
                        {rev.title}
                      </h4>
                    )}

                    <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed">
                      {rev.comment}
                    </p>

                    {rev.images && rev.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {rev.images.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt="review"
                            className="w-12 h-12 rounded object-cover border border-gray-200 dark:border-zinc-700"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-4 space-y-3 transition-colors">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Location & Map
            </h3>

            <div className="w-full h-44 rounded-md overflow-hidden border border-gray-200 dark:border-zinc-800 bg-gray-100 dark:bg-zinc-800">
              <iframe
                title={`Map of ${place.name}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src={embedMapUrl}
              />
            </div>

            <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
              {place.address}
            </p>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 bg-[#003E83] hover:bg-[#002e62] dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] dark:text-zinc-950 text-white text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors"
            >
              Open in Google Maps
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {place.province_detail && (
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-4 space-y-2 text-xs transition-colors">
              <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase">Province Directory</span>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">{place.province}</h4>
              <p className="text-gray-500 dark:text-zinc-400 leading-relaxed">
                {place.province_detail.description}
              </p>
              <Link
                to={`/places?province_id=${place.province_id}`}
                className="inline-block font-semibold text-[#003E83] dark:text-[#60a5fa] hover:underline pt-1"
              >
                Browse all attractions in {place.province} →
              </Link>
            </div>
          )}
        </div>

      </div>

      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        place={place}
        onReviewSubmitted={fetchPlaceDetail}
      />
    </div>
  );
}
