import { Logo } from '@/components/shared/logo';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar Placeholder */}
      <aside className="w-64 border-r bg-card hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b">
          <Logo variant="small" />
        </div>
        <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
          <Link href="/dashboard" className="rounded-lg px-3 py-2 text-sm font-medium bg-muted text-primary">Overview</Link>
          <Link href="/favorites" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted/50 transition-colors">My Favorites</Link>
          <Link href="/settings" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted/50 transition-colors">Settings</Link>
        </nav>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 border-b flex items-center justify-between px-6 bg-background">
          <div className="md:hidden">
            <Logo variant="small" />
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              U
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 bg-muted/10">
          {children}
        </main>
      </div>
    </div>
  );
}
