'use client';

import { Suspense } from 'react';
import { useFavorites } from '@/features/favorites/hooks/use-favorites';
import { TempleCard } from '@/components/shared/cards';
import { Button } from '@/components/ui/button';
import { Heart, Loader2 } from 'lucide-react';
import Link from 'next/link';

function FavoritesContent() {
  const { data: favorites, isLoading, isError } = useFavorites();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground flex items-center gap-3">
          <Heart className="w-8 h-8 text-red-500 fill-current" />
          My Favorite Temples
        </h1>
        <p className="text-muted-foreground mt-2">Access your saved temples and live darshans quickly.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-border bg-card">
              <div className="aspect-[4/3] bg-muted animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-muted rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-20 bg-card rounded-xl border border-border/50">
          <p className="text-destructive mb-4">Failed to load your favorite temples.</p>
          <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      ) : !favorites || favorites.length === 0 ? (
        <div className="text-center py-24 bg-card rounded-xl border border-border/50 flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <h3 className="text-2xl font-heading font-semibold mb-3">No favorite temples yet</h3>
          <p className="text-muted-foreground max-w-md mb-8 text-lg">
            Save your favorite temples to quickly access their live darshan anytime.
          </p>
          <Link href="/temples">
            <Button size="lg" className="rounded-full px-8">
              Explore Temples
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((temple) => (
            <TempleCard
              key={temple.id}
              id={temple.id}
              name={temple.name}
              location={`${temple.city || ''}${temple.city && temple.state ? ', ' : ''}${temple.state || ''}`}
              deity={temple.category || 'Temple'}
              image={temple.imageUrl || "https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=800&auto=format&fit=crop"}
              isLive={temple.isLive}
              slug={temple.slug}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FavoritesPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading favorites...</p>
      </div>
    }>
      <FavoritesContent />
    </Suspense>
  );
}
