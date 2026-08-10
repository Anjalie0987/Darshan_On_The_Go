'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/axios';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Globe, ExternalLink, Calendar, Users, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { FavoriteButton } from '@/features/favorites/components/favorite-button';

export default function TempleDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [temple, setTemple] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTemple = async () => {
      try {
        const response = await apiClient.get(`/temples/${slug}`);
        setTemple(response.data?.data || response.data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) fetchTemple();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-[400px] w-full rounded-xl mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-32 w-full mt-8" />
        </div>
      </div>
    );
  }

  if (error || !temple) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center text-center">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Temple Not Found</h1>
        <p className="text-muted-foreground">The temple you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  const { isLive, liveStream } = temple;

  return (
    <div className="min-h-screen bg-background">
      {/* Video Player Header */}
      <div className="w-full bg-black">
        <div className="container mx-auto px-0 md:px-4 max-w-6xl">
          {isLive && liveStream?.embedUrl ? (
            <div className="relative aspect-video w-full">
              <iframe
                src={`${liveStream.embedUrl}?autoplay=1&mute=1`}
                title={liveStream.title}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="relative aspect-video w-full bg-muted flex flex-col items-center justify-center text-center border-b border-border/10">
              <div className="w-16 h-16 rounded-full bg-background/10 flex items-center justify-center mb-4">
                <Globe className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-muted-foreground mb-2">Currently Offline</h2>
              <p className="text-sm text-muted-foreground/70 max-w-sm px-4">
                This temple is not broadcasting live right now. Please check back during scheduled aarti times.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Temple Details */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-heading font-bold">{temple.name}</h1>
                <FavoriteButton templeId={temple.id} />
                {isLive ? (
                  <Badge className="bg-destructive hover:bg-destructive text-destructive-foreground border-none animate-in fade-in flex items-center gap-1.5 px-3 py-1 text-sm">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    LIVE NOW
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-sm">Offline</Badge>
                )}
              </div>
              <div className="flex items-center text-muted-foreground gap-2 mt-2">
                <MapPin className="w-4 h-4" />
                <span>{temple.location}</span>
                {temple.pincode && <span>- {temple.pincode}</span>}
              </div>
            </div>

            {isLive && liveStream && (
              <div className="bg-card border rounded-lg p-5">
                <h3 className="font-semibold text-lg mb-1 line-clamp-1">{liveStream.title}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>Started {format(new Date(liveStream.startedAt), 'MMM d, h:mm a')}</span>
                  </div>
                  {liveStream.viewers > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span>{liveStream.viewers.toLocaleString()} watching</span>
                    </div>
                  )}
                </div>
                
                {liveStream.streamUrl && (
                  <a 
                    href={liveStream.streamUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted hover:text-foreground h-7 px-2.5 text-[0.8rem] font-medium transition-all"
                  >
                    Watch on YouTube <ExternalLink className="w-3.5 h-3.5 ml-2" />
                  </a>
                )}
              </div>
            )}

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">About the Temple</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {temple.description || "No description available for this temple."}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-80 space-y-6">
            <div className="bg-card border rounded-lg p-5 space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Information</h3>
              
              <div className="space-y-3 text-sm">
                {temple.address && (
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground font-medium">Full Address</span>
                    <span>{temple.address}</span>
                  </div>
                )}
                
                {temple.official_phone && (
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground font-medium">Contact</span>
                    <span>{temple.official_phone}</span>
                  </div>
                )}
              </div>
            </div>

            {temple.youtubeChannelUrl && (
              <a 
                href={temple.youtubeChannelUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted hover:text-foreground h-8 px-2.5 text-sm font-medium transition-all"
              >
                Official YouTube Channel <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
