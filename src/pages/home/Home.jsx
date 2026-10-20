import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, MapPin, Compass, ShieldCheck, Heart, Award, Users, Loader2, Sparkles, Quote } from 'lucide-react';
import { placeService } from '../../services/placeService';
import businessService from '../../services/businessService';
import reviewService from '../../services/reviewService';
import guideService from '../../services/guideService';
import HomeHero from './HomeHero';
import PlaceCard from '../../components/common/PlaceCard';
import BusinessCard from '../../components/common/BusinessCard';
import TourPackageCard from '../../components/common/TourPackageCard';
import TourGuideCard from '../../components/common/TourGuideCard';
import BookingModal from '../../components/common/BookingModal';
import CarouselSlider from '../../components/common/CarouselSlider';

// Verified Fallback Seed Data (used if backend server is still booting or offline)
import { POPULAR_DESTINATIONS_DATA } from '../../data/popularDestinationsData';
import { TOURS_DATA } from '../../data/toursData';
import { GUIDES_DATA } from '../../data/guidesData';
import { TESTIMONIALS_DATA } from '../../data/testimonialsData';

export default function Home() {
  const [popularPlaces, setPopularPlaces] = useState(POPULAR_DESTINATIONS_DATA);
  const [tours, setTours] = useState(TOURS_DATA);
  const [guides, setGuides] = useState(GUIDES_DATA);
  const [testimonials, setTestimonials] = useState(TESTIMONIALS_DATA);
  const [featuredBusinesses, setFeaturedBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedItemForBooking, setSelectedItemForBooking] = useState(null);
  const [bookingType, setBookingType] = useState('tour');

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);

        // 1. Fetch live places from backend API
        try {
          const placeRes = await placeService.getPlaces({ per_page: 5, sort_by: 'rating' });
          const rawPlaces = placeRes?.data?.places || placeRes?.data?.data || placeRes?.data || placeRes || [];
          if (Array.isArray(rawPlaces) && rawPlaces.length > 0) {
            setPopularPlaces(
              rawPlaces.slice(0, 5).map((p) => ({
                id: p.id,
                name: p.name,
                province: p.province || p.province_detail?.name || 'Cambodia',
                tagline: p.description || 'Iconic Cambodian destination',
                image: p.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
                badge: p.category || p.category_detail?.name || 'Must-Visit',
                priceFrom: p.price ? `$${p.price}` : 'Free Admission',
                link: `/places/${p.id}`,
              }))
            );
          }
        } catch (err) {
          console.warn('Backend places endpoint fallback active:', err.message);
        }

        // 2. Fetch live businesses from backend API
        try {
          const bizRes = await businessService.getBusinesses({ per_page: 8, sort: 'rating' });
          const list = bizRes?.data?.businesses || bizRes?.data?.data || bizRes?.data || bizRes || [];
          if (Array.isArray(list) && list.length > 0) {
            setFeaturedBusinesses(list);

            // Map businesses and services into rich tour packages
            const mappedTours = list.map((b) => ({
              id: b.id,
              business_id: b.id,
              service_id: b.services?.[0]?.id || null,
              title: b.services?.[0]?.name || b.name,
              destination: b.province?.name || b.address || 'Cambodia',
              province: b.province?.name || 'Cambodia',
              duration: b.services?.[0]?.duration_minutes
                ? (b.services[0].duration_minutes >= 1440
                    ? `${Math.round(b.services[0].duration_minutes / 1440)} Days`
                    : `${b.services[0].duration_minutes} Mins`)
                : 'Full Day',
              price: parseFloat(b.services?.[0]?.price || (b.price_range === '$$$$' ? 120 : b.price_range === '$$$' ? 85 : 45)),
              rating: parseFloat(b.rating || 4.9),
              reviewsCount: b.review_count || 18,
              image: b.cover_image_url || 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
              description: b.description,
              highlights: ['Licensed English Guide', 'Hotel Pickup & Dropoff', 'Instant Confirmation'],
              badge: b.category?.name || 'Top Rated',
              groupSize: 'Max 12',
            }));
            setTours(mappedTours);
          }
        } catch (err) {
          console.warn('Backend businesses endpoint fallback active:', err.message);
        }

        // 3. Fetch live traveler reviews from backend API
        try {
          const reviewRes = await reviewService.getReviews({ per_page: 6 });
          const rawReviews = reviewRes?.data?.reviews || reviewRes?.data?.data || reviewRes?.data || reviewRes || [];
          if (Array.isArray(rawReviews) && rawReviews.length > 0) {
            setTestimonials(
              rawReviews.slice(0, 4).map((r) => ({
                id: r.id,
                name: r.user_name || 'Verified Explorer',
                country: r.place_name || 'Cambodia',
                avatar: r.user_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                rating: Number(r.rating) || 5,
                date: r.date || 'Recent Visit',
                comment: r.comment,
              }))
            );
          }
        } catch (err) {
          console.warn('Backend reviews endpoint fallback active:', err.message);
        }

        // 4. Fetch live tour guides from backend API
        try {
          const guideRes = await guideService.getGuides({ per_page: 3, sort: 'rating' });
          const rawGuides = guideRes?.data?.guides || guideRes?.data || guideRes || [];
          if (Array.isArray(rawGuides) && rawGuides.length > 0) {
            setGuides(rawGuides.slice(0, 3));
          }
        } catch (err) {
          console.warn('Backend guides endpoint fallback active:', err.message);
        }
      } catch (err) {
        console.error('Failed to load home page data from backend', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleBookTour = (tour) => {
    setSelectedItemForBooking(tour);
    setBookingType('tour');
    setBookingModalOpen(true);
  };

  const handleBookGuide = (guide) => {
    setSelectedItemForBooking(guide);
    setBookingType('guide');
    setBookingModalOpen(true);
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      {/* Hero Section with Cambodian Imagery & Live Search */}
      <HomeHero />

      {/* 1. Popular Destinations from Backend Places API */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-zinc-800 text-xs font-bold text-[#003E83] dark:text-blue-400 mb-2">
              <Compass size={13} />
              <span>Must-Visit Cambodian Icons</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Popular Destinations in Cambodia
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
              Live from our national tourism directory: from Angkor Wat to tropical Koh Rong.
            </p>
          </div>
          <Link
            to="/places"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#003E83] dark:text-blue-400 hover:underline group"
          >
            <span>Explore All Places</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Popular Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {popularPlaces.map((dest) => (
            <Link
              key={dest.id}
              to={dest.link}
              className="group modern-card relative h-80 rounded-3xl overflow-hidden shadow-xs border border-gray-200/80 dark:border-zinc-800 flex flex-col justify-end p-5 transition-all"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

              {/* Tag / Badge Top Left */}
              <div className="absolute top-3 left-3 z-10">
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-white/95 text-gray-900 shadow-sm backdrop-blur-md">
                  {dest.badge}
                </span>
              </div>

              {/* Details Bottom */}
              <div className="relative z-10 text-white space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                  <MapPin size={10} /> {dest.province}
                </span>
                <h3 className="text-base font-extrabold tracking-tight leading-tight drop-shadow-sm group-hover:text-blue-200 transition-colors">
                  {dest.name}
                </h3>
                <p className="text-[11px] text-gray-200 line-clamp-2 leading-relaxed opacity-90">
                  {dest.tagline}
                </p>
                <div className="pt-2 flex items-center justify-between text-xs border-t border-white/20">
                  <span className="text-[11px] font-bold text-blue-200">{dest.priceFrom}</span>
                  <span className="text-[11px] text-gray-300 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    Explore <ArrowRight size={11} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 2. Recommended Tours & Travel Packages from Backend API */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-zinc-800 text-xs font-bold text-[#003E83] dark:text-blue-400 mb-2">
              <Sparkles size={13} className="text-amber-500" />
              <span>Expertly Crafted Journeys</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Recommended Tours & Packages
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
              Curated itineraries from certified Cambodian tour operators and adventure resorts.
            </p>
          </div>
          <Link
            to="/tours"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#003E83] dark:text-blue-400 hover:underline group"
          >
            <span>View All Packages</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.slice(0, 3).map((tour) => (
            <TourPackageCard key={tour.id} tour={tour} onBook={handleBookTour} />
          ))}
        </div>
      </section>

      {/* 3. Featured Hotels, Restaurants & Tourism Businesses from Backend API */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-2">
              <ShieldCheck size={13} />
              <span>Verified Merchant Directory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Featured Hotels & Hospitality Businesses
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
              Book boutique resorts, authentic Khmer restaurants, and reliable transport partners.
            </p>
          </div>
          <Link
            to="/businesses"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#003E83] dark:text-blue-400 hover:underline group"
          >
            <span>Explore All Businesses</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 rounded-3xl bg-gray-200 dark:bg-zinc-800" />
            ))}
          </div>
        ) : featuredBusinesses.length > 0 ? (
          <CarouselSlider itemClassName="w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 snap-start flex flex-col">
            {featuredBusinesses.map((biz) => (
              <BusinessCard key={biz.id} business={biz} />
            ))}
          </CarouselSlider>
        ) : (
          <div className="p-8 text-center bg-gray-50 dark:bg-zinc-900 rounded-3xl text-xs text-gray-500">
            Hospitality directory loading...
          </div>
        )}
      </section>

      {/* 4. Top-Rated Local Tour Guides */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-zinc-800 text-xs font-bold text-[#003E83] dark:text-blue-400 mb-2">
              <Users size={13} />
              <span>Licensed Cambodian Guides</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Top-Rated Local Tour Guides
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
              Hire certified, multilingual local storytellers to unlock Cambodia&apos;s rich history.
            </p>
          </div>
          <Link
            to="/guides"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#003E83] dark:text-blue-400 hover:underline group"
          >
            <span>Meet All Guides</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.slice(0, 3).map((guide) => (
            <TourGuideCard key={guide.id} guide={guide} onBook={handleBookGuide} />
          ))}
        </div>
      </section>

      {/* 5. Customer Testimonials & Reviews from Backend API */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 dark:from-zinc-900 dark:via-zinc-900/90 dark:to-zinc-950 border border-blue-100 dark:border-zinc-800 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#003E83] dark:text-blue-400">
              Verified Traveler Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Loved by Travelers Worldwide
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
              Read real stories from international visitors who explored Cambodia through AngkorVerses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="p-6 rounded-2xl bg-white dark:bg-zinc-850 border border-gray-200/80 dark:border-zinc-800 shadow-2xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(Math.min(5, Math.max(1, t.rating || 5)))].map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed italic">
                    &ldquo;{t.comment}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-zinc-800">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100 dark:ring-zinc-700"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">{t.name}</h4>
                    <span className="text-[11px] text-gray-400 block">{t.country} • {t.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-zinc-800 text-[#003E83] dark:text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">100% Licensed & Verified</h4>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Ministry of Tourism registered partners</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Sparkles size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">Best Rate Guarantee</h4>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Direct local prices with zero hidden fees</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 shadow-2xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-zinc-800 text-amber-500 flex items-center justify-center shrink-0">
              <Award size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">24/7 Traveler Assistance</h4>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">English & Khmer tourist hotlines</p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        targetItem={selectedItemForBooking}
        type={bookingType}
      />
    </div>
  );
}
