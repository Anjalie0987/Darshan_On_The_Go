import axios from 'axios';
import { AdminTokenStorage } from '../storage/admin-token-storage';

// We use a dedicated axios instance for admin to not clash with user interceptors
export const adminApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
});

// Request Interceptor
adminApi.interceptors.request.use((config) => {
  const token = AdminTokenStorage.getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor for refresh
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes('/admin/auth/login') || originalRequest.url?.includes('/admin/auth/refresh')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = 'Bearer ' + token;
          return adminApi(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = AdminTokenStorage.getRefreshToken();
      if (!refreshToken) {
        AdminTokenStorage.clearTokens();
        window.location.href = '/admin/login';
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${adminApi.defaults.baseURL}/api/v1/admin/auth/refresh`, {
          refreshToken,
        });

        const newAccessToken = data.data.accessToken;
        const newRefreshToken = data.data.refreshToken;

        AdminTokenStorage.setAccessToken(newAccessToken);
        AdminTokenStorage.setRefreshToken(newRefreshToken);

        adminApi.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return adminApi(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        AdminTokenStorage.clearTokens();
        window.location.href = '/admin/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const AdminAuthService = {
  login: async (credentials: any) => {
    const { data } = await adminApi.post('/api/v1/admin/auth/login', credentials);
    return data.data;
  },
  
  logout: async (refreshToken: string) => {
    const { data } = await adminApi.post('/api/v1/admin/auth/logout', { refreshToken });
    return data.data;
  },

  getCurrentAdmin: async () => {
    const { data } = await adminApi.get('/api/v1/admin/auth/me');
    return data.data;
  }
};
