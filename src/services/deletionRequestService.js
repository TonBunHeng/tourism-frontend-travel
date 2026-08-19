import api from './api';

export const deletionRequestService = {
  async getDeletionRequests(params = {}) {
    return await api.get('/deletion-requests', { params });
  },

  async createDeletionRequest(data) {
    return await api.post('/deletion-requests', data);
  },
};

export default deletionRequestService;
