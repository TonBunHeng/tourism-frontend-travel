import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Calendar, Users, DollarSign, Plus, Copy, Trash2,
  Compass, ArrowRight, CheckCircle2, Clock, AlertCircle
} from 'lucide-react';
import tripService from '../../services/tripService';
import { useAlert } from '../../context/AlertContext';

export default function Trips() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Create Trip Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    destination: 'Siem Reap',
    start_date: '',
    end_date: '',
    budget: 150,
    travelers: 2,
    status: 'planning',
    notes: '',
    is_public: false,
  });

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = filterStatus !== 'all' ? { status: filterStatus } : {};
      const res = await tripService.getTrips(params);
      setTrips(res.data || []);
    } catch (err) {
      console.error('Failed to load trips:', err);
      setError(err.response?.data?.message || 'Unable to load your trips.');
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTrips();
  }, [fetchTrips]);

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showAlert('error', 'Trip Title Required', 'Please enter a title for your trip.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await tripService.createTrip(formData);
      showAlert('success', 'Trip Created!', 'Your new travel plan has been created.');
      setShowCreateModal(false);
      setFormData({
        title: '',
        destination: 'Siem Reap',
        start_date: '',
        end_date: '',
        budget: 150,
        travelers: 2,
        status: 'planning',
        notes: '',
        is_public: false,
      });
      navigate(`/trips/${res.data.id}`);
    } catch (err) {
      console.error('Create trip error:', err);
      showAlert('error', 'Creation Failed', err.response?.data?.message || 'Could not create trip.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDuplicate = async (tripId, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await tripService.duplicateTrip(tripId);
      showAlert('success', 'Trip Duplicated', 'A copy of the trip was created.');
      fetchTrips();
    } catch {
      showAlert('error', 'Failed', 'Could not duplicate trip.');
    }
  };

  const handleDelete = async (tripId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this trip?')) return;

    try {
      await tripService.deleteTrip(tripId);
      showAlert('success', 'Deleted', 'Trip was removed successfully.');
      setTrips(prev => prev.filter(t => t.id !== tripId));
    } catch {
      showAlert('error', 'Failed', 'Could not delete trip.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"><CheckCircle2 size={12} /> Confirmed</span>;
      case 'completed':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"><CheckCircle2 size={12} /> Completed</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">Cancelled</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"><Clock size={12} /> Planning</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-sm text-[#003E83] dark:text-blue-400 font-semibold mb-1">
            <Compass size={18} />
            <span>AngkorVerses Itinerary Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            My Travel Trips & Itineraries
          </h1>
          <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1">
            Plan, organize, and customize your personalized journeys across Cambodia.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#003E83] hover:bg-[#002f63] text-white text-sm font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={18} />
            <span>Create New Trip</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 my-6 overflow-x-auto pb-2">
        {['all', 'planning', 'confirmed', 'completed', 'cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              filterStatus === st
                ? 'bg-[#003E83] text-white shadow-xs'
                : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-800'
            }`}
          >
            {st === 'all' ? 'All Trips' : st}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 rounded-lg bg-gray-100 dark:bg-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-center">
          <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-red-800 dark:text-red-300">{error}</p>
          <button
            onClick={fetchTrips}
            className="mt-3 px-4 py-1.5 text-xs font-semibold rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      ) : trips.length === 0 ? (
        <div className="p-12 text-center rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-xs">
          <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-zinc-800 text-[#003E83] dark:text-[#60a5fa] flex items-center justify-center mx-auto mb-4 border border-blue-100 dark:border-zinc-700">
            <Compass size={24} />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">No Trips Found</h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-md mx-auto mt-1 mb-6">
            You have not created any travel itineraries yet. Start planning your dream Cambodian adventure now!
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#003E83] text-white text-xs font-semibold hover:bg-[#002f63] cursor-pointer shadow-xs"
          >
            <Plus size={16} />
            <span>Create Your First Trip</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => navigate(`/trips/${trip.id}`)}
              className="group bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 hover:border-[#003E83] dark:hover:border-blue-500/60 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col overflow-hidden"
            >
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400 font-medium">
                    <MapPin size={14} className="text-[#003E83] dark:text-blue-400" />
                    <span>{trip.destination || 'Cambodia'}</span>
                  </div>
                  {getStatusBadge(trip.status)}
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#003E83] dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                  {trip.title}
                </h3>

                {trip.notes && (
                  <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {trip.notes}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800/80 text-xs text-gray-600 dark:text-zinc-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400 shrink-0" />
                    <span className="truncate">
                      {trip.start_date ? `${trip.duration_days} Days` : 'Flexible Dates'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-gray-400 shrink-0" />
                    <span>{trip.travelers} Traveler{trip.travelers > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={14} className="text-gray-400 shrink-0" />
                    <span>${trip.budget || 0} {trip.currency}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Compass size={14} className="text-gray-400 shrink-0" />
                    <span>{trip.itineraries_count || 0} Activities</span>
                  </div>
                </div>
              </div>

              {/* Action bar */}
              <div className="px-5 py-3 bg-gray-50/70 dark:bg-zinc-800/50 border-t border-gray-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                <span className="text-[#003E83] dark:text-blue-400 font-semibold group-hover:underline inline-flex items-center gap-1">
                  View Itinerary <ArrowRight size={13} />
                </span>

                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => handleDuplicate(trip.id, e)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                    title="Duplicate Trip"
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(trip.id, e)}
                    className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                    title="Delete Trip"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Trip Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-lg max-w-lg w-full p-6 shadow-xl border border-gray-200 dark:border-zinc-800 animate-in fade-in zoom-in-95">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Create New Travel Plan
            </h2>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mb-5">
              Set up your destination, dates, and budget for your upcoming Cambodian journey.
            </p>

            <form onSubmit={handleCreateTrip} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                  Trip Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Siem Reap Angkor Explorer 2026"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-md text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-[#003E83]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Primary Destination
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Siem Reap, Kampot"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full px-3 py-2 rounded-md text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-[#003E83]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Travelers
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.travelers}
                    onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-md text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-[#003E83]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-md text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-[#003E83]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    min={formData.start_date || undefined}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-md text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-[#003E83]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Estimated Budget ($ USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-md text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-[#003E83]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Trip Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-sm bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#003E83]"
                  >
                    <option value="planning">Planning Phase</option>
                    <option value="confirmed">Confirmed & Booked</option>
                    <option value="completed">Completed Journey</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                  Trip Notes / Wishlist
                </label>
                <textarea
                  rows="3"
                  placeholder="e.g., Must try local Kuy Teav, visit temples at sunset, buy Angkor Pass."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl text-sm bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#003E83]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-[#003E83] text-white text-xs font-semibold hover:bg-[#002f63] disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {submitting ? 'Creating...' : 'Create Trip Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
