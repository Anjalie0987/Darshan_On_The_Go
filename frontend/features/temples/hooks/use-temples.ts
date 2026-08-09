import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';

export interface TempleListItem {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  state: string | null;
  category: string | null;
  imageUrl: string | null;
  isLive: boolean;
}

export interface PaginatedTemples {
  items: TempleListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UseTemplesParams {
  search?: string;
  state?: string;
  city?: string;
  category?: string;
  live?: string; // 'true' | 'false' | 'all'
  page?: number;
  limit?: number;
}

export function useTemples(params: UseTemplesParams) {
  // Convert 'all' to undefined for the API
  const apiParams = { ...params };
  if (apiParams.live === 'all' || apiParams.live === '') {
    delete apiParams.live;
  }
  
  // Remove empty strings to keep URL clean
  Object.keys(apiParams).forEach((key) => {
    if (apiParams[key as keyof UseTemplesParams] === '') {
      delete apiParams[key as keyof UseTemplesParams];
    }
  });

  return useQuery<PaginatedTemples>({
    queryKey: ['temples', apiParams],
    queryFn: async () => {
      const response = await apiClient.get('/temples', { params: apiParams });
      const responseData = response.data.data || response.data;
      return {
        ...responseData,
        items: responseData.items?.map((item: any) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          city: item.city,
          state: item.state,
          category: item.category,
          imageUrl: item.image_url,
          isLive: item.is_live,
        })) || [],
      };
    },
    // Keep previous data while fetching new pages/filters for smooth UI
    placeholderData: (previousData) => previousData,
  });
}
