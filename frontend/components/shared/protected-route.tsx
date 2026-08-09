'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // We do NOT auto-redirect to avoid flashing on slow connections for now, 
    // but in production you might want to redirect immediately if !isAuthenticated && !isLoading
  }, [isAuthenticated, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <Lock className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-heading font-semibold tracking-tight mb-2">Authentication Required</h2>
        <p className="text-muted-foreground text-sm max-w-sm mb-6">
          You need to be signed in to access this page. Please log in or create an account to continue.
        </p>
        <div className="flex gap-4">
          <Link href="/">
            <Button variant="outline">Return Home</Button>
          </Link>
          <Link href={`/login?callbackUrl=${pathname}`}>
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
