'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface TempleSearchProps {
  initialValue?: string;
  onSearch: (value: string) => void;
  debounceMs?: number;
}

export function TempleSearch({ initialValue = '', onSearch, debounceMs = 500 }: TempleSearchProps) {
  const [value, setValue] = useState(initialValue);

  // Sync internal state if initialValue changes (e.g. from URL)
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Only call onSearch if it actually changed to avoid unnecessary API calls
      if (value !== initialValue) {
        onSearch(value);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, onSearch, debounceMs, initialValue]);

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search temples, cities or states..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-10 h-12 text-base rounded-full shadow-sm bg-background/60 backdrop-blur-sm border-border/50 focus-visible:bg-background"
      />
    </div>
  );
}
