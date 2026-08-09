import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '../services/auth-service';
import { TokenStorage } from '../storage/token-storage';
import { toast } from 'sonner';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AuthService.login,
    onSuccess: (data) => {
      // Store tokens
      TokenStorage.setAccessToken(data.accessToken);
      if (data.refreshToken) {
        TokenStorage.setRefreshToken(data.refreshToken);
      }
      
      // Update react query cache with the new user data
      queryClient.setQueryData(['current-user'], data.user);
      toast.success('Successfully logged in!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Invalid email or password');
    },
  });
}
