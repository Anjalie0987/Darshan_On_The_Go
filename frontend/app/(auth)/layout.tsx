import { Logo } from '@/components/shared/logo';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background relative">
      
      {/* Left/Center Panel - Form Container */}
      <div className="flex flex-1 flex-col items-center justify-center relative px-4 py-12 z-10 w-full lg:w-1/2">
        {/* Mobile Absolute Controls */}
        <div className="absolute right-4 top-4 lg:right-8 lg:top-8 z-50">
          <ThemeToggle />
        </div>
        <div className="absolute left-4 top-4 lg:left-8 lg:top-8 z-50">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors text-muted-foreground hover:text-foreground">
            ← Back to home
          </Link>
        </div>

        {/* Auth Content */}
        <div className="w-full max-w-[420px] mx-auto flex flex-col gap-6">
          <div className="flex justify-center mb-2">
            <Logo variant="large" />
          </div>
          
          <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl text-card-foreground shadow-xl p-8">
            {children}
          </div>
        </div>
      </div>

      {/* Right Panel - Illustration (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary items-center justify-center">
        {/* Deep spiritual abstract gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent/80 mix-blend-multiply" />
        
        {/* Placeholder for spiritual illustration or high-quality temple image */}
        <Image 
          src="https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=1200&auto=format&fit=crop" 
          alt="Temple Background"
          fill
          sizes="50vw"
          className="object-cover opacity-30 mix-blend-overlay"
          priority
        />
        
        <div className="relative z-10 flex flex-col items-center text-center px-12 animate-in fade-in zoom-in duration-1000">
          <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md mb-8 flex items-center justify-center shadow-2xl border border-white/20">
             <Logo variant="small" className="text-white scale-125 pointer-events-none" />
          </div>
          <h2 className="text-4xl font-heading font-bold text-white mb-4 tracking-tight">
            Connect to the Divine
          </h2>
          <p className="text-white/80 text-lg max-w-md leading-relaxed">
            Experience the sanctity of live temple darshans and daily aartis from anywhere in the world.
          </p>
        </div>
      </div>
      
    </div>
  );
}
