import { useState, useEffect } from 'react';
import { TempleAdmin, TempleFilters } from '../types';
import { templeService } from '../services/temples.service';

export function useAdminTemples(filters: TempleFilters, page: number, limit: number) {
  const [data, setData] = useState<{ temples: TempleAdmin[]; total: number }>({ temples: [], total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const fetchTemples = async () => {
      try {
        const params: any = {
          page,
          limit,
        };

        if (filters.search) params.search = filters.search;
        if (filters.state && filters.state !== 'all') params.state = filters.state;
        if (filters.category && filters.category !== 'all') params.category = filters.category;
        if (filters.status && filters.status !== 'all') params.status = filters.status;
        if (filters.liveStatus && filters.liveStatus !== 'all') params.liveStatus = filters.liveStatus;

        const response = await templeService.getAdminTemples(params);
        
        if (isMounted) {
          // The API response is wrapped in { success, data: { data: [...], total: ... } }
          const paginatedData = response.data || {};
          setData({ 
            temples: paginatedData.data || [], 
            total: paginatedData.total || 0 
          });
        }
      } catch (error) {
        console.error('Failed to fetch admin temples:', error);
        if (isMounted) {
          setData({ temples: [], total: 0 });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchTemples();

    return () => {
      isMounted = false;
    };
  }, [filters, page, limit, refetchTrigger]);

  const refetch = () => setRefetchTrigger(prev => prev + 1);

  return { data, isLoading, refetch };
}
