import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Edit3, 
  CheckCircle, 
  ArrowLeft, 
  Loader2, 
  Save, 
  Star,
  ExternalLink
} from 'lucide-react';
import businessService from '../../services/businessService';
import { useAlert } from '../../context/AlertContext';

export default function BusinessManage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert, showConfirm } = useAlert();

  const [business, setBusiness] = useState(null);
  const [services, setServices] = useState([]);
  const [hours, setHours] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [events, setEvents] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('overview');

  // Form states for modals/tabs
  const [newService, setNewService] = useState({ name: '', description: '', price: '', duration_minutes: '' });
  const [newPromo, setNewPromo] = useState({ title: '', description: '', discount_percentage: '', start_date: '', end_date: '' });
  const [newEvent, setNewEvent] = useState({ title: '', description: '', location: '', start_date: '' });
  const [replyText, setReplyText] = useState({});
  const [imageInput, setImageInput] = useState('');

  const fetchBusinessData = useCallback(async () => {
    setLoading(true);
    try {
      const [bizRes, srvRes, hrsRes, galRes, prmRes, evtRes, rvwRes] = await Promise.all([
        businessService.getOwnerBusiness(id),
        businessService.getServices(id).catch(() => ({ data: [] })),
        businessService.getHours(id).catch(() => ({ data: [] })),
        businessService.getImages(id).catch(() => ({ data: [] })),
        businessService.getPromotions(id).catch(() => ({ data: [] })),
        businessService.getEvents(id).catch(() => ({ data: [] })),
        businessService.getReviews(id).catch(() => ({ data: [] })),
      ]);

      const bizObj = bizRes?.data || bizRes;
      setBusiness(bizObj);
      setServices(srvRes?.data || srvRes || []);

      const existingHours = hrsRes?.data || hrsRes || [];
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      const formattedHours = days.map(d => {
        const found = existingHours.find(h => (h.day_of_week || '').toLowerCase() === d);
        return found ? { ...found, day_of_week: d } : { day_of_week: d, open_time: '08:00', close_time: '20:00', is_closed: false };
      });
      setHours(formattedHours);

      setGallery(galRes?.data || galRes || []);
      setPromotions(prmRes?.data || prmRes || []);
      setEvents(evtRes?.data || evtRes || []);

      const rList = rvwRes?.data?.reviews || rvwRes?.data || rvwRes || [];
      setReviews(Array.isArray(rList) ? rList : []);
    } catch (err) {
      showAlert({ title: 'Error', message: err?.message || 'Access denied or business not found.', type: 'danger' });
      navigate('/business/dashboard');
    } finally {
      setLoading(false);
    }
  }, [id, navigate, showAlert]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (id) fetchBusinessData();
  }, [id, fetchBusinessData]);

  // SERVICE CRUD
  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newService.name) return;
    try {
      await businessService.createService(id, newService);
      setNewService({ name: '', description: '', price: '', duration_minutes: '' });
      showAlert({ title: 'Success', message: 'Service added successfully.', type: 'success' });
      fetchBusinessData();
    } catch (err) {
      showAlert({ title: 'Error', message: err?.message || 'Failed to add service.', type: 'danger' });
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (await showConfirm({ title: 'Delete Service', message: 'Are you sure you want to remove this service?', type: 'danger' })) {
      try {
        await businessService.deleteService(id, serviceId);
        fetchBusinessData();
      } catch (err) {
        showAlert({ title: 'Error', message: err?.message || 'Failed to delete service.', type: 'danger' });
      }
    }
  };

  // HOURS BATCH SAVE
  const handleSaveHours = async () => {
    try {
      await businessService.updateHours(id, hours);
      showAlert({ title: 'Success', message: 'Opening hours updated successfully.', type: 'success' });
    } catch (err) {
      showAlert({ title: 'Error', message: err?.message || 'Failed to update hours.', type: 'danger' });
    }
  };

  // GALLERY CRUD
  const handleAddImage = async (e) => {
    e.preventDefault();
    if (!imageInput) return;
    try {
      await businessService.uploadImage(id, { image_url: imageInput });
      setImageInput('');
      fetchBusinessData();
    } catch (err) {
      showAlert({ title: 'Error', message: err?.message || 'Failed to upload image.', type: 'danger' });
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (await showConfirm({ title: 'Delete Image', message: 'Remove this photo from gallery?', type: 'danger' })) {
      try {
        await businessService.deleteImage(id, imageId);
        fetchBusinessData();
      } catch (err) {
        showAlert({ title: 'Error', message: err?.message || 'Failed to delete image.', type: 'danger' });
      }
    }
  };

  // PROMOTION CRUD
  const handleAddPromotion = async (e) => {
    e.preventDefault();
    if (!newPromo.title) return;
    try {
      await businessService.createPromotion(id, newPromo);
      setNewPromo({ title: '', description: '', discount_percentage: '', start_date: '', end_date: '' });
      showAlert({ title: 'Success', message: 'Promotion added successfully.', type: 'success' });
      fetchBusinessData();
    } catch (err) {
      showAlert({ title: 'Error', message: err?.message || 'Failed to add promotion.', type: 'danger' });
    }
  };

  const handleDeletePromotion = async (promoId) => {
    if (await showConfirm({ title: 'Delete Promotion', message: 'Remove this promotion?', type: 'danger' })) {
      try {
        await businessService.deletePromotion(id, promoId);
        fetchBusinessData();
      } catch (err) {
        showAlert({ title: 'Error', message: err?.message || 'Failed to delete promotion.', type: 'danger' });
      }
    }
  };

  // EVENT CRUD
  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title) return;
    try {
      await businessService.createEvent(id, newEvent);
      setNewEvent({ title: '', description: '', location: '', start_date: '' });
      showAlert({ title: 'Success', message: 'Event added successfully.', type: 'success' });
      fetchBusinessData();
    } catch (err) {
      showAlert({ title: 'Error', message: err?.message || 'Failed to create event.', type: 'danger' });
    }
  };

  // REVIEWS REPLY
  const handleReplySubmit = async (reviewId) => {
    const text = replyText[reviewId];
    if (!text) return;
    try {
      await businessService.replyReview(id, reviewId, text);
      setReplyText(prev => ({ ...prev, [reviewId]: '' }));
      showAlert({ title: 'Success', message: 'Reply posted to review.', type: 'success' });
      fetchBusinessData();
    } catch (err) {
      showAlert({ title: 'Error', message: err?.message || 'Failed to reply.', type: 'danger' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#003E83] dark:text-[#60a5fa] animate-spin" />
        <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">Loading business manager...</p>
      </div>
    );
  }

  if (!business) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-xs transition-colors">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link to="/business/dashboard" className="text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
            </Link>
            <span className="text-gray-300 dark:text-zinc-700">/</span>
            <span className="text-xs font-bold text-[#003E83] dark:text-[#60a5fa] capitalize">{business.verification_status}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{business.name}</h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/businesses/${business.id}`}
            target="_blank"
            className="px-3.5 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Public View
          </Link>
          <Link
            to={`/business/businesses/${business.id}/edit`}
            className="px-3.5 py-2 bg-[#003E83] hover:bg-[#002e62] dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] dark:text-zinc-950 text-white text-xs font-semibold rounded-md shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit Basic Profile
          </Link>
        </div>
      </div>

      {/* Status Tracker Banner */}
      <div className="p-4 rounded-lg bg-blue-50 dark:bg-zinc-900 border border-blue-200 dark:border-zinc-800 flex items-center justify-between gap-4 text-xs transition-colors">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-4 h-4 text-[#003E83] dark:text-[#60a5fa] shrink-0" />
          <div>
            <span className="font-semibold text-gray-900 dark:text-white">Verification Lifecycle Status: </span>
            <span className="font-bold text-[#003E83] dark:text-[#60a5fa] uppercase">{business.verification_status}</span>
          </div>
        </div>
        {business.verification_status === 'rejected' && business.rejection_reason && (
          <p className="text-rose-600 font-bold">Reason: {business.rejection_reason}</p>
        )}
      </div>

      {/* Tab Selection */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-zinc-800 overflow-x-auto pb-1">
        {[
          { id: 'overview', label: 'Profile' },
          { id: 'services', label: `Services (${services.length})` },
          { id: 'hours', label: 'Opening Hours' },
          { id: 'gallery', label: `Gallery (${gallery.length})` },
          { id: 'promotions', label: `Promotions (${promotions.length})` },
          { id: 'events', label: `Events (${events.length})` },
          { id: 'reviews', label: `Reviews (${reviews.length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 text-xs font-semibold whitespace-nowrap rounded-t-md transition-all border-b-2 cursor-pointer ${
              activeTab === t.id
                ? 'border-[#003E83] dark:border-[#60a5fa] text-[#003E83] dark:text-[#60a5fa] bg-blue-50/50 dark:bg-zinc-800/50'
                : 'border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENTS */}
      <div>
        {/* OVERVIEW / PROFILE */}
        {activeTab === 'overview' && (
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-gray-200 dark:border-zinc-800 space-y-4 transition-colors">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Business Summary</h3>
            <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
              {business.description || 'No description provided.'}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800 text-xs">
              <div>
                <span className="text-gray-400 block font-medium">Category</span>
                <span className="font-bold text-gray-900 dark:text-white">{business.category?.name || '-'}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Province</span>
                <span className="font-bold text-gray-900 dark:text-white">{business.province?.name || '-'}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Phone</span>
                <span className="font-bold text-gray-900 dark:text-white">{business.phone || '-'}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Price Range</span>
                <span className="font-bold text-gray-900 dark:text-white">{business.price_range || '$$'}</span>
              </div>
            </div>
          </div>
        )}

        {/* SERVICES TAB */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <form onSubmit={handleAddService} className="bg-white dark:bg-zinc-900 p-5 rounded-lg border border-gray-200 dark:border-zinc-800 space-y-3 transition-colors">
              <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Add Service Item</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Service Name (e.g. Deluxe Room)"
                  value={newService.name}
                  onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                  className="px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md text-xs text-gray-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none"
                  required
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price ($)"
                  value={newService.price}
                  onChange={(e) => setNewService(prev => ({ ...prev, price: e.target.value }))}
                  className="px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md text-xs text-gray-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Duration (minutes)"
                  value={newService.duration_minutes}
                  onChange={(e) => setNewService(prev => ({ ...prev, duration_minutes: e.target.value }))}
                  className="px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md text-xs text-gray-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none"
                />
              </div>
              <input
                type="text"
                placeholder="Short description of this service or item..."
                value={newService.description}
                onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md text-xs text-gray-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none"
              />
              <button type="submit" className="px-3.5 py-2 bg-[#003E83] hover:bg-[#002e62] dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] dark:text-zinc-950 text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer">
                Add Service
              </button>
            </form>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-gray-200 dark:border-zinc-800 space-y-3 transition-colors">
              <h4 className="text-base font-bold text-gray-900 dark:text-white">Configured Services ({services.length})</h4>
              {services.map((s) => (
                <div key={s.id} className="p-3.5 bg-gray-50 dark:bg-zinc-800/60 rounded-md border border-gray-200 dark:border-zinc-700/60 flex items-center justify-between gap-3">
                  <div>
                    <h5 className="font-bold text-xs text-gray-900 dark:text-white">{s.name}</h5>
                    {s.description && <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">{s.description}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    {s.price && <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400">${s.price}</span>}
                    <button onClick={() => handleDeleteService(s.id)} className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HOURS TAB */}
        {activeTab === 'hours' && (
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-gray-200 dark:border-zinc-800 space-y-4 transition-colors">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
              <h4 className="text-base font-bold text-gray-900 dark:text-white">Weekly Schedule Editor</h4>
              <button onClick={handleSaveHours} className="px-3.5 py-2 bg-[#003E83] hover:bg-[#002e62] dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] dark:text-zinc-950 text-white text-xs font-semibold rounded-md shadow-xs flex items-center gap-1.5 cursor-pointer">
                <Save className="w-3.5 h-3.5" /> Save Hours
              </button>
            </div>

            <div className="space-y-2.5">
              {hours.map((h, idx) => (
                <div key={h.day_of_week} className="p-3 bg-gray-50 dark:bg-zinc-800/60 rounded-md border border-gray-200 dark:border-zinc-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <span className="capitalize font-bold text-xs text-gray-900 dark:text-white w-24">{h.day_of_week}</span>
                  
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer text-gray-700 dark:text-zinc-300">
                      <input
                        type="checkbox"
                        checked={h.is_closed}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setHours(prev => prev.map((item, i) => i === idx ? { ...item, is_closed: val } : item));
                        }}
                        className="rounded border-gray-300 dark:border-zinc-700 text-[#003E83] focus:ring-[#003E83]"
                      />
                      <span>Closed</span>
                    </label>

                    {!h.is_closed && (
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={h.open_time || '08:00'}
                          onChange={(e) => {
                            const val = e.target.value;
                            setHours(prev => prev.map((item, i) => i === idx ? { ...item, open_time: val } : item));
                          }}
                          className="px-2 py-1 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md text-xs font-semibold text-gray-900 dark:text-white"
                        />
                        <span className="text-xs text-gray-400">to</span>
                        <input
                          type="time"
                          value={h.close_time || '20:00'}
                          onChange={(e) => {
                            const val = e.target.value;
                            setHours(prev => prev.map((item, i) => i === idx ? { ...item, close_time: val } : item));
                          }}
                          className="px-2 py-1 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md text-xs font-semibold text-gray-900 dark:text-white"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GALLERY TAB */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <form onSubmit={handleAddImage} className="bg-white dark:bg-zinc-900 p-5 rounded-lg border border-gray-200 dark:border-zinc-800 space-y-3 transition-colors">
              <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Add Photo to Gallery</h4>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Image URL (https://...)"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md text-xs text-gray-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none"
                />
                <button type="submit" className="px-3.5 py-2 bg-[#003E83] hover:bg-[#002e62] dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] dark:text-zinc-950 text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer">
                  Upload
                </button>
              </div>
            </form>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-gray-200 dark:border-zinc-800 space-y-3 transition-colors">
              <h4 className="text-base font-bold text-gray-900 dark:text-white">Gallery Photos ({gallery.length})</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {gallery.map((g) => (
                  <div key={g.id} className="relative aspect-square rounded-md overflow-hidden group bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
                    <img src={g.image_url} alt="Gallery item" className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleDeleteImage(g.id)}
                      className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PROMOTIONS TAB */}
        {activeTab === 'promotions' && (
          <div className="space-y-6">
            <form onSubmit={handleAddPromotion} className="bg-white dark:bg-zinc-900 p-5 rounded-lg border border-gray-200 dark:border-zinc-800 space-y-3 transition-colors">
              <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Create Promotion</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Title (e.g. 20% Khmer New Year Discount)"
                  value={newPromo.title}
                  onChange={(e) => setNewPromo(prev => ({ ...prev, title: e.target.value }))}
                  className="px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md text-xs text-gray-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none"
                  required
                />
                <input
                  type="number"
                  placeholder="Discount % (e.g. 20)"
                  value={newPromo.discount_percentage}
                  onChange={(e) => setNewPromo(prev => ({ ...prev, discount_percentage: e.target.value }))}
                  className="px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md text-xs text-gray-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none"
                />
              </div>
              <input
                type="text"
                placeholder="Terms & details..."
                value={newPromo.description}
                onChange={(e) => setNewPromo(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md text-xs text-gray-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none"
              />
              <button type="submit" className="px-3.5 py-2 bg-[#003E83] hover:bg-[#002e62] dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] dark:text-zinc-950 text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer">
                Save Promotion
              </button>
            </form>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-gray-200 dark:border-zinc-800 space-y-3 transition-colors">
              <h4 className="text-base font-bold text-gray-900 dark:text-white">Active Promotions ({promotions.length})</h4>
              {promotions.map((p) => (
                <div key={p.id} className="p-4 bg-gray-50 dark:bg-zinc-800/60 rounded-md border border-amber-200 dark:border-amber-900/60 flex items-center justify-between gap-3">
                  <div>
                    <h5 className="font-bold text-xs text-gray-900 dark:text-white">{p.title}</h5>
                    {p.description && <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">{p.description}</p>}
                  </div>
                  <button onClick={() => handleDeletePromotion(p.id)} className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EVENTS TAB */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <form onSubmit={handleAddEvent} className="bg-white dark:bg-zinc-900 p-5 rounded-lg border border-gray-200 dark:border-zinc-800 space-y-3 transition-colors">
              <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Create Event</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Event Title (e.g. Weekend BBQ Night)"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  className="px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md text-xs text-gray-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none"
                  required
                />
                <input
                  type="date"
                  value={newEvent.start_date}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, start_date: e.target.value }))}
                  className="px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md text-xs text-gray-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none"
                />
              </div>
              <input
                type="text"
                placeholder="Event description..."
                value={newEvent.description}
                onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md text-xs text-gray-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:border-[#003E83] dark:focus:border-[#60a5fa] focus:ring-1 focus:ring-[#003E83] focus:outline-none"
              />
              <button type="submit" className="px-3.5 py-2 bg-[#003E83] hover:bg-[#002e62] dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] dark:text-zinc-950 text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer">
                Schedule Event
              </button>
            </form>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-gray-200 dark:border-zinc-800 space-y-3 transition-colors">
              <h4 className="text-base font-bold text-gray-900 dark:text-white">Business Events ({events.length})</h4>
              {events.map((e) => (
                <div key={e.id} className="p-4 bg-gray-50 dark:bg-zinc-800/60 rounded-md border border-gray-200 dark:border-zinc-700/60 space-y-1">
                  <h5 className="font-bold text-xs text-gray-900 dark:text-white">{e.title}</h5>
                  {e.description && <p className="text-[11px] text-gray-500 dark:text-zinc-400">{e.description}</p>}
                  <span className="text-[10px] text-gray-400 font-medium block">{e.start_date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REVIEWS & REPLIES TAB */}
        {activeTab === 'reviews' && (
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-gray-200 dark:border-zinc-800 space-y-4 transition-colors">
            <h4 className="text-base font-bold text-gray-900 dark:text-white">Customer Feedback & Replies ({reviews.length})</h4>
            {reviews.length === 0 ? (
              <p className="text-xs text-gray-500 py-4">No reviews submitted yet.</p>
            ) : (
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div key={r.id} className="p-4 rounded-md bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-gray-900 dark:text-white">{r.user?.name || 'Tourist'}</span>
                      <div className="flex items-center gap-1 bg-white dark:bg-zinc-800 px-2 py-0.5 rounded border border-gray-200 dark:border-zinc-700 text-xs font-bold text-amber-500">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{r.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-zinc-300">{r.comment}</p>

                    {/* Existing Replies */}
                    {r.replies && r.replies.map((reply) => (
                      <div key={reply.id} className="p-2.5 bg-white dark:bg-zinc-800 border-l-2 border-[#003E83] dark:border-[#60a5fa] rounded-r-md text-xs space-y-1">
                        <span className="font-bold text-[#003E83] dark:text-[#60a5fa]">Your Reply:</span>
                        <p className="text-gray-700 dark:text-zinc-300">{reply.reply}</p>
                      </div>
                    ))}

                    {/* Reply Form */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Type an official owner response..."
                        value={replyText[r.id] || ''}
                        onChange={(e) => setReplyText({ ...replyText, [r.id]: e.target.value })}
                        className="flex-1 px-3 py-1.5 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#003E83]"
                      />
                      <button
                        onClick={() => handleReplySubmit(r.id)}
                        className="px-3.5 py-1.5 bg-[#003E83] hover:bg-[#002e62] dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] dark:text-zinc-950 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
