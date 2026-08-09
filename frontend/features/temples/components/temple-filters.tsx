'use client';

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

// These could ideally be fetched from the backend, but for simplicity we can use standard lists
// or accept them as props if they are dynamic.
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const TEMPLE_CATEGORIES = [
  'Jyotirlinga', 'Shakti Peeth', 'Char Dham', 'Pancha Bhoota', 'Ganesha', 'Krishna', 'Other'
];

export interface TempleFilterValues {
  state: string;
  category: string;
  live: string;
}

interface TempleFiltersProps {
  filters: TempleFilterValues;
  onChange: (key: keyof TempleFilterValues, value: string) => void;
}

export function TempleFilters({ filters, onChange }: TempleFiltersProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Live Status</Label>
        <Select 
          value={filters.live || 'all'} 
          onValueChange={(v) => onChange('live', v || '')}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Temples" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Temples</SelectItem>
            <SelectItem value="true">🔴 Live Now</SelectItem>
            <SelectItem value="false">Offline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">State</Label>
        <Select 
          value={filters.state || 'all'} 
          onValueChange={(v) => onChange('state', v === 'all' ? '' : (v || ''))}
        >
          <SelectTrigger>
            <SelectValue placeholder="All States" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {INDIAN_STATES.map(state => (
              <SelectItem key={state} value={state}>{state}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Category</Label>
        <Select 
          value={filters.category || 'all'} 
          onValueChange={(v) => onChange('category', v === 'all' ? '' : (v || ''))}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {TEMPLE_CATEGORIES.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
