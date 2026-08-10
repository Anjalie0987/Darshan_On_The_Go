'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LiveStreamCard } from '@/components/shared/cards';
import { useLiveStreams } from '../hooks/use-live-streams';
import { useSearchTemples } from '../hooks/use-search-temples';
import Link from 'next/link';

export function HeroSection() {
  const { data: streams, isLoading } = useLiveStreams();
  const featuredStream = streams && streams.length > 0 ? streams[0] : null;

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { data: searchResults, isLoading: isSearching } = useSearchTemples(debouncedQuery);
  const showDropdown = isFocused && searchQuery.length > 1;

  const handleTrendingClick = (term: string) => {
    setSearchQuery(term);
    setIsFocused(true);
  };

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background -z-10" />
      
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Text Content */}
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary w-fit text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Premium Spiritual Experience</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight tracking-tight text-foreground">
              Your Daily Connection to <br className="hidden md:block" />
              <span className="text-primary">Divine Grace.</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Experience live darshans, participate in daily aartis, and connect with sacred temples across India from anywhere in the world.
            </p>
            
            {/* Search UI Component */}
            <div className="relative max-w-xl mt-4" ref={dropdownRef}>
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
                <Input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  placeholder="Search temples, deities, or live streams..." 
                  className="pl-12 pr-32 h-14 rounded-full bg-card shadow-sm border-border text-base focus-visible:ring-primary"
                />
                <Button className="absolute right-2 rounded-full h-10 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                  Search
                </Button>
              </div>
              
              {/* Search Results Dropdown */}
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  {isSearching ? (
                    <div className="flex items-center justify-center py-6 text-muted-foreground">
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Searching...
                    </div>
                  ) : searchResults && searchResults.length > 0 ? (
                    <div className="max-h-[300px] overflow-y-auto py-2">
                      {searchResults.map((temple: any) => (
                        <Link 
                          key={temple.id} 
                          href={`/temples/${temple.slug}`}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
                          onClick={() => setIsFocused(false)}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{temple.name}</span>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              {temple.city || temple.state ? `${temple.city || ''}${temple.city && temple.state ? ', ' : ''}${temple.state || ''}` : 'Location unknown'}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      No temples found for "{debouncedQuery}"
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2 mt-3 ml-4 text-xs font-medium text-muted-foreground">
                <span>Trending:</span>
                <span onClick={() => handleTrendingClick('Kashi Vishwanath')} className="hover:text-primary cursor-pointer transition-colors">Kashi Vishwanath</span>
                <span onClick={() => handleTrendingClick('Kedarnath')} className="hover:text-primary cursor-pointer transition-colors">Kedarnath</span>
              </div>
            </div>
          </div>
          
          {/* Hero Visual / Featured Live Stream */}
          <div className="relative lg:ml-auto w-full max-w-md mx-auto lg:max-w-lg animate-in fade-in zoom-in-95 duration-1000 delay-150 fill-mode-both">
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-accent/20 blur-3xl -z-10 rounded-[3rem]" />
            {isLoading ? (
              <div className="w-full aspect-[4/3] rounded-2xl bg-muted/50 animate-pulse" />
            ) : featuredStream ? (
              <LiveStreamCard {...featuredStream} />
            ) : (
              <div className="relative w-full aspect-[4/3] overflow-hidden group [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)] md:[mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
                <img 
                  src="/hero.png" 
                  alt="Premium Temple View" 
                  className="object-cover object-center w-full h-full transform transition-transform duration-700 group-hover:scale-105" 
                />
              </div>
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
}
