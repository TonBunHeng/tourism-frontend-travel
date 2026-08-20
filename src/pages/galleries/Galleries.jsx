import React, { useState, useEffect, useMemo } from 'react';
import { Camera } from 'lucide-react';
import { galleryService } from '../../services/galleryService';
import GalleriesHeader from './GalleriesHeader';
import GalleryCard from '../../components/common/GalleryCard';
import MediaLightboxModal from '../../components/common/MediaLightboxModal';

const isVideoItem = (item) => {
  if (!item) return false;
  const mediaType = (item.media_type || item.type || '').toLowerCase();
  if (mediaType === 'video') return true;
  const url = item.media_url || item.url || item.thumbnail_url || '';
  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url);
};

export default function Galleries() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  // Lightbox Modal state
  const [activeMedia, setActiveMedia] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        setLoading(true);
        const res = await galleryService.getGalleries();
        if (res?.data) {
          setGalleries(res.data);
        }
      } catch (err) {
        console.error('Failed to load gallery', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleries();
  }, []);

  const filteredGalleries = useMemo(() => {
    return galleries.filter((item) => {
      const matchSearch =
        search.trim() === '' ||
        item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase()) ||
        item.location?.toLowerCase().includes(search.toLowerCase()) ||
        item.place?.toLowerCase().includes(search.toLowerCase()) ||
        item.place_name?.toLowerCase().includes(search.toLowerCase()) ||
        item.category?.toLowerCase().includes(search.toLowerCase());

      const isVideo = isVideoItem(item);

      const matchFilter =
        filter === 'All' ||
        (filter === 'Photos' && !isVideo) ||
        (filter === 'Videos' && isVideo);

      return matchSearch && matchFilter;
    });
  }, [galleries, search, filter]);

  const handlePreview = (item) => {
    setActiveMedia(item);
    setIsLightboxOpen(true);
  };

  const handleNavigateLightbox = (direction) => {
    if (!activeMedia) return;
    const currentIndex = filteredGalleries.findIndex((g) => g.id === activeMedia.id);
    if (direction === 'next' && currentIndex < filteredGalleries.length - 1) {
      setActiveMedia(filteredGalleries[currentIndex + 1]);
    } else if (direction === 'prev' && currentIndex > 0) {
      setActiveMedia(filteredGalleries[currentIndex - 1]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <GalleriesHeader
        filter={filter}
        setFilter={setFilter}
        search={search}
        setSearch={setSearch}
        filters={['All', 'Photos', 'Videos']}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-80 bg-gray-200 dark:bg-zinc-800 rounded-lg"></div>
          ))}
        </div>
      ) : filteredGalleries.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGalleries.map((item) => (
            <GalleryCard
              key={item.id}
              item={item}
              onPreview={handlePreview}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg space-y-3">
          <Camera className="w-10 h-10 text-gray-400 dark:text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            No {filter === 'All' ? 'media' : filter.toLowerCase()} items found
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            Try adjusting your search keywords or filter selection.
          </p>
          {(search || filter !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setFilter('All');
              }}
              className="px-3 py-1.5 bg-[#003E83] dark:bg-[#60a5fa] text-white dark:text-zinc-950 text-xs font-semibold rounded-md shadow-xs cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Lightbox / Video Modal with Likes and Comments */}
      <MediaLightboxModal
        isOpen={isLightboxOpen}
        item={activeMedia}
        items={filteredGalleries}
        onClose={() => {
          setIsLightboxOpen(false);
          setActiveMedia(null);
        }}
        onNavigate={handleNavigateLightbox}
      />
    </div>
  );
}
