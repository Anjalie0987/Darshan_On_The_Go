'use client';

import { Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LiveStreamCard } from '@/components/shared/cards';
import { useLiveStreams } from '../hooks/use-live-streams';

export function HeroSection() {
  const { data: streams, isLoading } = useLiveStreams();
  const featuredStream = streams && streams.length > 0 ? streams[0] : null;

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
            
            {/* Search UI Component (Mock) */}
            <div className="relative max-w-xl mt-4">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="Search temples, deities, or live streams..." 
                  className="pl-12 pr-32 h-14 rounded-full bg-card shadow-sm border-border text-base focus-visible:ring-primary"
                />
                <Button className="absolute right-2 rounded-full h-10 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                  Search
                </Button>
              </div>
              <div className="flex gap-2 mt-3 ml-4 text-xs font-medium text-muted-foreground">
                <span>Trending:</span>
                <span className="hover:text-primary cursor-pointer transition-colors">Kashi Vishwanath</span>
                <span className="hover:text-primary cursor-pointer transition-colors">Kedarnath</span>
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
