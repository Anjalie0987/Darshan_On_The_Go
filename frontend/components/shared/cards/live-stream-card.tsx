import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, PlayCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface LiveStreamCardProps {
  title: string;
  templeName: string;
  thumbnail: string | null;
  isLive: boolean;
  viewers?: number;
  slug?: string;
  nextLiveAt?: string;
}

export function LiveStreamCard({ title, templeName, thumbnail, isLive, viewers, slug, nextLiveAt }: LiveStreamCardProps) {
  const fallbackThumbnail = '/images/placeholder-temple.jpg'; // We can use a generic fallback
  
  return (
    <Link href={slug ? `/temples/${slug}` : '#'}>
      <Card className="overflow-hidden group cursor-pointer border-border/50 transition-all hover:shadow-lg h-full flex flex-col">
        <div className="relative aspect-video w-full overflow-hidden">
          <Image 
            src={thumbnail || fallbackThumbnail} 
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {isLive ? (
              <Badge className="bg-destructive hover:bg-destructive text-destructive-foreground border-none animate-in fade-in flex items-center gap-1.5 px-2.5 py-1">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                LIVE
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-md">
                Upcoming
              </Badge>
            )}
            {isLive && viewers !== undefined && (
              <Badge variant="secondary" className="bg-black/60 text-white border-none backdrop-blur-md flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {viewers.toLocaleString()}
              </Badge>
            )}
          </div>

          {/* Play Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg">
              <PlayCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
        
        <CardContent className="p-5 flex flex-col gap-2 flex-grow">
          <div>
            <h3 className="font-heading font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{templeName}</p>
          </div>
          
          {!isLive && nextLiveAt && (
            <div className="flex items-center gap-2 mt-auto text-xs font-medium text-primary bg-primary/10 w-fit px-3 py-1.5 rounded-full">
              <Clock className="w-3.5 h-3.5" />
              Starts {format(new Date(nextLiveAt), 'MMM d, h:mm a')}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
