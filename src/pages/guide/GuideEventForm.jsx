import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import guideService from '../../services/guideService';
import provinceService from '../../services/provinceService';
import { useAlert } from '../../context/AlertContext';

export default function GuideEventForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Culture',
    description: '',
    location: '',
    province_id: '',
    start_date: '',
    end_date: '',
    price: '',
    organizer: '',
  });

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const pRes = await provinceService.getProvinces().catch(() => ({ data: [] }));
        setProvinces(pRes?.data || pRes || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMetadata();

    if (isEdit) {
      const fetchEvent = async () => {
        try {
          const res = await guideService.getEvent(id);
          const data = res?.data || res;
          if (data) {
            setFormData({
              title: data.title || '',
              category: data.category || 'Culture',
              description: data.description || '',
              location: data.location || '',
              province_id: data.province_id || '',
              start_date: data.start_date || '',
              end_date: data.end_date || '',
              price: data.price || '',
              organizer: data.organizer || '',
            });
          }
        } catch (err) {
          showAlert({ title: 'Error', message: err?.message || 'Failed to load event.', type: 'danger' });
          navigate('/guide/events');
        } finally {
          setFetching(false);
        }
      };
      fetchEvent();
    }
  }, [id, isEdit, navigate, showAlert]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      showAlert({ title: 'Validation Error', message: 'Title is required.', type: 'warning' });
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await guideService.updateEvent(id, formData);
        showAlert({ title: 'Success', message: 'Event updated successfully.', type: 'success' });
      } else {
        await guideService.createEvent(formData);
        showAlert({ title: 'Success', message: 'Event scheduled successfully.', type: 'success' });
      }
      navigate('/guide/events');
    } catch (err) {
      showAlert({ title: 'Error', message: err?.message || 'Failed to save event.', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/guide/events" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" /> Back to Events
          </Link>
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
            {isEdit ? 'Edit Event' : 'Schedule Event'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-zinc-800 space-y-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 block mb-1">Event Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Khmer New Year Water Festival"
                className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 block mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Culture, Heritage, Exhibition..."
                  className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 block mb-1">Province</label>
                <select
                  name="province_id"
                  value={formData.province_id}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white"
                >
                  <option value="">Select Province</option>
                  {provinces.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 block mb-1">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 block mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Venue or Landmark"
                  className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 block mb-1">Description</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Festival details, schedules, entrance info..."
                className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-end gap-3">
            <Link to="/guide/events" className="px-5 py-2.5 bg-gray-100 dark:bg-zinc-800 text-gray-700 font-bold text-xs rounded-xl">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isEdit ? 'Update Event' : 'Save Event'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
