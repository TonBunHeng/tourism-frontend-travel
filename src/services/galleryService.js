import api from './api';

const STORAGE_COMMENTS_KEY = 'angkor_gallery_comments';

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
      const list = res?.data?.data || res?.data || res;
      if (Array.isArray(list)) {
        return { data: list };
      }
    } catch (err) {
      console.warn('Backend API galleries call failed', err);
    }

    return { data: [] };
  },

  async getGalleryById(id) {
    try {
      const res = await api.get(`/galleries/${id}`);
      const itemData = res?.data?.data || res?.data || res;
      if (itemData) {
        return { data: itemData };
      }
    } catch (err) {
      console.warn(`Backend API getGalleryById(${id}) failed`, err);
    }

    return { data: null };
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
