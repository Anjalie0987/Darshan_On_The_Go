import { useQuery } from '@tanstack/react-query';
import { AdminAuthService } from '../services/admin-auth-service';
import { AdminTokenStorage } from '../storage/admin-token-storage';

export const useCurrentAdmin = () => {
  return useQuery({
    queryKey: ['currentAdmin'],
    queryFn: async () => {
      if (!AdminTokenStorage.getAccessToken()) {
        return null;
      }
      try {
        return await AdminAuthService.getCurrentAdmin();
      } catch (error) {
        AdminTokenStorage.clearTokens();
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};
