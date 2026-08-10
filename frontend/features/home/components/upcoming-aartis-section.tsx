'use client';

import { AartiCard } from '@/components/shared/cards';
import { BellRing, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTodaysAartis, AartiData } from '../hooks/use-todays-aartis';
import { Skeleton } from '@/components/ui/skeleton';

export function UpcomingAartisSection() {
  const { data: aartis, isLoading, isError, refetch } = useTodaysAartis();

  const getAartiStatus = (timeStart: string, timeEnd: string | null): 'Upcoming' | 'Live Now' | 'Completed' => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [startH, startM] = timeStart.split(':').map(Number);
    const startMinutes = startH * 60 + startM;

    let endMinutes = startMinutes + 30; // default 30 mins if not provided
    if (timeEnd) {
      const [endH, endM] = timeEnd.split(':').map(Number);
      endMinutes = endH * 60 + endM;
    }

    if (currentMinutes < startMinutes) return 'Upcoming';
    if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) return 'Live Now';
    return 'Completed';
  };

  return (
    <section className="py-16 bg-background relative overflow-hidden">
      {/* Decorative bg element */}
      <div className="absolute right-0 top-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-accent/5 blur-[100px] -z-10" />

      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-8">
          <div className="max-w-xl">
            <h2 className="text-3xl font-heading font-bold tracking-tight mb-2">Today's Sacred Aartis</h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Never miss a daily ritual. View schedules and get notified before the Aarti begins.
            </p>
          </div>
          <Button variant="outline" className="shrink-0 group">
            <BellRing className="w-4 h-4 mr-2 group-hover:animate-ping" />
            Manage Alerts
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-destructive/5">
            <AlertCircle className="w-10 h-10 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load aartis</h3>
            <p className="text-muted-foreground mb-4">There was a problem connecting to the server.</p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        ) : aartis?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg bg-muted/10 border-dashed">
            <h3 className="text-xl font-semibold mb-2 text-muted-foreground">No Aartis scheduled for today</h3>
            <p className="text-muted-foreground max-w-md">
              Please check back later or explore our popular temples.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aartis?.map((aarti: AartiData) => (
              <AartiCard 
                key={aarti.id} 
                {...aarti} 
                status={getAartiStatus(aarti.timeStart, aarti.timeEnd)} 
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
