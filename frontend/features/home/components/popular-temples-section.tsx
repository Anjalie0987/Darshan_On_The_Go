'use client';

import { useState } from 'react';
import { TempleCard } from '@/components/shared/cards';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowUp, AlertCircle, RefreshCw } from 'lucide-react';
import { usePopularTemples } from '../hooks/use-popular-temples';
import { Skeleton } from '@/components/ui/skeleton';

export function PopularTemplesSection() {
  const { data: temples, isLoading, isError, refetch } = usePopularTemples();
  const [isExpanded, setIsExpanded] = useState(false);

  const displayedTemples = isExpanded ? temples : temples?.slice(0, 8);


  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-heading font-bold tracking-tight mb-2">Popular Temples</h2>
            <p className="text-muted-foreground text-sm md:text-base">Discover the most revered spiritual destinations.</p>
          </div>
          {temples && temples.length > 8 && (
            <Button 
              variant="ghost" 
              className="hidden md:flex text-primary hover:text-primary hover:bg-primary/10 group" 
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>View Less <ArrowUp className="w-4 h-4 ml-2 transition-transform" /></>
              ) : (
                <>View All <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" /></>
              )}
            </Button>
          )}
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[200px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-destructive/5">
            <AlertCircle className="w-10 h-10 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load temples</h3>
            <p className="text-muted-foreground mb-4">There was a problem connecting to the server.</p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        ) : temples?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg bg-muted/10 border-dashed">
            <h3 className="text-xl font-semibold mb-2 text-muted-foreground">No temples found</h3>
            <p className="text-muted-foreground max-w-md">
              We couldn't find any popular temples at the moment. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedTemples?.map((temple) => (
              <TempleCard key={temple.id} {...temple} />
            ))}
          </div>
        )}
        
        {temples && temples.length > 8 && (
          <Button 
            variant="outline" 
            className="w-full mt-6 md:hidden bg-background" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'View Less' : 'View All Temples'}
          </Button>
        )}
      </div>
    </section>
  );
}
