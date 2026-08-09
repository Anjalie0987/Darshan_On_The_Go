import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TempleFilters as Filters } from '../types';
import { useEffect, useState } from 'react';

interface TempleFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export function TempleFilters({ filters, onFilterChange }: TempleFiltersProps) {
  // Local state for debounced search
  const [searchTerm, setSearchTerm] = useState(filters.search);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        onFilterChange({ ...filters, search: searchTerm });
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm, filters, onFilterChange]);

  const handleSelectChange = (key: keyof Filters, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="relative flex-1 md:max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, state, or city..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4 md:flex md:w-auto">
        <Select value={filters.status || ''} onValueChange={(v) => handleSelectChange('status', v as string)}>
          <SelectTrigger className="w-full md:w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filters.liveStatus || ''} onValueChange={(v) => handleSelectChange('liveStatus', v as string)}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Live Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Broadcasts</SelectItem>
            <SelectItem value="live">Currently Live</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
