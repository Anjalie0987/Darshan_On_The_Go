'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '@/features/auth/validation/auth-schema';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/features/auth/components/password-input';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAdminLogin } from '../hooks/use-admin-login';
import { useEffect } from 'react';
import { AdminTokenStorage } from '../storage/admin-token-storage';
import { useCurrentAdmin } from '../hooks/use-current-admin';

export function AdminLoginForm() {
  const router = useRouter();
  const { data: currentAdmin } = useCurrentAdmin();
  
  const { mutate: login, isPending: isLoading } = useAdminLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (currentAdmin || AdminTokenStorage.getAccessToken()) {
      router.push('/admin/dashboard');
    }
  }, [currentAdmin, router]);

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">
      <div className="flex flex-col gap-2 text-center items-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
          <ShieldCheck className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-2xl font-heading font-semibold tracking-tight">Admin Portal</h1>
        <p className="text-sm text-muted-foreground">
          Enter your admin credentials to access the dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Admin Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@example.com"
            {...register('email')}
            className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            placeholder="Enter your password"
            {...register('password')}
            className={errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full h-11 text-base mt-2" disabled={isLoading}>
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
          Sign In to Admin
        </Button>
      </form>
    </div>
  );
}
