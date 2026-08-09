'use client';

import { TempleCard } from '@/components/shared/cards';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { usePopularTemples } from '../hooks/use-popular-temples';

export function PopularTemplesSection() {
  const { data: temples, isLoading } = usePopularTemples();

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-heading font-bold tracking-tight mb-2">Popular Temples</h2>
            <p className="text-muted-foreground text-sm md:text-base">Discover the most revered spiritual destinations.</p>
          </div>
          <Button variant="ghost" className="hidden md:flex text-primary hover:text-primary hover:bg-primary/10 group">
            Explore All <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {temples?.map((temple) => (
              <TempleCard key={temple.id} {...temple} />
            ))}
          </div>
        )}
        
        <Button variant="outline" className="w-full mt-6 md:hidden bg-background">
          Explore All Temples
        </Button>
      </div>
    </section>
  );
}
