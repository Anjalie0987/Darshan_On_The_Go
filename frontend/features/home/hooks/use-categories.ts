import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';

export interface CategoryData {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  image?: string | null;
}

export function useCategories() {
  return useQuery<CategoryData[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiClient.get('/categories');
      return response.data.data || response.data || [];
    }
  });
}
