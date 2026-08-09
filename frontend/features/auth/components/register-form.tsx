'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormValues } from '../validation/auth-schema';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { PasswordInput } from './password-input';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRegister } from '../hooks/use-register';
import { useAuth } from '@/contexts/auth-context';
import { useEffect } from 'react';

export function RegisterForm() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const { mutate: registerUser, isPending: isLoading } = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/profile');
    }
  }, [isAuthenticated, router]);

  const password = watch('password', '');
  
  // Calculate password strength
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[a-z]/.test(pass)) score += 25;
    if (/[0-9!@#$%^&*]/.test(pass)) score += 25;
    return score;
  };

  const strength = calculateStrength(password);
  
  const getStrengthColor = (score: number) => {
    if (score === 0) return 'bg-muted';
    if (score <= 25) return 'bg-destructive';
    if (score <= 50) return 'bg-orange-500';
    if (score <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return '';
    if (score <= 25) return 'Weak';
    if (score <= 50) return 'Fair';
    if (score <= 75) return 'Good';
    return 'Strong';
  };

  const onSubmit = (data: RegisterFormValues) => {
    const [firstName, ...lastNameParts] = data.fullName.split(' ');
    const lastName = lastNameParts.join(' ');
    
    const payload = {
      email: data.email,
      password: data.password,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
    };

    registerUser(payload as any, {
      onSuccess: () => {
        router.push('/login');
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-heading font-semibold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Join us to experience divine darshans live
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            {...register('fullName')}
            className={errors.fullName ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            {...register('email')}
            className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            placeholder="Create a password"
            {...register('password')}
            className={errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          
          {/* Password Strength Indicator */}
          {password.length > 0 && (
            <div className="flex flex-col gap-1.5 mt-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Password strength</span>
                <span className={`font-medium ${getStrengthColor(strength).replace('bg-', 'text-')}`}>
                  {getStrengthText(strength)}
                </span>
              </div>
              <Progress value={strength} className={`h-1.5 ${getStrengthColor(strength)}`} />
            </div>
          )}
          
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Confirm your password"
            {...register('confirmPassword')}
            className={errors.confirmPassword ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
        </div>

        <div className="flex items-start space-x-2 mt-2">
          <Checkbox 
            id="acceptTerms" 
            onCheckedChange={(checked) => setValue('acceptTerms', checked === true ? true : undefined as any)} 
          />
          <div className="grid leading-none gap-1.5">
            <Label htmlFor="acceptTerms" className="text-sm font-normal text-muted-foreground leading-snug">
              I agree to the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            </Label>
            {errors.acceptTerms && <p className="text-xs text-destructive">{errors.acceptTerms.message}</p>}
          </div>
        </div>

        <Button type="submit" className="w-full h-11 text-base mt-2" disabled={isLoading}>
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
          Create Account
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
