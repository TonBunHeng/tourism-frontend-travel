import api from './api';

const STORAGE_COMMENTS_KEY = 'angkor_gallery_comments';

const fallbackGalleries = [
  {
    id: 1,
    title: 'Sunset over Angkor Wat Reflection Pond',
    description: 'Golden morning light reflecting over the lotus ponds of Angkor Wat temple.',
    media_url: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=600&q=80',
    media_type: 'photo',
    category: 'Historical Temples',
    location: 'Siem Reap',
    province: 'Siem Reap',
    place_id: 1,
    place_name: 'Angkor Wat',
    author: 'Sovann Angkor',
    views_count: 1420,
    likes_count: 328,
    comments_count: 14,
    created_at: '2026-07-15',
    comments: [
      {
        id: 1,
        user_name: 'Sarah Jenkins',
        avatar: null,
        comment: 'The 5:30 AM sunrise view was the most spiritual experience of my entire trip to Southeast Asia!',
        created_at: '2026-08-18T08:30:00Z'
      }
    ]
  },
  {
    id: 2,
    title: 'Angkor Wat Aerial Drone Cinematic Tour',
    description: '4K scenic drone footage gliding above the majestic towers, moat, and forest canopy of Angkor Wat.',
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-landscape-with-mountains-and-a-temple-41484-large.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80',
    media_type: 'video',
    duration: '0:45',
    category: 'Video Highlights',
    location: 'Angkor Archaeological Park',
    province: 'Siem Reap',
    place_id: 1,
    place_name: 'Angkor Wat',
    author: 'Khmer Aerial Arts',
    views_count: 2890,
    likes_count: 612,
    comments_count: 28,
    created_at: '2026-07-22',
    comments: []
  }
];

function getStoredComments(mediaId) {
  try {
    const raw = localStorage.getItem(`${STORAGE_COMMENTS_KEY}_${mediaId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredComment(mediaId, newComment) {
  try {
    const existing = getStoredComments(mediaId);
    const updated = [newComment, ...existing];
    localStorage.setItem(`${STORAGE_COMMENTS_KEY}_${mediaId}`, JSON.stringify(updated));
    return updated;
  } catch {
    return [newComment];
  }
}

export const galleryService = {
  async getGalleries(params = {}) {
    try {
      const res = await api.get('/galleries', { params });
      const list = res?.data?.data || res?.data;
      if (Array.isArray(list) && list.length > 0) {
        return { data: list };
      }
    } catch (err) {
      console.warn('Backend API galleries call failed, using fallback galleries', err);
    }

    const merged = fallbackGalleries.map((item) => {
      const localComments = getStoredComments(item.id);
      const allComments = [...localComments, ...(item.comments || [])];
      return {
        ...item,
        comments: allComments,
        comments_count: (item.comments_count || 0) + localComments.length
      };
    });

    return { data: merged };
  },

  async getGalleryById(id) {
    try {
      const res = await api.get(`/galleries/${id}`);
      const itemData = res?.data?.data || res?.data;
      if (itemData) {
        return { data: itemData };
      }
    } catch (err) {
      console.warn(`Backend API getGalleryById(${id}) failed, using fallback`, err);
    }

    const item = fallbackGalleries.find((g) => String(g.id) === String(id)) || fallbackGalleries[0];
    const localComments = getStoredComments(item.id);
    return {
      data: {
        ...item,
        comments: [...localComments, ...(item.comments || [])],
        comments_count: (item.comments_count || 0) + localComments.length
      }
    };
  },

  async getComments(mediaId) {
    try {
      const res = await api.get(`/galleries/${mediaId}/comments`);
      const list = res?.data?.data || res?.data;
      if (Array.isArray(list)) {
        return list;
      }
    } catch (err) {
      console.warn(`Backend API getComments(${mediaId}) failed`, err);
    }
    return getStoredComments(mediaId);
  },

  async addComment(mediaId, commentData) {
    const payload = typeof commentData === 'string' 
      ? { comment: commentData }
      : {
          comment: commentData.comment || commentData.text || '',
          parent_id: commentData.parent_id || null,
        };

    try {
      const res = await api.post(`/galleries/${mediaId}/comments`, payload);
      const created = res?.data?.data || res?.data;
      if (created) {
        return created;
      }
    } catch (err) {
      console.warn('Backend API addComment failed, saving locally', err);
    }

    const newComment = {
      id: `user-${Date.now()}`,
      user_name: commentData.user_name || 'Traveler',
      avatar: commentData.avatar || null,
      comment: payload.comment,
      created_at: new Date().toISOString()
    };
    saveStoredComment(mediaId, newComment);
    return newComment;
  },

  async toggleLike(mediaId) {
    try {
      const res = await api.post(`/galleries/${mediaId}/like`);
      const data = res?.data?.data || res?.data;
      if (data) {
        return data;
      }
    } catch (err) {
      console.warn(`Backend API toggleLike(${mediaId}) failed`, err);
    }
    return null;
  },

  async recordView(mediaId) {
    try {
      const res = await api.post(`/galleries/${mediaId}/view`);
      const data = res?.data?.data || res?.data;
      if (data) {
        return data.views_count ?? data.view_count ?? data.views ?? null;
      }
    } catch (err) {
      console.warn(`Backend API recordView(${mediaId}) failed`, err);
    }
    return null;
  },

  subscribeToStream(mediaId, onUpdate) {
    try {
      const eventSource = new EventSource(`http://localhost:8000/api/travel/galleries/${mediaId}/stream`);
      eventSource.addEventListener('gallery_update', (e) => {
        try {
          const data = JSON.parse(e.data);
          if (onUpdate) onUpdate(data);
        } catch (err) {
          console.error('Failed to parse SSE data', err);
        }
      });
      return eventSource;
    } catch (err) {
      console.warn('EventSource SSE subscription failed', err);
      return null;
    }
  }
};

export default galleryService;
