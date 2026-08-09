import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';

export interface LiveStreamData {
  id: string;
  title: string;
  templeName: string;
  thumbnail: string | null;
  isLive: boolean;
  viewers: number;
  slug: string;
  location: string;
  startedAt: string;
  streamUrl: string | null;
  embedUrl: string | null;
}

export function useLiveStreams() {
  return useQuery<LiveStreamData[]>({
    queryKey: ['live-streams'],
    queryFn: async () => {
      const response = await apiClient.get('/live');
      return response.data.data || response.data;
    },
    refetchInterval: 60000, // Refetch every minute to keep statuses fresh
  });
}
