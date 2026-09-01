import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Star, TrendingUp, ArrowLeft, Loader2 } from 'lucide-react';
import businessService from '../../services/businessService';

export default function BusinessAnalytics() {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBiz, setSelectedBiz] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await businessService.getOwnerBusinesses();
        const list = res?.data?.businesses || res?.data || res || [];
        setBusinesses(Array.isArray(list) ? list : []);
        if (list.length > 0) {
          setSelectedBiz(list[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (selectedBiz) {
      const loadStats = async () => {
        try {
          const res = await businessService.getStatistics(selectedBiz);
          setStats(res?.data || res);
        } catch (err) {
          console.error(err);
        }
      };
      loadStats();
    }
  }, [selectedBiz]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#003E83] dark:text-blue-400 animate-spin" />
        <p className="text-sm font-medium text-gray-500">Loading Business Analytics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm">
          <div>
            <Link to="/business/dashboard" className="text-xs font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1 mb-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
            </Link>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-indigo-500" />
              <span>Business Performance Analytics</span>
            </h1>
          </div>

          {businesses.length > 0 && (
            <select
              value={selectedBiz}
              onChange={(e) => setSelectedBiz(e.target.value)}
              className="p-2.5 bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-bold text-gray-900 dark:text-white cursor-pointer"
            >
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          )}
        </div>

        {stats ? (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-200 dark:border-zinc-800 space-y-2">
                <span className="text-xs font-bold text-gray-400 uppercase">Average Rating</span>
                <p className="text-3xl font-extrabold text-amber-500 flex items-center gap-1">
                  <Star className="w-6 h-6 fill-amber-400" /> {stats.rating}
                </p>
                <span className="text-[11px] text-gray-500">{stats.total_reviews} total reviews</span>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-200 dark:border-zinc-800 space-y-2">
                <span className="text-xs font-bold text-gray-400 uppercase">Active Promotions</span>
                <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{stats.active_promotions}</p>
                <span className="text-[11px] text-gray-500">Live deals</span>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-200 dark:border-zinc-800 space-y-2">
                <span className="text-xs font-bold text-gray-400 uppercase">Services Listed</span>
                <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{stats.total_services}</p>
                <span className="text-[11px] text-gray-500">Available items</span>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-200 dark:border-zinc-800 space-y-2">
                <span className="text-xs font-bold text-gray-400 uppercase">Scheduled Events</span>
                <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{stats.total_events}</p>
                <span className="text-[11px] text-gray-500">Upcoming activities</span>
              </div>
            </div>

            {/* Performance Overview */}
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-200 dark:border-zinc-800 space-y-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <span>Engagement Overview for {stats.name}</span>
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Your business profile is actively displayed to tourists searching for hospitality, dining, and activities in Cambodia. Keep your opening hours, gallery, and menu updated to boost engagement.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 p-12 rounded-3xl border border-gray-200 dark:border-zinc-800 text-center text-gray-500 text-xs">
            No statistics available for the selected business.
          </div>
        )}
      </div>
    </div>
  );
}
