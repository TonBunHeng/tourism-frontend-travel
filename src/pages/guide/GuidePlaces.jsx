import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowLeft, Search, Edit3, Loader2 } from 'lucide-react';
import guideService from '../../services/guideService';

export default function GuidePlaces() {
  const [places, setPlaces] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPlaces = useCallback(async () => {
    setLoading(true);
    try {
      const res = await guideService.getPlaces({ search });
      const list = res?.data?.places || res?.data || res || [];
      setPlaces(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPlaces();
  }, [fetchPlaces]);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm">
          <div>
            <Link to="/guide/dashboard" className="text-xs font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1 mb-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Guide Dashboard
            </Link>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Destination Management</h1>
          </div>

          <Link
            to="/guide/places/new"
            className="px-4 py-2.5 bg-[#003E83] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Destination
          </Link>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm">
          <div className="relative">
            <input
              type="text"
              placeholder="Search destination by name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#003E83] animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {places.map((place) => (
              <div key={place.id} className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 space-y-3 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">{place.category?.name || 'Attraction'}</span>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white line-clamp-1">{place.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{place.description}</p>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-semibold">{place.province?.name || 'Cambodia'}</span>
                  <Link
                    to={`/guide/places/${place.id}/edit`}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 text-gray-800 dark:text-zinc-200 text-xs font-bold rounded-lg flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
