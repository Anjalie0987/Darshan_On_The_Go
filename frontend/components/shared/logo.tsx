import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'small' | 'medium' | 'large';
  className?: string;
  isFooter?: boolean;
}

export function Logo({ variant = 'medium', className, isFooter = false }: LogoProps) {
  let width = 220;
  let height = 120;
  
  if (variant === 'small') { 
    width = 140; 
    height = 80; 
  }
  if (variant === 'large') { 
    width = 300; 
    height = 160; 
  }

  return (
    <Link 
      href="/" 
      className={cn(
        "inline-flex items-center justify-center transition-opacity hover:opacity-90", 
        className
      )}
    >
      <Image 
        src="/DarshanOnGO_logo.png"
        alt="Darshan On The Go Logo"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
    </Link>
  );
}
