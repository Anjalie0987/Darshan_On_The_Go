import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';

export interface AartiData {
  id: string;
  name: string;
  timeStart: string;
  timeEnd: string | null;
  timeZone: string;
  templeName: string;
  templeSlug: string;
  location: string;
  templeImage: string | null;
}

export function useTodaysAartis() {
  return useQuery<AartiData[]>({
    queryKey: ['todays-aartis'],
    queryFn: async () => {
      const response = await apiClient.get('/aartis/today');
      return response.data.data || response.data || [];
    },
    refetchInterval: 60000, // Refetch every minute to keep statuses fresh
  });
}
