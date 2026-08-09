'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentAdmin } from '@/features/admin-auth/hooks/use-current-admin';
import { AdminSidebar } from '@/features/admin-dashboard/components/admin-sidebar';
import { AdminHeader } from '@/features/admin-dashboard/components/admin-header';
import { Loader2 } from 'lucide-react';

import { AdminAuthProvider } from '@/contexts/admin-auth-context';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  
  // This hook handles auth validation. If it fails, the user is not authenticated.
  const { data: admin, isLoading, isError } = useCurrentAdmin();

  useEffect(() => {
    // If we're done loading and there's an error or no admin data, redirect to login
    if (!isLoading && (isError || !admin)) {
      router.push('/admin/login');
    }
  }, [admin, isLoading, isError, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Prevent rendering protected content if unauthenticated
  if (!admin) {
    return null;
  }

  return (
    <AdminAuthProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <AdminSidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        )}
        
        {/* Mobile Sidebar */}
        <div className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <AdminSidebar onNavigate={() => setIsMobileMenuOpen(false)} />
        </div>

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <AdminHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminAuthProvider>
  );
}
