import { apiClient } from './apiClient.js';
import { tokenStorage } from './tokenStorage.js';

export const authService = {
  /**
   * Login user with username & password
   */
  login: async (username, password) => {
    const response = await apiClient.post('/auth/login', { username, password });
    if (response.success && response.data) {
      const { access_token, user } = response.data;
      tokenStorage.setAccessToken(access_token);
      tokenStorage.setUser(user);
      return { success: true, user, token: access_token };
    }
    throw new Error(response.error || 'Login gagal');
  },

  /**
   * Get current authenticated user profile
   */
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    if (response.success && response.data) {
      tokenStorage.setUser(response.data);
      return response.data;
    }
    throw new Error(response.error || 'Gagal memuat profil pengguna');
  },

  /**
   * Get list of preset accounts for testing
   */
  getPresets: async () => {
    const response = await apiClient.get('/auth/presets');
    return response.data || [];
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      await apiClient.post('/auth/logout', {});
    } catch {
      // Ignore network errors during logout
    } finally {
      tokenStorage.clearTokens();
    }
  },
};
