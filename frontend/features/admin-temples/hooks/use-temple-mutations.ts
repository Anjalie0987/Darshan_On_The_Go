import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { templeService } from '../services/temples.service';
import { TempleFormValues } from '../components/temple-form';

export function useTempleMutations() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const createTemple = async (data: TempleFormValues) => {
    setIsLoading(true);
    try {
      await templeService.createTemple(data);
      toast.success('Temple created successfully');
      router.push('/admin/temples');
      router.refresh();
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.error?.message || error.response?.data?.message || 'Failed to create temple';
      toast.error(msg);
      throw error;
    }
  };

  const updateTemple = async (id: string, data: TempleFormValues) => {
    setIsLoading(true);
    try {
      await templeService.updateTemple(id, data);
      toast.success('Temple updated successfully');
      router.push('/admin/temples');
      router.refresh();
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.error?.message || error.response?.data?.message || 'Failed to update temple';
      toast.error(msg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createTemple,
    updateTemple,
    isLoading
  };
}
