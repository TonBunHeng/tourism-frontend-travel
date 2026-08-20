import api from './api';
import { placeService } from './placeService';

const STORAGE_COMMENTS_KEY = 'angkor_gallery_comments';
const STORAGE_LIKES_KEY = 'angkor_gallery_likes';

// Curated high quality photo & video collection with comments and likes
const fallbackGalleries = [
  {
    id: 1,
    title: 'Angkor Wat Sunrise Reflections',
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
        id: 'c1',
        user_name: 'Sarah Jenkins',
        avatar: null,
        comment: 'The 5:30 AM sunrise view was the most spiritual experience of my entire trip to Southeast Asia!',
        created_at: '2026-08-18T08:30:00Z'
      },
      {
        id: 'c2',
        user_name: 'Sopheap Chan',
        avatar: null,
        comment: 'Beautiful lighting composition of the central lotus pond reflection.',
        created_at: '2026-08-19T14:15:00Z'
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
    comments: [
      {
        id: 'c3',
        user_name: 'David Miller',
        avatar: null,
        comment: 'The scale of this ancient city from the air is completely breathtaking!',
        created_at: '2026-08-15T11:20:00Z'
      },
      {
        id: 'c4',
        user_name: 'Nary Lim',
        avatar: null,
        comment: 'Amazing video quality! Truly proud of our Cambodian heritage.',
        created_at: '2026-08-17T09:40:00Z'
      }
    ]
  },
  {
    id: 3,
    title: 'Bayon Temple Smiling Stone Faces',
    description: 'Enigmatic 216 giant smiling stone faces of Avalokiteshvara at Bayon.',
    media_url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80',
    media_type: 'photo',
    category: 'Architecture',
    location: 'Angkor Thom',
    province: 'Siem Reap',
    place_id: 2,
    place_name: 'Bayon Temple',
    author: 'Dara Media',
    views_count: 980,
    likes_count: 245,
    comments_count: 9,
    created_at: '2026-07-20',
    comments: [
      {
        id: 'c5',
        user_name: 'Lucas Dupont',
        avatar: null,
        comment: 'Every single angle reveals a different smiling face. Outstanding architecture.',
        created_at: '2026-08-12T16:00:00Z'
      }
    ]
  },
  {
    id: 4,
    title: 'Cambodian Traditional Water Festival Drone Video',
    description: 'Vibrant racing longboats on the Tonle Sap river in front of the Royal Palace during Bon Om Touk.',
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-traditional-river-boat-moving-through-a-canal-42774-large.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=600&q=80',
    media_type: 'video',
    duration: '0:32',
    category: 'Video Highlights',
    location: 'Sisowath Quay',
    province: 'Phnom Penh',
    place_id: 4,
    place_name: 'Royal Palace Phnom Penh',
    author: 'Travel Asia Video',
    views_count: 3410,
    likes_count: 780,
    comments_count: 36,
    created_at: '2026-08-05',
    comments: [
      {
        id: 'c6',
        user_name: 'Kosal Rith',
        avatar: null,
        comment: 'The energy during the boat races is unbeatable! Must experience in November.',
        created_at: '2026-08-16T19:10:00Z'
      }
    ]
  },
  {
    id: 5,
    title: 'Ta Prohm Tree Roots Embracing Ruins',
    description: 'Massive silk-cotton tree roots intertwined with ancient sandstone corridors.',
    media_url: 'https://images.unsplash.com/photo-1583207804784-198ba4353030?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1583207804784-198ba4353030?auto=format&fit=crop&w=600&q=80',
    media_type: 'photo',
    category: 'Historical Temples',
    location: 'Siem Reap',
    province: 'Siem Reap',
    place_id: 3,
    place_name: 'Ta Prohm Temple',
    author: 'Elena Rostova',
    views_count: 1210,
    likes_count: 310,
    comments_count: 12,
    created_at: '2026-08-01',
    comments: [
      {
        id: 'c7',
        user_name: 'Liam Wilson',
        avatar: null,
        comment: 'Nature taking over history — felt like being in Indiana Jones or Tomb Raider!',
        created_at: '2026-08-14T10:05:00Z'
      }
    ]
  },
  {
    id: 6,
    title: 'Koh Rong Island Ocean Waves Video',
    description: 'Relaxing 4K clear turquoise crystal waves washing over pure white sandy shores.',
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    media_type: 'video',
    duration: '0:28',
    category: 'Video Highlights',
    location: 'Koh Rong Sanloem',
    province: 'Preah Sihanouk',
    place_id: 5,
    place_name: 'Koh Rong Island',
    author: 'Island Life Films',
    views_count: 1950,
    likes_count: 460,
    comments_count: 19,
    created_at: '2026-08-10',
    comments: [
      {
        id: 'c8',
        user_name: 'Chloe Bennett',
        avatar: null,
        comment: 'The clearest sea water I have ever seen. Paradise on earth.',
        created_at: '2026-08-19T13:45:00Z'
      }
    ]
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
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        return res;
      }
    } catch {
      // Fallback
    }

    // Merge with any local user-posted comments
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

  async addComment(mediaId, commentData) {
    const newComment = {
      id: `user-${Date.now()}`,
      user_name: commentData.user_name || 'Traveler',
      avatar: commentData.avatar || null,
      comment: commentData.comment,
      created_at: new Date().toISOString()
    };
    saveStoredComment(mediaId, newComment);
    return { data: newComment };
  }
};

export default galleryService;
