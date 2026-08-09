import { Logo } from './logo';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t bg-background py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-8 flex flex-col items-center justify-center gap-4">
        <Logo variant="small" isFooter />
        <p className="text-sm text-muted-foreground text-center max-w-md">
          Connecting devotees worldwide with premium spiritual experiences, live streams, and temple insights.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-md text-xs text-muted-foreground mt-4 gap-2">
          <span>© {new Date().getFullYear()} Darshan On The Go. All rights reserved.</span>
          <Link href="/admin/login" className="hover:text-primary transition-colors">
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
