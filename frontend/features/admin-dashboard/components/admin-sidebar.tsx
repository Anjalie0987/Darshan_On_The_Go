'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared/logo';
import { LayoutDashboard, LogOut, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminAuthService } from '@/features/admin-auth/services/admin-auth-service';
import { AdminTokenStorage } from '@/features/admin-auth/storage/admin-token-storage';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

interface AdminSidebarProps {
  className?: string;
  onNavigate?: () => void;
}

const navItems = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Temples',
    href: '/admin/temples',
    icon: MapPin,
  },
  {
    title: 'Profile',
    href: '/admin/profile',
    icon: User,
  },
];

export function AdminSidebar({ className, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const refreshToken = AdminTokenStorage.getRefreshToken();
      if (refreshToken) {
        await AdminAuthService.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      AdminTokenStorage.clearTokens();
      queryClient.clear();
      router.push('/admin/login');
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-card border-r w-64", className)}>
      <div className="p-6">
        <Logo variant="small" />
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t mt-auto">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}
