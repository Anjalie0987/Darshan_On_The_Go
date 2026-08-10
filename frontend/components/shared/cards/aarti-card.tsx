import { Card, CardContent } from '@/components/ui/card';
import { Clock, MapPin, PlayCircle, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface AartiCardProps {
  id: string;
  name: string;
  timeStart: string;
  timeEnd: string | null;
  templeName: string;
  templeSlug: string;
  location: string;
  templeImage: string | null;
  status: 'Upcoming' | 'Live Now' | 'Completed';
}

export function AartiCard({ name, timeStart, timeEnd, templeName, templeSlug, location, templeImage, status }: AartiCardProps) {
  let displayImage = templeImage || 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&q=80';
  if (displayImage.startsWith('/uploads/')) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const cleanBaseUrl = baseUrl.replace(/\/api\/v1\/?$/, '');
    displayImage = `${cleanBaseUrl}${displayImage}`;
  }

  const formatTime = (timeString: string) => {
    const [h, m] = timeString.split(':');
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${m} ${ampm}`;
  };

  const timeDisplay = timeEnd ? `${formatTime(timeStart)} - ${formatTime(timeEnd)}` : formatTime(timeStart);

  return (
    <Link href={`/temples/${templeSlug}`}>
      <Card className="overflow-hidden group cursor-pointer border-border/50 hover:shadow-md transition-all flex flex-col h-full">
        <div className="flex p-4 gap-4 items-center">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
            <Image 
              src={displayImage} 
              alt={templeName}
              fill
              sizes="64px"
              unoptimized={displayImage ? (displayImage.includes('localhost') || displayImage.includes('127.0.0.1')) : false}
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="flex flex-col flex-grow overflow-hidden">
            <h3 className="font-heading font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
              {name}
            </h3>
            <span className="text-sm text-muted-foreground line-clamp-1">{templeName}</span>
            <div className="flex items-center text-xs text-muted-foreground gap-1 mt-1">
              <MapPin className="w-3 h-3" />
              <span className="line-clamp-1">{location}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-muted/30 px-4 py-3 flex items-center justify-between border-t border-border/50 mt-auto">
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <Clock className="w-4 h-4 text-primary" />
            {timeDisplay}
          </div>
          {status === 'Live Now' && (
            <Badge className="bg-destructive hover:bg-destructive text-destructive-foreground border-none animate-in fade-in flex items-center gap-1 px-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Live Now
            </Badge>
          )}
          {status === 'Upcoming' && (
            <Badge variant="secondary" className="bg-primary/10 text-primary border-none flex items-center gap-1 px-2 py-0.5">
              <PlayCircle className="w-3 h-3" />
              Upcoming
            </Badge>
          )}
          {status === 'Completed' && (
            <Badge variant="outline" className="text-muted-foreground border-muted-foreground/30 flex items-center gap-1 px-2 py-0.5">
              <CheckCircle2 className="w-3 h-3" />
              Completed
            </Badge>
          )}
        </div>
      </Card>
    </Link>
  );
}
