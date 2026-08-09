import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';

export interface FavoriteTemple {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  state: string | null;
  category: string | null;
  imageUrl: string | null;
  isLive: boolean;
  favoritedAt: string;
}

export function useFavorites() {
  return useQuery<FavoriteTemple[]>({
    queryKey: ['favorites'],
    queryFn: async () => {
      const response = await apiClient.get('/favorites');
      const data = response.data.data || response.data;
      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        city: item.city,
        state: item.state,
        category: item.category,
        imageUrl: item.image_url,
        isLive: item.is_live,
        favoritedAt: item.favorited_at,
      }));
    },
  });
}

export function useFavoriteStatus(templeId: string) {
  return useQuery<{ isFavorited: boolean }>({
    queryKey: ['favorites', templeId],
    queryFn: async () => {
      if (!templeId) return { isFavorited: false };
      try {
        const response = await apiClient.get(`/favorites/${templeId}`);
        return response.data;
      } catch (error: any) {
        // If not authenticated, the request will fail, just default to false
        return { isFavorited: false };
      }
    },
    enabled: !!templeId,
    retry: false,
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (templeId: string) => {
      const response = await apiClient.post(`/favorites/${templeId}`);
      return response.data;
    },
    onMutate: async (templeId) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['favorites', templeId] });

      // Snapshot the previous value
      const previousStatus = queryClient.getQueryData(['favorites', templeId]);

      // Optimistically update to the new value
      queryClient.setQueryData(['favorites', templeId], { isFavorited: true });

      // Return a context object with the snapshotted value
      return { previousStatus, templeId };
    },
    onError: (err, newTodo, context) => {
      if (context?.previousStatus) {
        queryClient.setQueryData(['favorites', context.templeId], context.previousStatus);
      }
    },
    onSettled: (data, error, templeId) => {
      queryClient.invalidateQueries({ queryKey: ['favorites', templeId] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (templeId: string) => {
      const response = await apiClient.delete(`/favorites/${templeId}`);
      return response.data;
    },
    onMutate: async (templeId) => {
      await queryClient.cancelQueries({ queryKey: ['favorites', templeId] });
      const previousStatus = queryClient.getQueryData(['favorites', templeId]);
      queryClient.setQueryData(['favorites', templeId], { isFavorited: false });
      return { previousStatus, templeId };
    },
    onError: (err, newTodo, context) => {
      if (context?.previousStatus) {
        queryClient.setQueryData(['favorites', context.templeId], context.previousStatus);
      }
    },
    onSettled: (data, error, templeId) => {
      queryClient.invalidateQueries({ queryKey: ['favorites', templeId] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}
