import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  Calendar, 
  Image as ImageIcon, 
  Plus, 
  Star, 
  Loader2, 
  ChevronRight
} from 'lucide-react';
import guideService from '../../services/guideService';

export default function GuideDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await guideService.getDashboardStats();
        setStats(res?.data || res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#003E83] dark:text-[#60a5fa] animate-spin" />
        <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">Loading Guide Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Guide & Editor Dashboard
          </h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
            Curate Cambodian destinations, heritage stories, events, and tourist reviews.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/guide/places/new"
            className="px-3.5 py-2 bg-[#003E83] hover:bg-[#002e62] dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] dark:text-zinc-950 text-white text-xs font-semibold rounded-md shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Destination</span>
          </Link>
          <Link
            to="/guide/events/new"
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Event</span>
          </Link>
        </div>
      </div>

      {/* Counters Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/guide/places" className="bg-white dark:bg-zinc-900 p-5 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-xs space-y-2 hover:border-[#003E83] dark:hover:border-[#60a5fa] transition-colors">
          <div className="flex items-center justify-between text-gray-500 dark:text-zinc-400 text-xs">
            <span className="font-semibold">Destinations</span>
            <Compass className="w-4 h-4 text-[#003E83] dark:text-[#60a5fa]" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.places_count || 0}</p>
          <span className="text-xs text-[#003E83] dark:text-[#60a5fa] font-semibold">Manage Places →</span>
        </Link>

        <Link to="/guide/events" className="bg-white dark:bg-zinc-900 p-5 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-xs space-y-2 hover:border-[#003E83] dark:hover:border-[#60a5fa] transition-colors">
          <div className="flex items-center justify-between text-gray-500 dark:text-zinc-400 text-xs">
            <span className="font-semibold">Events</span>
            <Calendar className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.events_count || 0}</p>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">Manage Events →</span>
        </Link>

        <Link to="/guide/gallery" className="bg-white dark:bg-zinc-900 p-5 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-xs space-y-2 hover:border-[#003E83] dark:hover:border-[#60a5fa] transition-colors">
          <div className="flex items-center justify-between text-gray-500 dark:text-zinc-400 text-xs">
            <span className="font-semibold">Media Curated</span>
            <ImageIcon className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.media_count || 0}</p>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Manage Gallery →</span>
        </Link>

        <Link to="/guide/reviews" className="bg-white dark:bg-zinc-900 p-5 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-xs space-y-2 hover:border-[#003E83] dark:hover:border-[#60a5fa] transition-colors">
          <div className="flex items-center justify-between text-gray-500 dark:text-zinc-400 text-xs">
            <span className="font-semibold">Pending Reviews</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.pending_reviews_count || 0}</p>
          <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">Review Feed →</span>
        </Link>
      </div>

      {/* Quick Actions & Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-gray-200 dark:border-zinc-800 space-y-4 shadow-xs transition-colors">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-zinc-800 pb-2">
            Editor Curation Shortcuts
          </h3>
          <div className="space-y-2">
            <Link to="/guide/places/new" className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800/60 rounded-md border border-gray-200/80 dark:border-zinc-700/60 font-semibold text-xs text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
              <span>Create Destination / Temple Guide</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link to="/guide/events/new" className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800/60 rounded-md border border-gray-200/80 dark:border-zinc-700/60 font-semibold text-xs text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
              <span>Schedule Cultural Festival / Event</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link to="/guide/gallery" className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800/60 rounded-md border border-gray-200/80 dark:border-zinc-700/60 font-semibold text-xs text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
              <span>Upload High-Res Destination Photos</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-gray-200 dark:border-zinc-800 space-y-4 shadow-xs transition-colors">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-zinc-800 pb-2">
            Guide Role & Scope
          </h3>
          <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
            As a Guide / Editor, you curate destination information, entrance fees, opening hours, cultural heritage descriptions, and provide verified advice to tourists.
          </p>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 rounded-md text-amber-800 dark:text-amber-300 text-xs">
            Administrative functions (User management, security settings, system logs) remain restricted to Super Admin & Admin.
          </div>
        </div>
      </div>
    </div>
  );
}
