import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Loader2 } from 'lucide-react';
import { placeService } from '../../services/placeService';
import { eventService } from '../../services/eventService';
import { galleryService } from '../../services/galleryService';
import businessService from '../../services/businessService';
import { useTravel } from '../../context/TravelContext';
import HomeHero from './HomeHero';
import PlaceCard from '../../components/common/PlaceCard';
import BusinessCard from '../../components/common/BusinessCard';
import EventCard from '../../components/common/EventCard';
import ProvinceCard from '../../components/common/ProvinceCard';
import GalleryCard from '../../components/common/GalleryCard';
import EventDetailsModal from '../events/EventDetailsModal';
import MediaLightboxModal from '../../components/common/MediaLightboxModal';

export default function Home() {
  const { provinces } = useTravel();
  const [featuredPlaces, setFeaturedPlaces] = useState([]);
  const [featuredBusinesses, setFeaturedBusinesses] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [featuredGalleries, setFeaturedGalleries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [placesRes, bizRes, eventsRes, galleryRes] = await Promise.allSettled([
          placeService.getPlaces({ per_page: 6, sort_by: 'popular' }),
          businessService.getBusinesses({ per_page: 3, sort: 'rating' }),
          eventService.getEvents({ per_page: 3, status: 'Upcoming' }),
          galleryService.getGalleries({ per_page: 3 })
        ]);

        if (placesRes.status === 'fulfilled' && placesRes.value?.data) {
          setFeaturedPlaces(placesRes.value.data);
        }
        if (bizRes.status === 'fulfilled') {
          const list = bizRes.value?.data?.businesses || bizRes.value?.data || bizRes.value || [];
          setFeaturedBusinesses(Array.isArray(list) ? list.slice(0, 3) : []);
        }
        if (eventsRes.status === 'fulfilled' && eventsRes.value?.data) {
          setUpcomingEvents(eventsRes.value.data);
        }
        if (galleryRes.status === 'fulfilled' && galleryRes.value?.data) {
          setFeaturedGalleries(galleryRes.value.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleViewEventDetails = (event) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handlePreviewGallery = (item) => {
    setSelectedMedia(item);
    setIsLightboxOpen(true);
  };

  const handleNavigateLightbox = (direction) => {
    if (!selectedMedia) return;
    const currentIndex = featuredGalleries.findIndex((g) => g.id === selectedMedia.id);
    if (direction === 'next' && currentIndex < featuredGalleries.length - 1) {
      setSelectedMedia(featuredGalleries[currentIndex + 1]);
    } else if (direction === 'prev' && currentIndex > 0) {
      setSelectedMedia(featuredGalleries[currentIndex - 1]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#003E83] dark:text-[#60a5fa] animate-spin" />
        <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">Loading AngkorVerses travel platform...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      <HomeHero />

      {/* Featured Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 mb-4 pb-2 border-b border-gray-200 dark:border-zinc-800">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              Discover Heritage Sites & Attractions
            </h2>
            <p className="text-xs text-gray-500 dark:text-zinc-400">Popular tourist attractions</p>
          </div>
          <Link
            to="/places"
            className="flex items-center gap-1 text-xs font-semibold text-[#003E83] dark:text-[#60a5fa] hover:underline"
          >
            View All ({featuredPlaces.length}+)
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-zinc-800 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
      </section>

      {/* Verified Tourism Businesses */}
      {featuredBusinesses.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 mb-4 pb-2 border-b border-gray-200 dark:border-zinc-800">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                Verified Local Hospitality & Businesses
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">Top-rated hotels, Khmer dining, and tour operators</p>
            </div>
            <Link
              to="/businesses"
              className="flex items-center gap-1 text-xs font-semibold text-[#003E83] dark:text-[#60a5fa] hover:underline"
            >
              Explore All Businesses
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredBusinesses.map((biz) => (
              <BusinessCard key={biz.id} business={biz} />
            ))}
          </div>
        </section>
      )}

      {/* Photo & Media Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 mb-4 pb-2 border-b border-gray-200 dark:border-zinc-800">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              Photo & Media Gallery
            </h2>
            <p className="text-xs text-gray-500 dark:text-zinc-400">Captivating photography of Angkor and Cambodian landscapes</p>
          </div>
          <Link
            to="/gallery"
            className="flex items-center gap-1 text-xs font-semibold text-[#003E83] dark:text-[#60a5fa] hover:underline"
          >
            Explore Gallery
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-gray-200 dark:bg-zinc-800 rounded-xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredGalleries.map((item) => (
              <GalleryCard
                key={item.id}
                item={item}
                onPreview={handlePreviewGallery}
              />
            ))}
          </div>
        )}
      </section>

      {/* Provinces Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 mb-4 pb-2 border-b border-gray-200 dark:border-zinc-800">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              Explore by Province
            </h2>
            <p className="text-xs text-gray-500 dark:text-zinc-400">Geographic destinations across Cambodia</p>
          </div>
          <Link
            to="/provinces"
            className="flex items-center gap-1 text-xs font-semibold text-[#003E83] dark:text-[#60a5fa] hover:underline"
          >
            All 25 Provinces
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {provinces.slice(0, 4).map((province) => (
            <ProvinceCard key={province.id} province={province} />
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 mb-4 pb-2 border-b border-gray-200 dark:border-zinc-800">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              Upcoming Cultural Events
            </h2>
            <p className="text-xs text-gray-500 dark:text-zinc-400">Festivals and holiday schedules</p>
          </div>
          <Link
            to="/events"
            className="flex items-center gap-1 text-xs font-semibold text-[#003E83] dark:text-[#60a5fa] hover:underline"
          >
            Event Calendar
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onViewDetails={handleViewEventDetails}
            />
          ))}
        </div>
      </section>

      {/* Badges Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-50 dark:bg-zinc-900 border border-blue-200 dark:border-zinc-800 rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-[#003E83] dark:bg-[#60a5fa] text-white dark:text-zinc-950 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Unlock Explorer Badges as You Travel
              </h3>
              <p className="text-xs text-gray-600 dark:text-zinc-400 mt-0.5">
                Earn badges by saving destinations and submitting verified reviews.
              </p>
            </div>
          </div>
          <Link
            to="/achievements"
            className="px-3.5 py-1.5 bg-[#003E83] hover:bg-[#002e62] dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] dark:text-zinc-950 text-white text-xs font-semibold rounded-md shadow-xs whitespace-nowrap transition-colors"
          >
            View Badges
          </Link>
        </div>
      </section>

      {/* Event Details Modal */}
      <EventDetailsModal
        isOpen={isEventModalOpen}
        event={selectedEvent}
        onClose={() => {
          setIsEventModalOpen(false);
          setSelectedEvent(null);
        }}
      />

      {/* Media Lightbox Modal */}
      <MediaLightboxModal
        isOpen={isLightboxOpen}
        item={selectedMedia}
        items={featuredGalleries}
        onClose={() => {
          setIsLightboxOpen(false);
          setSelectedMedia(null);
        }}
        onNavigate={handleNavigateLightbox}
      />
    </div>
  );
}
