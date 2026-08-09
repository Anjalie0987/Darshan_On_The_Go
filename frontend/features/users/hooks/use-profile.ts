import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';

export interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  favorites_count: number;
}

export interface UserSession {
  id: string;
  created_at: string;
  last_active_at: string;
  expires_at: string;
  ip_address: string;
  device_info: {
    browser?: string;
    os?: string;
    device?: string;
  } | null;
  is_current: boolean;
}

export function useProfile() {
  return useQuery<UserProfile>({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await apiClient.get('/users/profile');
      const firstUnpack = response.data.data || response.data;
      return firstUnpack.data || firstUnpack;
    },
  });
}

export function useUserSessions() {
  return useQuery<UserSession[]>({
    queryKey: ['user-sessions'],
    queryFn: async () => {
      const response = await apiClient.get('/auth/sessions');
      const firstUnpack = response.data.data || response.data;
      return firstUnpack.data || firstUnpack;
    },
  });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      await apiClient.delete(`/auth/sessions/${sessionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-sessions'] });
    },
  });
}
