import api from './api';

export const aiService = {
  chat: async (message, sessionId = null, context = {}) => {
    const response = await api.post('/travel/ai/chat', {
      message,
      session_id: sessionId,
      ...context,
    });
    return response.data;
  },

  getConversations: async (params = {}) => {
    const response = await api.get('/travel/ai/conversations', { params });
    return response.data;
  },

  getMessages: async (sessionId) => {
    const response = await api.get(`/travel/ai/conversations/${sessionId}/messages`);
    return response.data;
  },

  clearConversation: async (sessionId) => {
    const response = await api.delete(`/travel/ai/conversations/${sessionId}`);
    return response.data;
  },

  getWeather: async (province = 'Siem Reap', days = 3) => {
    const response = await api.get('/travel/weather', {
      params: { province, days },
    });
    return response.data;
  },

  getCurrency: async () => {
    const response = await api.get('/travel/currency');
    return response.data;
  },

  convertCurrency: async (amount, from = 'USD', to = 'KHR') => {
    const response = await api.post('/travel/currency/convert', {
      amount,
      from_currency: from,
      to_currency: to,
    });
    return response.data;
  },

  getRecommendations: async (params = {}) => {
    const response = await api.post('/travel/ai/recommendations', params);
    return response.data;
  },

  generateItinerary: async (params = {}) => {
    const response = await api.post('/travel/ai/itineraries', params);
    return response.data;
  },

  getStatus: async () => {
    const response = await api.get('/travel/ai/status');
    return response.data;
  },
};

export default aiService;
