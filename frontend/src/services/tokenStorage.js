const ACCESS_TOKEN_KEY = 'gt_access_token';
const REFRESH_TOKEN_KEY = 'gt_refresh_token';
const USER_PROFILE_KEY = 'gt_user_profile';

export const tokenStorage = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  setAccessToken: (token) => localStorage.setItem(ACCESS_TOKEN_KEY, token),
  
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token) => localStorage.setItem(REFRESH_TOKEN_KEY, token),
  
  getUser: () => {
    try {
      const userStr = localStorage.getItem(USER_PROFILE_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => {
    if (user) {
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_PROFILE_KEY);
    }
  },

  clearTokens: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_PROFILE_KEY);
  },
};
