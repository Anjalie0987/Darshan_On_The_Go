export interface TempleAdmin {
  id: string;
  name: string;
  state: string;
  city: string;
  category: string;
  isLive: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface TempleFilters {
  search: string;
  state: string;
  category: string;
  status: string; // 'all', 'active', 'inactive'
  liveStatus: string; // 'all', 'live', 'offline'
}
