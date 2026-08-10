'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { useFavoriteStatus, useAddFavorite, useRemoveFavorite } from '../hooks/use-favorites';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface FavoriteButtonProps {
  templeId: string;
  className?: string;
  variant?: 'default' | 'icon' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function FavoriteButton({ templeId, className, variant = 'outline', size = 'default' }: FavoriteButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
  const isAuthenticated = !!currentUser;

  const { data: statusData, isLoading: isStatusLoading } = useFavoriteStatus(templeId);
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const isFavorited = statusData?.isFavorited || false;
  const isPending = addFavorite.isPending || removeFavorite.isPending;

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isUserLoading) return;

    if (!isAuthenticated) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    if (isFavorited) {
      removeFavorite.mutate(templeId, {
        onError: () => {
          toast.error("Failed to remove favorite.");
        }
      });
    } else {
      addFavorite.mutate(templeId, {
        onError: () => {
          toast.error("Failed to add favorite.");
        }
      });
    }
  };

  if (variant === 'icon') {
    return (
      <div
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 w-10",
          "rounded-full transition-colors hover:bg-background/80 backdrop-blur-sm cursor-pointer",
          isFavorited ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground",
          (isStatusLoading || isPending) && "opacity-50 pointer-events-none",
          className
        )}
        onClick={handleToggleFavorite}
        title={isFavorited ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart className={cn("w-5 h-5", isFavorited && "fill-current")} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 cursor-pointer border bg-background hover:bg-accent hover:text-accent-foreground",
        "gap-2 transition-all",
        isFavorited && "text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:hover:bg-red-950/30",
        (isStatusLoading || isPending) && "opacity-50 pointer-events-none",
        className
      )}
      onClick={handleToggleFavorite}
    >
      <Heart className={cn("w-4 h-4 transition-transform", isFavorited && "fill-current scale-110")} />
      {isFavorited ? "Favorited" : "Add to Favorites"}
    </div>
  );
}
