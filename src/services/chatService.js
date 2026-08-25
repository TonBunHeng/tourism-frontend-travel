import api from './api';

const AI_DIRECT_API = 'https://aichat-backend-pi.vercel.app';

export const chatService = {
  // Send AI Chat Message
  async sendAiMessage(message, sessionId = null, context = {}) {
    try {
      const response = await api.post('/ai/chat', {
        message,
        session_id: sessionId,
        ...context,
      });
      return response;
    } catch (err) {
      // Fallback directly to Angkor Verse AI service if local backend endpoint is unreachable
      try {
        const directRes = await fetch(`${AI_DIRECT_API}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            message,
            session_id: sessionId,
            ...context,
          }),
        });
        const directJson = await directRes.json();
        return directJson;
      } catch {
        throw err;
      }
    }
  },

  // Get AI Status
  async getAiStatus() {
    try {
      return await api.get('/ai/status');
    } catch {
      try {
        const res = await fetch(`${AI_DIRECT_API}/api/ai/status`);
        return await res.json();
      } catch {
        return { success: true, data: { status: 'ready' } };
      }
    }
  },

  // Support / User chats
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
