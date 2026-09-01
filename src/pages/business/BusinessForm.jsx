import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import businessService from '../../services/businessService';
import provinceService from '../../services/provinceService';
import categoryService from '../../services/categoryService';
import { useAlert } from '../../context/AlertContext';

export default function BusinessForm() {
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
    phone: '',
    email: '',
    website: '',
    price_range: '$$',
    description: '',
    cover_image_url: '',
  });

  useEffect(() => {
    const fetchDropdowns = async () => {
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
    fetchDropdowns();

    if (isEdit) {
      const fetchBusiness = async () => {
        try {
          const res = await businessService.getOwnerBusiness(id);
          const data = res?.data || res;
          if (data) {
            setFormData({
              name: data.name || '',
              category_id: data.category_id || '',
              province_id: data.province_id || '',
              address: data.address || '',
              latitude: data.latitude || '',
              longitude: data.longitude || '',
              phone: data.phone || '',
              email: data.email || '',
              website: data.website || '',
              price_range: data.price_range || '$$',
              description: data.description || '',
              cover_image_url: data.cover_image_url || '',
            });
          }
        } catch (err) {
          showAlert({ title: 'Error', message: err?.message || 'Failed to load business data.', type: 'danger' });
          navigate('/business/dashboard');
        } finally {
          setFetching(false);
        }
      };
      fetchBusiness();
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
        await businessService.updateBusiness(id, formData);
        showAlert({ title: 'Success', message: 'Business updated successfully.', type: 'success' });
        navigate(`/business/businesses/${id}`);
      } else {
        const res = await businessService.createBusiness(formData);
        const newId = res?.data?.id || res?.id;
        showAlert({ title: 'Success', message: 'Business created! It is now pending admin verification.', type: 'success' });
        navigate(newId ? `/business/businesses/${newId}` : '/business/dashboard');
      }
    } catch (err) {
      showAlert({ title: 'Operation Failed', message: err?.message || 'Failed to save business profile.', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#003E83] dark:text-blue-400 animate-spin" />
        <p className="text-sm font-medium text-gray-500">Loading form...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            to={isEdit ? `/business/businesses/${id}` : '/business/dashboard'}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-zinc-400 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
            {isEdit ? 'Edit Business Profile' : 'Register New Business'}
          </h1>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-6">
          
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-zinc-800 pb-2">
              Basic Business Info
            </h3>

            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 block mb-1">
                Business Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Angkor Boutique Hotel & Spa"
                className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-[#003E83]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 block mb-1">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-[#003E83]"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 block mb-1">
                  Province <span className="text-rose-500">*</span>
                </label>
                <select
                  name="province_id"
                  value={formData.province_id}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-[#003E83]"
                  required
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
                <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 block mb-1">
                  Price Tier
                </label>
                <select
                  name="price_range"
                  value={formData.price_range}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-[#003E83]"
                >
                  <option value="$">$ Budget</option>
                  <option value="$$">$$ Moderate</option>
                  <option value="$$$">$$$ Luxury</option>
                  <option value="$$$$">$$$$ Premium</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 block mb-1">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  name="cover_image_url"
                  value={formData.cover_image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/cover.jpg"
                  className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-[#003E83]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 block mb-1">
                Description & Story
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your hospitality services, atmosphere, and amenities..."
                className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-[#003E83]"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-zinc-800 pb-2">
              Contact & Location
            </h3>

            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 block mb-1">
                Full Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address, Village, Sangkat..."
                className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-[#003E83]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 block mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+855 12 345 678"
                  className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@business.com"
                  className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 block mb-1">Website</label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://business.com"
                  className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 block mb-1">Latitude (Optional)</label>
                <input
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="13.3633"
                  className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 block mb-1">Longitude (Optional)</label>
                <input
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="103.8564"
                  className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-end gap-3">
            <Link
              to={isEdit ? `/business/businesses/${id}` : '/business/dashboard'}
              className="px-5 py-2.5 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-bold text-xs rounded-xl"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#003E83] hover:bg-[#002e62] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isEdit ? 'Save Changes' : 'Submit Business'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
