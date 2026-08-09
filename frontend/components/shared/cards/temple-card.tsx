import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import { FavoriteButton } from '@/features/favorites/components/favorite-button';

interface TempleCardProps {
  name: string;
  location: string;
  deity: string;
  image: string;
  isLive?: boolean;
  slug?: string;
  id?: string;
}

export function TempleCard({ name, location, deity, image, isLive, slug, id }: TempleCardProps) {
  let displayImage = image;
  if (displayImage && displayImage.startsWith('/uploads/')) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const cleanBaseUrl = baseUrl.replace(/\/api\/v1\/?$/, '');
    displayImage = `${cleanBaseUrl}${displayImage}`;
  }

  return (
    <Link href={slug ? `/temples/${slug}` : '#'}>
      <Card className="overflow-hidden group cursor-pointer transition-all hover:shadow-lg border-border/50 h-full flex flex-col">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image 
            src={displayImage} 
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
            {isLive ? (
              <Badge className="bg-destructive hover:bg-destructive text-destructive-foreground border-none animate-in fade-in flex items-center gap-1.5 px-2.5 py-1">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                LIVE NOW
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-background/80 text-muted-foreground backdrop-blur-md border-none">
                Offline
              </Badge>
            )}
            <Badge className="bg-background/80 text-foreground backdrop-blur-md hover:bg-background border-none shadow-sm">
              {deity}
            </Badge>
          </div>
          {id && (
            <div className="absolute top-4 right-4 z-10" onClick={(e) => e.preventDefault()}>
              <FavoriteButton 
                templeId={id} 
                variant="icon" 
                className="bg-black/20 hover:bg-black/40 text-white border-none h-9 w-9 backdrop-blur-sm" 
              />
            </div>
          )}
        </div>
        <CardContent className="p-5 flex flex-col gap-1.5 flex-grow">
          <h3 className="font-heading font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <div className="flex items-center text-sm text-muted-foreground gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
