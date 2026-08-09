import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { AdminAuthService } from '../services/admin-auth-service';
import { AdminTokenStorage } from '../storage/admin-token-storage';

export const useAdminLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AdminAuthService.login,
    onSuccess: (data: any) => {
      AdminTokenStorage.setAccessToken(data.accessToken);
      AdminTokenStorage.setRefreshToken(data.refreshToken);
      queryClient.setQueryData(['currentAdmin'], data.admin);
      router.push('/admin/dashboard');
    },
    onError: (error: any) => {
      console.error('Admin login error:', error);
    }
  });
};
