'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TempleSearch } from '@/features/temples/components/temple-search';
import { TempleFilters, type TempleFilterValues } from '@/features/temples/components/temple-filters';
import { useTemples } from '@/features/temples/hooks/use-temples';
import { TempleCard } from '@/components/shared/cards';
import { Button } from '@/components/ui/button';
import { Loader2, SlidersHorizontal, X, Search } from 'lucide-react';


function TemplesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const search = searchParams.get('search') || '';
  const state = searchParams.get('state') || '';
  const category = searchParams.get('category') || '';
  const live = searchParams.get('live') || 'all';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const { data, isLoading, isError } = useTemples({
    search,
    state,
    category,
    live,
    page,
    limit: 12
  });

  const updateUrl = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    // Reset page to 1 on any filter change
    if (!newParams.page) {
      params.set('page', '1');
    }
    router.push(`/temples?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    updateUrl({ search: value, page: '1' });
  };

  const handleFilterChange = (key: keyof TempleFilterValues, value: string) => {
    updateUrl({ [key]: value, page: '1' });
  };

  const clearFilters = () => {
    router.push('/temples');
  };

  const hasFilters = search || state || category || (live && live !== 'all');

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">Explore Temples</h1>
          <p className="text-muted-foreground mt-2">Find and watch live darshan from temples across India.</p>
        </div>
        
        <div className="w-full md:w-[400px]">
          <TempleSearch initialValue={search} onSearch={handleSearch} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block w-64 shrink-0 space-y-6">
          <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-semibold flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </h2>
              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground">
                  Clear all
                </Button>
              )}
            </div>
            <TempleFilters 
              filters={{ state, category, live }} 
              onChange={handleFilterChange} 
            />
          </div>
        </div>

        {/* Mobile Filters Toggle */}
        <div className="lg:hidden flex flex-col gap-4 mb-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {data?.total || 0} temples found
            </p>
            <Button variant="outline" size="sm" onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)} className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              {isMobileFiltersOpen ? 'Hide Filters' : 'Filters'}
            </Button>
          </div>
          
          {isMobileFiltersOpen && (
            <div className="p-4 bg-card border border-border/50 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold">Filters</h3>
                {hasFilters && (
                  <Button variant="ghost" size="sm" onClick={() => {
                    clearFilters();
                    setIsMobileFiltersOpen(false);
                  }} className="h-8 px-2 text-xs">
                    Clear all
                  </Button>
                )}
              </div>
              <TempleFilters 
                filters={{ state, category, live }} 
                onChange={handleFilterChange} 
              />
              <Button className="w-full mt-6" onClick={() => setIsMobileFiltersOpen(false)}>
                Apply Filters
              </Button>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="flex-1">
          <div className="hidden lg:block mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {data?.items.length || 0} of {data?.total || 0} temples
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
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
              <p className="text-destructive mb-2">Failed to load temples.</p>
              <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          ) : data?.items.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-xl border border-border/50 flex flex-col items-center justify-center">
              <Search className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-heading font-semibold mb-2">No temples found</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                We couldn't find any temples matching your current filters. Try adjusting your search or clearing the filters.
              </p>
              <Button onClick={clearFilters} variant="outline" className="flex items-center gap-2">
                <X className="w-4 h-4" />
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {data?.items.map((temple) => (
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

              {/* Pagination */}
              {data && data.totalPages > 1 && (
                <div className="flex justify-center mt-12 gap-2">
                  <Button 
                    variant="outline" 
                    disabled={page <= 1}
                    onClick={() => updateUrl({ page: (page - 1).toString() })}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center justify-center px-4 text-sm font-medium">
                    Page {page} of {data.totalPages}
                  </div>
                  <Button 
                    variant="outline" 
                    disabled={page >= data.totalPages}
                    onClick={() => updateUrl({ page: (page + 1).toString() })}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TemplesPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading temples...</p>
      </div>
    }>
      <TemplesContent />
    </Suspense>
  );
}
