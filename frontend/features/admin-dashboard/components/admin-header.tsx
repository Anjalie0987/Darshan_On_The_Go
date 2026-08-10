'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCurrentAdmin } from '@/features/admin-auth/hooks/use-current-admin';
import { Skeleton } from '@/components/ui/skeleton';

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { data: admin, isLoading } = useCurrentAdmin();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        )}
        <h2 className="text-lg font-semibold hidden sm:block">
          Welcome back, {isLoading ? <Skeleton className="w-24 h-6 inline-block align-middle ml-2" /> : admin?.name || 'Admin'}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        
        <ThemeToggle />

        <div className="flex items-center gap-3 ml-2 border-l pl-4">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-medium leading-none">{isLoading ? <Skeleton className="w-20 h-4 mb-1" /> : admin?.name || 'Admin'}</span>
            <span className="text-xs text-muted-foreground mt-1">{isLoading ? <Skeleton className="w-16 h-3" /> : admin?.role || 'Super Admin'}</span>
          </div>
          <Avatar className="h-9 w-9 border">
            <AvatarImage src="" alt="Admin" />
            <AvatarFallback className="bg-primary/10 text-primary">
              {admin?.name ? admin.name.charAt(0).toUpperCase() : 'A'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
