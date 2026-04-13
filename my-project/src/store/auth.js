import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user_session')) || null, // Lấy từ local trước, fetchSession sẽ update lại sau
    isInitialized: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === 'admin',
    isModer: (state) => state.user?.role === 'moder',
  },
  actions: {
    async fetchSession() {
      try {
        const response = await axios.get('/api/auth/me');
        this.user = response.data.user;
        localStorage.setItem('user_session', JSON.stringify(this.user));
      } catch (error) {
        this.user = null;
        localStorage.removeItem('user_session');
      } finally {
        this.isInitialized = true;
      }
    },

    async login(username, password) {
      try {
        const response = await axios.post('/api/auth/login', { username, password });
        this.user = response.data.user;
        localStorage.setItem('user_session', JSON.stringify(this.user));
        return { success: true };
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.error || 'Lỗi hệ thống' 
        };
      }
    },
    
    async register(userData) {
      try {
        await axios.post('/api/auth/register', userData);
        return { success: true };
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.error || 'Lỗi hệ thống' 
        };
      }
    },

    async logout() {
      try {
        await axios.post('/api/auth/logout');
        this.user = null;
        localStorage.removeItem('user_session');
      } catch (e) {
        console.error("Logout error", e);
      }
    }
  }
});
