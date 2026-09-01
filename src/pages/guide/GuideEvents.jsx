import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowLeft, Edit3, Loader2 } from 'lucide-react';
import guideService from '../../services/guideService';

export default function GuideEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await guideService.getEvents();
        const list = res?.data?.events || res?.data || res || [];
        setEvents(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm">
          <div>
            <Link to="/guide/dashboard" className="text-xs font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1 mb-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Guide Dashboard
            </Link>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Cultural Events & Festival Calendar</h1>
          </div>

          <Link
            to="/guide/events/new"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Schedule Event
          </Link>
        </div>

        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((e) => (
              <div key={e.id} className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 space-y-3 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-indigo-600">{e.category || 'Cultural Event'}</span>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">{e.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{e.description}</p>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-semibold">{e.start_date}</span>
                  <Link
                    to={`/guide/events/${e.id}/edit`}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 text-xs font-bold rounded-lg flex items-center gap-1"
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
