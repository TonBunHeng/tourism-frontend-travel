import { useState, useMemo } from 'react';
import { Search, ShieldCheck, Star, Users, MapPin, Languages, Check, X, Award } from 'lucide-react';
import { GUIDES_DATA } from '../../data/guidesData';
import TourGuideCard from '../../components/common/TourGuideCard';
import BookingModal from '../../components/common/BookingModal';
import Breadcrumb from '../../components/common/Breadcrumb';

export default function Guides() {
  const [search, setSearch] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedProvince, setSelectedProvince] = useState('All');

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedGuideForBooking, setSelectedGuideForBooking] = useState(null);

  const languages = ['All', 'English', 'French', 'Mandarin', 'Japanese', 'German'];
  const provinces = ['All', 'Siem Reap', 'Phnom Penh', 'Koh Kong', 'Battambang', 'Kampot'];

  const filteredGuides = useMemo(() => {
    return GUIDES_DATA.filter((guide) => {
      const matchSearch =
        guide.name.toLowerCase().includes(search.toLowerCase()) ||
        guide.title.toLowerCase().includes(search.toLowerCase()) ||
        guide.specialties.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
        guide.province.toLowerCase().includes(search.toLowerCase());

      const matchLang =
        selectedLanguage === 'All' ||
        guide.languages.some(l => l.toLowerCase().includes(selectedLanguage.toLowerCase()));

      const matchProv =
        selectedProvince === 'All' ||
        guide.province.toLowerCase().includes(selectedProvince.toLowerCase());

      return matchSearch && matchLang && matchProv;
    });
  }, [search, selectedLanguage, selectedProvince]);

  const handleOpenBooking = (guide) => {
    setSelectedGuideForBooking(guide);
    setBookingModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumb items={[{ label: 'Local Tour Guides' }]} />

      {/* Hero Overview Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-blue-100 dark:border-zinc-800 bg-gradient-to-br from-blue-50/70 via-white to-slate-50 dark:from-zinc-900 dark:via-zinc-900/90 dark:to-zinc-950 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#003E83]/10 dark:bg-blue-400/10 text-[#003E83] dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Ministry of Tourism Licensed Guides</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Top-Rated Local Tour Guides
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
              Connect directly with verified Cambodian storytellers, temple historians, wildlife rangers, and culinary guides fluent in multiple international languages.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center">
            <span className="px-4 py-2 rounded-2xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-xs font-bold text-[#003E83] dark:text-blue-400 shadow-2xs">
              {filteredGuides.length} Verified Guides
            </span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white/95 dark:bg-zinc-900/95 border border-gray-200/80 dark:border-zinc-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search guide by name or specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-zinc-800/80 text-gray-900 dark:text-white text-xs sm:text-sm rounded-2xl border border-gray-200 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 focus:border-[#003E83] dark:focus:border-blue-400 focus:ring-2 focus:ring-[#003E83]/20 focus:outline-none transition-all"
            />
          </div>

          {/* Language Filter */}
          <div>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-800/80 text-gray-900 dark:text-white text-xs sm:text-sm rounded-2xl border border-gray-200 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 focus:border-[#003E83] dark:focus:border-blue-400 focus:ring-2 focus:ring-[#003E83]/20 focus:outline-none cursor-pointer"
            >
              <option value="All">All Spoken Languages</option>
              {languages.filter(l => l !== 'All').map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* Province Filter */}
          <div>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-800/80 text-gray-900 dark:text-white text-xs sm:text-sm rounded-2xl border border-gray-200 dark:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 focus:border-[#003E83] dark:focus:border-blue-400 focus:ring-2 focus:ring-[#003E83]/20 focus:outline-none cursor-pointer"
            >
              <option value="All">All Locations & Provinces</option>
              {provinces.filter(p => p !== 'All').map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {(search || selectedLanguage !== 'All' || selectedProvince !== 'All') && (
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-zinc-800 text-xs">
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedLanguage('All');
                setSelectedProvince('All');
              }}
              className="flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
            >
              <X size={13} /> Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Guides Grid */}
      {filteredGuides.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-800 rounded-3xl p-14 text-center max-w-lg mx-auto space-y-3">
          <Users className="w-12 h-12 text-gray-300 dark:text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">No Tour Guides Found</h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            Try choosing a different language or province to view available local guides.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <TourGuideCard key={guide.id} guide={guide} onBook={handleOpenBooking} />
          ))}
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        targetItem={selectedGuideForBooking}
        type="guide"
      />
    </div>
  );
}
