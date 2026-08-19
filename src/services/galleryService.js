import api from './api';

export const galleryService = {
  async getGalleries(params = {}) {
    return await api.get('/galleries', { params });
  },

  async getGalleryById(id) {
    return await api.get(`/galleries/${id}`);
  },
};

export default galleryService;
