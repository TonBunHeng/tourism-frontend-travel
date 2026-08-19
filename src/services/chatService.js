import api from './api';

export const chatService = {
  async getChats(params = {}) {
    return await api.get('/chats', { params });
  },

  async getChatById(id) {
    return await api.get(`/chats/${id}`);
  },

  async startChat(data) {
    return await api.post('/chats', data);
  },

  async sendMessage(chatId, data) {
    return await api.post(`/chats/${chatId}/messages`, data);
  },
};

export default chatService;
