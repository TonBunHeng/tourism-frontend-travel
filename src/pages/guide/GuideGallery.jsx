import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Loader2, Upload } from 'lucide-react';
import guideService from '../../services/guideService';
import { useAlert } from '../../context/AlertContext';

export default function GuideGallery() {
  const { showAlert, showConfirm } = useAlert();
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchGalleries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await guideService.getGalleries();
      const list = res?.data?.galleries || res?.data || res || [];
      setGalleries(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchGalleries();
  }, [fetchGalleries]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !mediaUrl) return;
    setUploading(true);
    try {
      await guideService.uploadGalleryMedia({ title, media_url: mediaUrl, media_type: 'image' });
      setTitle('');
      setMediaUrl('');
      showAlert({ title: 'Success', message: 'Media uploaded to tourism gallery.', type: 'success' });
      fetchGalleries();
    } catch (err) {
      showAlert({ title: 'Error', message: err?.message || 'Failed to upload media.', type: 'danger' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (await showConfirm({ title: 'Delete Media', message: 'Delete this media item from gallery?', type: 'danger' })) {
      try {
        await guideService.deleteGalleryMedia(id);
        fetchGalleries();
      } catch (err) {
        showAlert({ title: 'Error', message: err?.message || 'Failed to delete.', type: 'danger' });
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-zinc-800">
        <div>
          <Link to="/guide/dashboard" className="text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Guide Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Tourism Media Curation</h1>
        </div>
      </div>

      {/* Upload Card */}
      <form onSubmit={handleUpload} className="bg-white dark:bg-zinc-900 p-5 rounded-lg border border-gray-200 dark:border-zinc-800 space-y-3 shadow-xs transition-colors">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">Upload New Photo</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Title (e.g. Sunrise at Bayon Temple)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2.5 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md text-xs font-medium text-gray-900 dark:text-white focus:outline-none"
            required
          />
          <input
            type="text"
            placeholder="Photo URL (https://...)"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            className="p-2.5 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md text-xs font-medium text-gray-900 dark:text-white focus:outline-none"
            required
          />
        </div>
        <div className="flex justify-end pt-1">
          <button type="submit" disabled={uploading} className="px-4 py-2 bg-[#003E83] hover:bg-[#002e62] dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] dark:text-zinc-950 text-white text-xs font-semibold rounded-md shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
            <Upload className="w-3.5 h-3.5" />
            <span>{uploading ? 'Uploading...' : 'Publish to Gallery'}</span>
          </button>
        </div>
      </form>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#003E83] dark:text-[#60a5fa] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {galleries.map((g) => (
            <div key={g.id} className="relative aspect-square rounded-lg overflow-hidden group bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-800 shadow-xs">
              <img src={g.media_url} alt={g.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                <span className="text-xs font-bold text-white line-clamp-1">{g.title}</span>
                <button
                  onClick={() => handleDelete(g.id)}
                  className="mt-2 text-rose-400 hover:text-rose-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
