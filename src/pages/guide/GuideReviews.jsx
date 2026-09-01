import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, Loader2 } from 'lucide-react';
import guideService from '../../services/guideService';
import { useAlert } from '../../context/AlertContext';

export default function GuideReviews() {
  const { showAlert } = useAlert();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await guideService.getReviews();
      const list = res?.data?.reviews || res?.data || res || [];
      setReviews(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReviews();
  }, [fetchReviews]);

  const handleReplySubmit = async (id) => {
    const text = replyText[id];
    if (!text) return;
    try {
      await guideService.replyReview(id, text);
      setReplyText(prev => ({ ...prev, [id]: '' }));
      showAlert({ title: 'Success', message: 'Official guide response posted.', type: 'success' });
      fetchReviews();
    } catch (err) {
      showAlert({ title: 'Error', message: err?.message || 'Failed to post reply.', type: 'danger' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-2">
          <Link to="/guide/dashboard" className="text-xs font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Guide Dashboard
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Community Reviews Feed</h1>
          <p className="text-xs text-gray-500">Provide official guide clarifications or assistance on traveler reviews.</p>
        </div>

        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#003E83] animate-spin" />
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-zinc-800 space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="p-4 bg-gray-50 dark:bg-zinc-800/60 rounded-2xl border border-gray-100 dark:border-zinc-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-gray-900 dark:text-white">{r.user?.name || 'Tourist'}</span>
                  <div className="flex items-center text-amber-400 font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                    <span>{r.rating}.0</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-zinc-300">{r.comment}</p>

                {r.replies && r.replies.map((reply) => (
                  <div key={reply.id} className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-xs space-y-0.5">
                    <span className="font-bold text-amber-800 dark:text-amber-300">Guide Response ({reply.user?.name}):</span>
                    <p className="text-gray-700 dark:text-zinc-300">{reply.reply}</p>
                  </div>
                ))}

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Write official guide assistance note..."
                    value={replyText[r.id] || ''}
                    onChange={(e) => setReplyText({ ...replyText, [r.id]: e.target.value })}
                    className="flex-1 p-2 bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 rounded-xl text-xs"
                  />
                  <button
                    onClick={() => handleReplySubmit(r.id)}
                    className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
