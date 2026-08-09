import { useMutation } from '@tanstack/react-query';
import { AuthService } from '../services/auth-service';
import { toast } from 'sonner';

export function useRegister() {
  return useMutation({
    mutationFn: AuthService.register,
    onSuccess: () => {
      toast.success('Account created successfully!', {
        description: 'Welcome to Darshan On The Go.'
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    },
  });
}
