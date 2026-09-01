import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import guideService from '../../services/guideService';
import provinceService from '../../services/provinceService';
import categoryService from '../../services/categoryService';
import { useAlert } from '../../context/AlertContext';

export default function GuidePlaceForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [provinces, setProvinces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    province_id: '',
    address: '',
    latitude: '',
    longitude: '',
    description: '',
    opening_hours: '',
    entrance_fee: '',
    phone: '',
    website: '',
    cover_image_url: '',
  });

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          provinceService.getProvinces().catch(() => ({ data: [] })),
          categoryService.getCategories().catch(() => ({ data: [] })),
        ]);
        setProvinces(pRes?.data || pRes || []);
        setCategories(cRes?.data || cRes || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMetadata();

    if (isEdit) {
      const fetchPlace = async () => {
        try {
          const res = await guideService.getPlace(id);
          const data = res?.data || res;
          if (data) {
            setFormData({
              name: data.name || '',
              category_id: data.category_id || '',
              province_id: data.province_id || '',
              address: data.address || '',
              latitude: data.latitude || '',
              longitude: data.longitude || '',
              description: data.description || '',
              opening_hours: data.opening_hours || '',
              entrance_fee: data.entrance_fee || '',
              phone: data.phone || '',
              website: data.website || '',
              cover_image_url: data.cover_image_url || '',
            });
          }
        } catch (err) {
          showAlert({ title: 'Error', message: err?.message || 'Failed to load place.', type: 'danger' });
          navigate('/guide/places');
        } finally {
          setFetching(false);
        }
      };
      fetchPlace();
    }
  }, [id, isEdit, navigate, showAlert]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category_id || !formData.province_id) {
      showAlert({ title: 'Validation Error', message: 'Name, Category, and Province are required.', type: 'warning' });
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await guideService.updatePlace(id, formData);
        showAlert({ title: 'Success', message: 'Destination updated successfully.', type: 'success' });
      } else {
        await guideService.createPlace(formData);
        showAlert({ title: 'Success', message: 'Destination created successfully.', type: 'success' });
      }
      navigate('/guide/places');
    } catch (err) {
      showAlert({ title: 'Error', message: err?.message || 'Failed to save place.', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#003E83] animate-spin" />
        <p className="text-sm font-medium text-gray-500">Loading form...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between">
          <Link to="/guide/places" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" /> Back to Places
          </Link>
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
            {isEdit ? 'Edit Destination' : 'Add New Destination'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-zinc-800 space-y-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 block mb-1">
                Destination Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Banteay Srei Temple"
                className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 block mb-1">Category <span className="text-rose-500">*</span></label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 block mb-1">Province <span className="text-rose-500">*</span></label>
                <select
                  name="province_id"
                  value={formData.province_id}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select Province</option>
                  {provinces.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 block mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="District, Province, Location info"
                className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 block mb-1">Opening Hours</label>
                <input
                  type="text"
                  name="opening_hours"
                  value={formData.opening_hours}
                  onChange={handleChange}
                  placeholder="e.g. 07:30 AM - 05:30 PM"
                  className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 block mb-1">Entrance Fee</label>
                <input
                  type="text"
                  name="entrance_fee"
                  value={formData.entrance_fee}
                  onChange={handleChange}
                  placeholder="e.g. Included in Angkor Pass / Free"
                  className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 block mb-1">Description</label>
              <textarea
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                placeholder="Historical background, architecture notes, visitor guidelines..."
                className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-end gap-3">
            <Link to="/guide/places" className="px-5 py-2.5 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-bold text-xs rounded-xl">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#003E83] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isEdit ? 'Update Destination' : 'Create Destination'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
