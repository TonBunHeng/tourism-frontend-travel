import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Camera, 
  Heart, 
  Download, 
  Share2, 
  ExternalLink,
  Eye,
  MessageSquare,
  Send,
  Play,
  Film
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTravel } from '../../context/TravelContext';
import { galleryService } from '../../services/galleryService';

const isVideoItem = (item) => {
  if (!item) return false;
  if (item.media_type?.toLowerCase() === 'video' || item.type?.toLowerCase() === 'video') return true;
  const url = item.media_url || item.url || item.thumbnail_url || '';
  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url);
};

export default function MediaLightboxModal({ isOpen, item, items = [], onClose, onNavigate }) {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useTravel();

  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const commentsEndRef = useRef(null);

  useEffect(() => {
    if (item) {
      setComments(item.comments || []);
      setLikesCount(item.likes_count || 45);
      setIsLiked(false);
      setCommentText('');
    }
  }, [item]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNavigate) onNavigate('next');
      if (e.key === 'ArrowLeft' && onNavigate) onNavigate('prev');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNavigate]);

  if (!isOpen || !item) return null;

  const isVideo = isVideoItem(item);
  const mediaUrl = item.media_url || item.url || '';
  const currentIndex = items.findIndex((i) => i.id === item.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;

  const handleLike = () => {
    if (isLiked) {
      setLikesCount((prev) => Math.max(0, prev - 1));
      setIsLiked(false);
    } else {
      setLikesCount((prev) => prev + 1);
      setIsLiked(true);
      showToast('Liked media!', 'success');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const authorName = user?.name || (isAuthenticated ? 'Registered Traveler' : 'Guest Traveler');
    const authorAvatar = user?.avatar || null;

    try {
      setIsSubmitting(true);
      const newComment = {
        id: `c-${Date.now()}`,
        user_name: authorName,
        avatar: authorAvatar,
        comment: commentText.trim(),
        created_at: new Date().toISOString()
      };

      await galleryService.addComment(item.id, newComment);

      setComments((prev) => [newComment, ...prev]);
      setCommentText('');
      showToast('Comment posted!', 'success');
    } catch {
      showToast('Failed to post comment', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = () => {
    if (!mediaUrl) return;
    const link = document.createElement('a');
    link.href = mediaUrl;
    link.target = '_blank';
    link.download = `${(item.title || 'media').replace(/\s+/g, '_')}.${isVideo ? 'mp4' : 'jpg'}`;
    link.click();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.description,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'info');
    }
  };

  const formatCommentDate = (dateStr) => {
    if (!dateStr) return 'Recent';
    try {
      const now = new Date();
      const date = new Date(dateStr);
      const diffSec = Math.floor((now - date) / 1000);
      if (diffSec < 60) return 'Just now';
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHour = Math.floor(diffMin / 60);
      if (diffHour < 24) return `${diffHour}h ago`;
      const diffDays = Math.floor(diffHour / 24);
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
        aria-label="Close modal"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev Navigation Button */}
      {hasPrev && onNavigate && (
        <button
          onClick={() => onNavigate('prev')}
          className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
          aria-label="Previous media"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next Navigation Button */}
      {hasNext && onNavigate && (
        <button
          onClick={() => onNavigate('next')}
          className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
          aria-label="Next media"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Modal Container */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl max-h-[92vh] flex flex-col lg:flex-row bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-2xl transition-colors"
      >
        {/* Left Side: Video Player or High-Res Photo */}
        <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] lg:min-h-[520px] overflow-hidden">
          {isVideo ? (
            <video
              key={mediaUrl}
              src={mediaUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain max-h-[70vh] lg:max-h-[85vh]"
            />
          ) : (
            <img
              src={mediaUrl}
              alt={item.title}
              className="w-full h-full object-contain max-h-[70vh] lg:max-h-[85vh]"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80';
              }}
            />
          )}

          {/* Media Type Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center gap-1.5 shadow-xs">
              {isVideo ? (
                <>
                  <Film className="w-3.5 h-3.5 text-blue-400" />
                  <span>Video Clip {item.duration ? `(${item.duration})` : ''}</span>
                </>
              ) : (
                <>
                  <Camera className="w-3.5 h-3.5 text-blue-400" />
                  <span>{item.category || 'High-Res Photo'}</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Right Side: Media Details & Comments Section */}
        <div className="w-full lg:w-96 p-5 bg-slate-50 dark:bg-zinc-900 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-zinc-800 flex flex-col justify-between space-y-4 max-h-[50vh] lg:max-h-[85vh] overflow-y-auto transition-colors">
          
          <div className="space-y-3.5">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-[#003E83] dark:text-blue-400 flex items-center gap-1 font-semibold">
                  <MapPin className="w-3.5 h-3.5" />
                  {item.location || item.province || item.place || 'Cambodia'}
                </span>
                {item.author && (
                  <span className="text-xs text-gray-500 dark:text-zinc-400">· By {item.author}</span>
                )}
              </div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white leading-snug">
                {item.title}
              </h2>
              {item.description && (
                <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed mt-1">
                  {item.description}
                </p>
              )}
            </div>

            {/* Like & Share Action Bar */}
            <div className="flex items-center justify-between pt-2 pb-3 border-y border-gray-200 dark:border-zinc-800 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                    isLiked
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-gray-200/80 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-200'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{likesCount} Likes</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="p-1.5 rounded-full bg-gray-200/80 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 text-gray-600 dark:text-zinc-300 transition-colors cursor-pointer"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="p-1.5 rounded-full bg-gray-200/80 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 text-gray-600 dark:text-zinc-300 transition-colors cursor-pointer"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              {item.place_id && (
                <Link
                  to={`/places/${item.place_id}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1 font-semibold text-[#003E83] dark:text-blue-400 hover:underline"
                >
                  <span>Destination</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>

            {/* Comments List */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-zinc-200">
                <MessageSquare className="w-4 h-4 text-[#003E83] dark:text-blue-400" />
                <span>Comments ({comments.length})</span>
              </div>

              <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                {comments.length > 0 ? (
                  comments.map((c) => (
                    <div key={c.id} className="p-2.5 rounded-lg bg-white dark:bg-zinc-800/60 border border-gray-200/80 dark:border-zinc-700/50 space-y-1 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-[#003E83] text-white text-[10px] font-bold flex items-center justify-center">
                            {c.user_name?.charAt(0) || 'T'}
                          </div>
                          <span className="text-xs font-bold text-gray-800 dark:text-zinc-200">{c.user_name}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 dark:text-zinc-400">{formatCommentDate(c.created_at)}</span>
                      </div>
                      <p className="text-xs text-gray-700 dark:text-zinc-300 leading-relaxed pl-6.5">
                        {c.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium py-4 text-center bg-gray-100/70 dark:bg-zinc-800/30 rounded-lg border border-gray-200/80 dark:border-zinc-800/60">
                    No comments yet. Be the first to leave a comment!
                  </p>
                )}
                <div ref={commentsEndRef} />
              </div>
            </div>

          </div>

          {/* Comment Input Box */}
          <form onSubmit={handleCommentSubmit} className="pt-2 border-t border-gray-200 dark:border-zinc-800">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder={isAuthenticated ? "Write a comment..." : "Comment as guest traveler..."}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full pl-3 pr-10 py-2 text-xs bg-white dark:bg-zinc-800/90 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#003E83] dark:focus:ring-blue-400 focus:border-[#003E83] dark:focus:border-blue-400"
              />
              <button
                type="submit"
                disabled={!commentText.trim() || isSubmitting}
                className="absolute right-1.5 p-1.5 rounded-md bg-[#003E83] hover:bg-[#002e62] text-white disabled:opacity-40 transition-all cursor-pointer"
                title="Post comment"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
