'use client';

import { Logo } from './logo';
import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { useAuth } from '@/contexts/auth-context';
import { UserNav } from './user-nav';

export function Navbar() {
  const { isAuthenticated, isLoading } = useAuth();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Logo variant="small" />
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {isAuthenticated && (
            <>
              <Link href="/temples" className="transition-colors hover:text-primary">Temples</Link>
              <Link href="/favorites" className="transition-colors hover:text-primary">Favorites</Link>
            </>
          )}
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {!isLoading && (
            isAuthenticated ? (
              <UserNav />
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium hover:text-primary">Sign In</Link>
                <Link 
                  href="/register" 
                  className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )
          )}
        </div>
      </div>
    </header>
  );
}
