import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '../services/auth-service';
import { TokenStorage } from '../storage/token-storage';
import { useRouter } from 'next/navigation';

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      try {
        await AuthService.logout();
      } catch (err) {
        // Even if server-side logout fails, we still want to clean up client side
        console.error('Server logout failed:', err);
      }
    },
    onSettled: () => {
      TokenStorage.clearAll();
      queryClient.clear(); // Clears all cache
      router.push('/login');
    },
  });
}
