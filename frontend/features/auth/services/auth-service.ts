import { apiClient } from '@/lib/axios';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export const AuthService = {
  async register(data: any): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/register', data);
    const firstUnpack = (response.data as any).data || response.data;
    return firstUnpack.data || firstUnpack;
  },

  async login(data: any): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', data);
    const firstUnpack = (response.data as any).data || response.data;
    return firstUnpack.data || firstUnpack;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/auth/me');
    const firstUnpack = (response.data as any).data || response.data;
    return firstUnpack.data || firstUnpack;
  },
};
