import Image from 'next/image';
import { Card } from '@/components/ui/card';

interface CategoryCardProps {
  name: string;
  image: string;
}

export function CategoryCard({ name, image }: CategoryCardProps) {
  let displayImage = image;
  if (displayImage && displayImage.startsWith('/uploads/')) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const cleanBaseUrl = baseUrl.replace(/\/api\/v1\/?$/, '');
    displayImage = `${cleanBaseUrl}${displayImage}`;
  }

  return (
    <Card className="group cursor-pointer overflow-hidden border-border/50 hover:border-primary/50 transition-all flex items-center p-2 pr-6 gap-4 min-w-[200px] shrink-0">
      <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
        <Image 
          src={displayImage} 
          alt={name}
          fill
          sizes="48px"
          unoptimized={displayImage ? (displayImage.includes('localhost') || displayImage.includes('127.0.0.1')) : false}
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <span className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">{name}</span>
    </Card>
  );
}
