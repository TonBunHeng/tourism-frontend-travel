import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar, MapPin, Users, DollarSign, Clock, Plus, Trash2,
  ArrowLeft, CheckCircle2, Circle, Edit3, Compass, Sparkles,
  Share2, Save, AlertCircle
} from 'lucide-react';
import tripService from '../../services/tripService';
import placeService from '../../services/placeService';
import aiService from '../../services/aiService';
import { useAlert } from '../../context/AlertContext';

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Available Places for quick-picker
  const [places, setPlaces] = useState([]);

  // Add Itinerary Item Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingItem, setAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    day_number: 1,
    time_slot: '09:00 AM',
    activity: '',
    place_id: '',
    estimated_cost: 0,
    duration_minutes: 60,
    notes: '',
  });

  // AI Itinerary Auto-Generator State
  const [generatingAi, setGeneratingAi] = useState(false);

  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await tripService.getTripById(id);
      setTrip(res.data);
    } catch (err) {
      console.error('Trip details fetch error:', err);
      setError(err.response?.data?.message || 'Could not load trip details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaces = async () => {
    try {
      const res = await placeService.getPlaces({ per_page: 50 });
      setPlaces(res.data || []);
    } catch (err) {
      console.error('Places fetch error:', err);
    }
  };

  useEffect(() => {
    fetchTripDetails();
    fetchPlaces();
  }, [id]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.activity.trim()) {
      showAlert('error', 'Activity Required', 'Please enter what you plan to do.');
      return;
    }

    try {
      setAddingItem(true);
      const payload = {
        ...newItem,
        place_id: newItem.place_id ? parseInt(newItem.place_id) : null,
        estimated_cost: parseFloat(newItem.estimated_cost) || 0,
        day_number: parseInt(newItem.day_number) || 1,
      };

      await tripService.addItinerary(id, payload);
      showAlert('success', 'Added', 'Activity added to your itinerary!');
      setShowAddModal(false);
      setNewItem({
        day_number: 1,
        time_slot: '09:00 AM',
        activity: '',
        place_id: '',
        estimated_cost: 0,
        duration_minutes: 60,
        notes: '',
      });
      fetchTripDetails();
    } catch (err) {
      console.error('Add item error:', err);
      showAlert('error', 'Error', err.response?.data?.message || 'Could not add activity.');
    } finally {
      setAddingItem(false);
    }
  };

  const handleDeleteItem = async (itineraryId) => {
    if (!window.confirm('Remove this activity from the itinerary?')) return;
    try {
      await tripService.deleteItinerary(id, itineraryId);
      showAlert('success', 'Removed', 'Activity removed.');
      fetchTripDetails();
    } catch (err) {
      showAlert('error', 'Error', 'Could not delete item.');
    }
  };

  const handleGenerateAiItinerary = async () => {
    if (!trip) return;
    try {
      setGeneratingAi(true);
      showAlert('info', 'AI Assistant', 'AngkorVerse AI is generating suggestions for your itinerary...');
      const res = await aiService.generateItinerary({
        destination: trip.destination || 'Siem Reap',
        duration_days: trip.duration_days || 3,
        budget: 'moderate',
      });

      const aiData = res.data;
      if (aiData?.days && Array.isArray(aiData.days)) {
        for (const day of aiData.days) {
          if (day.activities && Array.isArray(day.activities)) {
            for (const act of day.activities) {
              await tripService.addItinerary(id, {
                day_number: day.day || 1,
                time_slot: act.time || '10:00 AM',
                activity: act.activity || 'Sightseeing',
                estimated_cost: act.cost || 0,
                notes: 'Suggested by AngkorVerse AI',
              });
            }
          }
        }
        showAlert('success', 'Itinerary Populated!', 'AI suggestions have been added to your schedule.');
        fetchTripDetails();
      }
    } catch (err) {
      console.error('AI itinerary error:', err);
      showAlert('error', 'AI Failed', 'Could not generate itinerary automatically.');
    } finally {
      setGeneratingAi(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="h-48 rounded-lg bg-gray-200 dark:bg-zinc-800 animate-pulse mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 rounded-lg bg-gray-100 dark:bg-zinc-800 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Trip Not Found</h2>
        <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1 mb-6">{error}</p>
        <Link
          to="/trips"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#003E83] text-white text-sm font-semibold"
        >
          <ArrowLeft size={16} />
          <span>Back to Trips</span>
        </Link>
      </div>
    );
  }

  // Group itineraries by day_number
  const itineraries = trip.itineraries || [];
  const daysMap = {};
  const maxDays = Math.max(trip.duration_days || 1, 1);

  for (let i = 1; i <= maxDays; i++) {
    daysMap[i] = [];
  }

  itineraries.forEach((item) => {
    const day = item.day_number || 1;
    if (!daysMap[day]) daysMap[day] = [];
    daysMap[day].push(item);
  });

  const totalCalculatedCost = itineraries.reduce((sum, it) => sum + (parseFloat(it.estimated_cost) || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Back button */}
      <Link
        to="/trips"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-zinc-400 hover:text-[#003E83] dark:hover:text-blue-400 mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Back to All Trips</span>
      </Link>

      {/* Hero Trip Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 dark:bg-zinc-800 text-[#003E83] dark:text-[#60a5fa] text-xs font-bold uppercase tracking-wider">
              <MapPin size={13} />
              <span>{trip.destination || 'Cambodia Adventure'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {trip.title}
            </h1>
            {trip.notes && (
              <p className="text-sm text-gray-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
                {trip.notes}
              </p>
            )}
          </div>

          {/* Quick stats pill */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 dark:bg-zinc-800/60 p-4 rounded-lg border border-gray-100 dark:border-zinc-800 shrink-0">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-zinc-500">Duration</span>
              <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{trip.duration_days} Days</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-zinc-500">Travelers</span>
              <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{trip.travelers} Persons</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-zinc-500">Planned Cost</span>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">${totalCalculatedCost.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-zinc-500">Budget Limit</span>
              <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">${trip.budget || 0}</p>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-6 border-t border-gray-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-400">
            <Calendar size={14} className="text-[#003E83] dark:text-[#60a5fa]" />
            <span>
              {trip.start_date ? `${trip.start_date} to ${trip.end_date}` : 'Dates not scheduled yet'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerateAiItinerary}
              disabled={generatingAi}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 text-xs font-semibold border border-purple-200 dark:border-purple-800 transition-all cursor-pointer shadow-xs"
            >
              <Sparkles size={14} />
              <span>{generatingAi ? 'Generating...' : 'Auto-Fill with AI'}</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#003E83] hover:bg-[#002f63] text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
            >
              <Plus size={15} />
              <span>Add Activity</span>
            </button>
          </div>
        </div>
      </div>

      {/* Day by Day Itinerary Breakdown */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Compass size={18} className="text-[#003E83] dark:text-[#60a5fa]" />
            <span>Day-by-Day Schedule</span>
          </h2>
          <span className="text-xs text-gray-500 dark:text-zinc-400">
            {itineraries.length} total activities planned
          </span>
        </div>

        {Object.entries(daysMap).map(([dayNum, dayItems]) => (
          <div
            key={dayNum}
            className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-xs"
          >
            {/* Day Header */}
            <div className="px-6 py-4 bg-gray-50/70 dark:bg-zinc-800/40 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#003E83] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                  D{dayNum}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Day {dayNum} Itinerary
                  </h3>
                  <span className="text-[11px] text-gray-500 dark:text-zinc-400">
                    {dayItems.length} activities scheduled
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setNewItem(prev => ({ ...prev, day_number: parseInt(dayNum) }));
                  setShowAddModal(true);
                }}
                className="text-xs text-[#003E83] dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus size={13} /> Add to Day {dayNum}
              </button>
            </div>

            {/* Activities in this Day */}
            {dayItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400 dark:text-zinc-500">
                No activities added for Day {dayNum} yet. Click "Add Activity" to plan your stops.
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-zinc-800/80">
                {dayItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-zinc-800 text-blue-800 dark:text-blue-300 text-[11px] font-bold shrink-0 mt-0.5 border border-blue-100 dark:border-zinc-700">
                        {item.time_slot || 'Anytime'}
                      </div>

                      <div className="space-y-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                          {item.activity}
                        </h4>

                        {item.place && (
                          <Link
                            to={`/places/${item.place.id}`}
                            className="inline-flex items-center gap-1 text-xs text-[#003E83] dark:text-blue-400 hover:underline font-medium"
                          >
                            <MapPin size={12} />
                            <span>{item.place.name} ({item.place.province})</span>
                          </Link>
                        )}

                        {item.notes && (
                          <p className="text-xs text-gray-500 dark:text-zinc-400">
                            {item.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-zinc-800">
                      {item.estimated_cost > 0 && (
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                          ${parseFloat(item.estimated_cost).toFixed(2)}
                        </span>
                      )}

                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                        title="Delete Activity"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Activity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-lg max-w-md w-full p-6 shadow-xl border border-gray-200 dark:border-zinc-800 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              Add Activity to Itinerary
            </h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mb-4">
              Specify what you'll do, time slot, and destination stop.
            </p>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Day Number *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={maxDays}
                    required
                    value={newItem.day_number}
                    onChange={(e) => setNewItem({ ...newItem, day_number: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-md text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-[#003E83]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Time / Slot
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 05:30 AM, Morning"
                    value={newItem.time_slot}
                    onChange={(e) => setNewItem({ ...newItem, time_slot: e.target.value })}
                    className="w-full px-3 py-2 rounded-md text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-[#003E83]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                  Activity Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Sunrise photo shoot at Angkor Wat reflecting pool"
                  value={newItem.activity}
                  onChange={(e) => setNewItem({ ...newItem, activity: e.target.value })}
                  className="w-full px-3 py-2 rounded-md text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-[#003E83]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                  Link to Destination (Optional)
                </label>
                <select
                  value={newItem.place_id}
                  onChange={(e) => setNewItem({ ...newItem, place_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-md text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-[#003E83]"
                >
                  <option value="">-- None / Custom Activity --</option>
                  {places.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.province?.name || 'Cambodia'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                  Estimated Cost ($ USD)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={newItem.estimated_cost}
                  onChange={(e) => setNewItem({ ...newItem, estimated_cost: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-md text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-[#003E83]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bring water and wide lens"
                  value={newItem.notes}
                  onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-md text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-[#003E83]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-md text-xs font-semibold text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingItem}
                  className="px-5 py-2 rounded-xl bg-[#003E83] text-white text-xs font-semibold hover:bg-[#002f63] disabled:opacity-50 cursor-pointer"
                >
                  {addingItem ? 'Adding...' : 'Add Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
