import axios from 'axios';
import { TokenStorage } from '@/features/auth/storage/token-storage';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX || 'api/v1';

export const apiClient = axios.create({
  baseURL: `${API_URL}/${API_PREFIX}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void, reject: (reason?: any) => void }> = [];

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

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = TokenStorage.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized globally for token expiration
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      const refreshToken = TokenStorage.getRefreshToken();

      if (!refreshToken) {
        isRefreshing = false;
        TokenStorage.clearAll();
        // Do not force redirect here; let the React components (like AuthGuard) handle protected routing.
        return Promise.reject(error);
      }

      return new Promise((resolve, reject) => {
        // Use fresh axios instance to avoid looping the interceptor
        axios.post(`${API_URL}/${API_PREFIX}/auth/refresh`, { refreshToken })
          .then(({ data }) => {
            const newAccessToken = data.accessToken || data.access_token;
            const newRefreshToken = data.refreshToken || data.refresh_token;
            
            TokenStorage.setAccessToken(newAccessToken);
            if (newRefreshToken) {
              TokenStorage.setRefreshToken(newRefreshToken);
            }
            
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            processQueue(null, newAccessToken);
            resolve(apiClient(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            TokenStorage.clearAll();
            // Do not force redirect here; let the React components handle it
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);
