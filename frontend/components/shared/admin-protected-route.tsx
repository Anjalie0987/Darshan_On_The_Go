'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../contexts/admin-auth-context';

export default function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { admin, isInitializing } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isInitializing && !admin) {
      router.push('/admin/login');
    }
  }, [admin, isInitializing, router]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return <>{children}</>;
}
