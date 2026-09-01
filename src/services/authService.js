import api from './api';

export const authService = {
  async login(credentials) {
    const res = await api.post('/auth/login', credentials);
    if (res.success && res.data?.token) {
      localStorage.setItem('auth_token', res.data.token);
      localStorage.setItem('token', res.data.token);
      const userObj = res.data.user || res.data;
      localStorage.setItem('user', JSON.stringify(userObj));
      window.dispatchEvent(new Event('user-profile-updated'));
    }
    return res;
  },

  async register(data) {
    const res = await api.post('/auth/register', data);
    if (res.success && res.data?.token) {
      localStorage.setItem('auth_token', res.data.token);
      localStorage.setItem('token', res.data.token);
      const userObj = res.data.user || res.data;
      localStorage.setItem('user', JSON.stringify(userObj));
      window.dispatchEvent(new Event('user-profile-updated'));
    }
    return res;
  },

  async googleLogin(data) {
    const res = await api.post('/auth/google', data);
    if (res.success && res.data?.token) {
      localStorage.setItem('auth_token', res.data.token);
      localStorage.setItem('token', res.data.token);
      const userObj = res.data.user || res.data;
      localStorage.setItem('user', JSON.stringify(userObj));
      window.dispatchEvent(new Event('user-profile-updated'));
    }
    return res;
  },

  async facebookLogin(data) {
    const res = await api.post('/auth/facebook', data);
    if (res.success && res.data?.token) {
      localStorage.setItem('auth_token', res.data.token);
      localStorage.setItem('token', res.data.token);
      const userObj = res.data.user || res.data;
      localStorage.setItem('user', JSON.stringify(userObj));
      window.dispatchEvent(new Event('user-profile-updated'));
    }
    return res;
  },

  async me() {
    const res = await api.get('/auth/me');
    if (res.success && res.data) {
      const userObj = res.data.user || res.data;
      localStorage.setItem('user', JSON.stringify(userObj));
      window.dispatchEvent(new Event('user-profile-updated'));
    }
    return res;
  },

  async updateProfile(data) {
    const res = await api.put('/auth/profile', data);
    if (res.success && res.data) {
      const userObj = res.data.user || res.data;
      localStorage.setItem('user', JSON.stringify(userObj));
      window.dispatchEvent(new Event('user-profile-updated'));
    }
    return res;
  },

  async updatePassword(data) {
    return await api.put('/auth/password', data);
  },

  async uploadAvatar(formData) {
    const res = await api.post('/auth/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (res.success && res.data) {
      const userObj = res.data.user || res.data;
      localStorage.setItem('user', JSON.stringify(userObj));
      window.dispatchEvent(new Event('user-profile-updated'));
    }
    return res;
  },

  async deleteAvatar() {
    const res = await api.delete('/auth/avatar');
    if (res.success && res.data) {
      const userObj = res.data.user || res.data;
      localStorage.setItem('user', JSON.stringify(userObj));
      window.dispatchEvent(new Event('user-profile-updated'));
    }
    return res;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('user-profile-updated'));
    }
  },
};

export default authService;
