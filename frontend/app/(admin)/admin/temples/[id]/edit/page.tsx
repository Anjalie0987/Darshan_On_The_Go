'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { TempleForm, TempleFormValues } from '@/features/admin-temples/components/temple-form';
import { useTempleMutations } from '@/features/admin-temples/hooks/use-temple-mutations';
import { templeService } from '@/features/admin-temples/services/temples.service';
import { toast } from 'sonner';

export default function EditTemplePage() {
  const params = useParams();
  const id = params.id as string;
  const { updateTemple, isLoading: isUpdating } = useTempleMutations();
  const [initialData, setInitialData] = useState<Partial<TempleFormValues> | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchTemple = async () => {
      try {
        const response = await templeService.getTempleById(id);
        const data = response.data ? response.data : response;
        
        setInitialData({
          name: data.name,
          slug: data.slug,
          description: data.description,
          state: data.state,
          city: data.city,
          category: data.category,
          youtubeChannelUrl: data.youtubeChannelUrl || '',
          isActive: data.isActive,
        });
      } catch (error) {
        console.error(error);
        toast.error('Failed to load temple data');
        // Graceful fallback for development if backend API doesn't exist
        setInitialData({
          name: 'Example Temple',
          slug: 'example-temple',
          description: 'This is a fallback placeholder because the backend is unavailable.',
          state: 'Uttar Pradesh',
          city: 'Varanasi',
          category: 'Jyotirlinga',
          isActive: true
        });
      } finally {
        setIsFetching(false);
      }
    };

    if (id) {
      fetchTemple();
    }
  }, [id]);

  const handleSubmit = async (data: TempleFormValues) => {
    await updateTemple(id, data);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/admin/temples">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Edit Temple</h1>
          <p className="text-muted-foreground mt-1">Update details for the selected temple.</p>
        </div>
      </div>

      {isFetching ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : initialData ? (
        <TempleForm 
          initialData={initialData} 
          onSubmit={handleSubmit} 
          isLoading={isUpdating} 
        />
      ) : (
        <div className="flex h-64 flex-col items-center justify-center text-muted-foreground">
          <p>Could not load temple details.</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
