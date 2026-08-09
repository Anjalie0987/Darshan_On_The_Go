import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/features/admin-auth/services/admin-auth-service';

export interface AdminSession {
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

export function useAdminSessions() {
  return useQuery<AdminSession[]>({
    queryKey: ['admin-sessions'],
    queryFn: async () => {
      const response = await adminApi.get('/api/v1/admin/auth/sessions');
      return response.data.data;
    },
  });
}

export function useRevokeAdminSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      await adminApi.delete(`/api/v1/admin/auth/sessions/${sessionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sessions'] });
    },
  });
}
