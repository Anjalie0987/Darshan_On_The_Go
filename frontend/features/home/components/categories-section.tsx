'use client';

import { CategoryCard } from '@/components/shared/cards';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useCategories } from '../hooks/use-categories';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CategoriesSection() {
  const { data: categories, isLoading, isError, refetch } = useCategories();

  return (
    <section className="py-12 bg-background border-y border-border/50">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-xl font-heading font-semibold mb-6">Browse by Deity</h2>
        
        {isLoading ? (
          <div className="flex w-full space-x-4 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-16 w-48 shrink-0 rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-8 text-center border rounded-lg bg-destructive/5">
            <AlertCircle className="w-8 h-8 text-destructive mb-3" />
            <p className="text-sm text-muted-foreground mb-3">Failed to load categories</p>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              <RefreshCw className="w-3 h-3 mr-2" />
              Try Again
            </Button>
          </div>
        ) : categories?.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-center border rounded-lg bg-muted/10 border-dashed">
            <p className="text-muted-foreground">No categories available.</p>
          </div>
        ) : (
          <ScrollArea className="w-full whitespace-nowrap pb-4">
            <div className="flex w-max space-x-4">
              {categories?.map((cat) => (
                <CategoryCard 
                  key={cat.id} 
                  name={cat.name} 
                  image={cat.image || 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=200&q=80'} 
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="hidden md:flex" />
          </ScrollArea>
        )}
      </div>
    </section>
  );
}
