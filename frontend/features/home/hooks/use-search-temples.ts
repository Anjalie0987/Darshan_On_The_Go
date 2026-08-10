import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';

export function useSearchTemples(query: string) {
  return useQuery({
    queryKey: ['search-temples', query],
    queryFn: async () => {
      if (!query) return [];
      const response = await apiClient.get(`/temples?search=${encodeURIComponent(query)}&limit=5`);
      return response.data.data?.data || response.data?.data || response.data || [];
    },
    enabled: query.length > 1,
    staleTime: 60000,
  });
}
