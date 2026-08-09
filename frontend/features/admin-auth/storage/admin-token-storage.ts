const ADMIN_ACCESS_TOKEN_KEY = 'admin_access_token';
const ADMIN_REFRESH_TOKEN_KEY = 'admin_refresh_token';

export const AdminTokenStorage = {
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ADMIN_ACCESS_TOKEN_KEY);
  },

  setAccessToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ADMIN_ACCESS_TOKEN_KEY, token);
  },

  removeAccessToken: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ADMIN_ACCESS_TOKEN_KEY);
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ADMIN_REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ADMIN_REFRESH_TOKEN_KEY, token);
  },

  removeRefreshToken: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ADMIN_REFRESH_TOKEN_KEY);
  },

  clearTokens: (): void => {
    AdminTokenStorage.removeAccessToken();
    AdminTokenStorage.removeRefreshToken();
  },
};
