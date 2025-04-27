import { create } from 'zustand';
import { authApi } from '../api/auth';
import { AuthState } from '../types';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  setAuth: (user: AuthState['user'], token: string) => {
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true });
  },
  
  clearAuth: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  fetchUser: async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const user = await authApi.getCurrentUser();
        set({ user, isAuthenticated: true });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false });
    }
  }
})); 