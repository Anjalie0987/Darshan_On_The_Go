'use client';

import { LiveStreamCard } from '@/components/shared/cards';
import { Button } from '@/components/ui/button';
import { ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { useLiveStreams } from '../hooks/use-live-streams';
import { Skeleton } from '@/components/ui/skeleton';

export function LiveDarshanSection() {
  const { data: streams, isLoading, isError, refetch } = useLiveStreams();

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-heading font-bold tracking-tight mb-2">Live Darshan</h2>
            <p className="text-muted-foreground text-sm md:text-base">Experience the divine presence in real-time.</p>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[200px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-destructive/5">
            <AlertCircle className="w-10 h-10 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load live streams</h3>
            <p className="text-muted-foreground mb-4">There was a problem connecting to the server.</p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        ) : streams?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg bg-muted/10 border-dashed">
            <h3 className="text-xl font-semibold mb-2 text-muted-foreground">No temples are currently live</h3>
            <p className="text-muted-foreground max-w-md">
              Please check back later during normal darshan and aarti timings for live streams.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {streams?.map((stream) => (
              <LiveStreamCard key={stream.id} {...stream} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
