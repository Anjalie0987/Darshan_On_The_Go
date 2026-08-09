import { useQuery } from '@tanstack/react-query';
import { AuthService } from '../services/auth-service';
import { TokenStorage } from '../storage/token-storage';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: AuthService.getCurrentUser,
    // Only fetch if we have an access token or refresh token
    enabled: !!TokenStorage.getAccessToken() || !!TokenStorage.getRefreshToken(),
    retry: false, // Don't retry on 401s since interceptor handles it
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
