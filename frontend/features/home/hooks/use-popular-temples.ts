import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';

export interface PopularTemple {
  id: string;
  name: string;
  slug: string;
  location: string;
  image: string;
  deity: string;
  isLive: boolean;
  viewers?: number;
}

export function usePopularTemples() {
  return useQuery<PopularTemple[]>({
    queryKey: ['popular-temples'],
    queryFn: async () => {
      const response = await apiClient.get('/temples?limit=8');
      const temples = response.data.data?.data || response.data?.data || response.data || [];
      
      return temples.map((temple: any) => {
        let imageUrl = temple.imageUrl;
        if (imageUrl && imageUrl.startsWith('/')) {
          imageUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${imageUrl}`;
        }
        
        return {
          id: temple.id,
          name: temple.name,
          slug: temple.slug,
          location: temple.city && temple.state ? `${temple.city}, ${temple.state}` : temple.state || temple.city || '',
          image: imageUrl || 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80',
          deity: temple.category?.name || temple.category || 'Divine',
          isLive: temple.isLive || temple.is_live || false,
          viewers: temple.viewerCount || 0
        };
      });
    },
  });
}
