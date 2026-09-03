import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Camera, ChevronLeft, ChevronRight } from 'lucide-react';
import { galleryService } from '../../services/galleryService';
import GalleriesHeader from './GalleriesHeader';
import GalleryCard from '../../components/common/GalleryCard';
import MediaLightboxModal from '../../components/common/MediaLightboxModal';
import Breadcrumb from '../../components/common/Breadcrumb';

const isVideoItem = (item) => {
  if (!item) return false;
  const mediaType = (item.media_type || item.type || '').toLowerCase();
  if (mediaType === 'video') return true;
  const url = item.media_url || item.url || item.thumbnail_url || '';
  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url);
};

export default function Galleries() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [filter, setFilter] = useState(searchParams.get('filter') || 'All');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // Lightbox Modal state
  const [activeMedia, setActiveMedia] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setFilter(searchParams.get('filter') || 'All');
    setPage(Number(searchParams.get('page')) || 1);
  }, [searchParams]);

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

  const ITEMS_PER_PAGE = 4;
  const totalPages = Math.ceil(filteredGalleries.length / ITEMS_PER_PAGE) || 1;
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const paginatedGalleries = useMemo(() => {
    return filteredGalleries.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredGalleries, currentPage]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
    const params = new URLSearchParams(searchParams);
    if (newFilter !== 'All') {
      params.set('filter', newFilter);
    } else {
      params.delete('filter');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
    const params = new URLSearchParams(searchParams);
    if (val.trim()) {
      params.set('search', val.trim());
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const handleClearFilters = () => {
    setSearch('');
    setFilter('All');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumb items={[{ label: 'Media Gallery' }]} />
      <GalleriesHeader
        filter={filter}
        setFilter={handleFilterChange}
        search={search}
        setSearch={handleSearchChange}
        filters={['All', 'Photos', 'Videos']}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-80 bg-gray-200 dark:bg-zinc-800 rounded-lg"></div>
          ))}
        </div>
      ) : paginatedGalleries.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {paginatedGalleries.map((item) => (
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
              onClick={handleClearFilters}
              className="px-3 py-1.5 bg-[#003E83] dark:bg-[#60a5fa] text-white dark:text-zinc-950 text-xs font-semibold rounded-md shadow-xs cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="p-1.5 rounded-md bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-semibold text-gray-700 dark:text-zinc-300 px-3 py-1 bg-white dark:bg-zinc-800 rounded-md border border-gray-200 dark:border-zinc-700">
            {currentPage} / {totalPages}
          </span>

          <button
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="p-1.5 rounded-md bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
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
