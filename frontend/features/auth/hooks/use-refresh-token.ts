import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { TokenStorage } from '../storage/token-storage';

// Manual refresh token hook (useful if you need to trigger it manually outside interceptor)
export function useRefreshToken() {
  const queryClient = useQueryClient();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX || 'api/v1';

  return useMutation({
    mutationFn: async () => {
      const refreshToken = TokenStorage.getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token');
      
      const { data } = await axios.post(`${API_URL}/${API_PREFIX}/auth/refresh`, { refreshToken });
      return data;
    },
    onSuccess: (data) => {
      const newAccessToken = data.accessToken || data.access_token;
      const newRefreshToken = data.refreshToken || data.refresh_token;
      
      if (newAccessToken) TokenStorage.setAccessToken(newAccessToken);
      if (newRefreshToken) TokenStorage.setRefreshToken(newRefreshToken);
      
      // Invalidate current user to force a re-fetch if needed
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
    },
    onError: () => {
      TokenStorage.clearAll();
      if (typeof window !== 'undefined') window.location.href = '/login';
    }
  });
}
