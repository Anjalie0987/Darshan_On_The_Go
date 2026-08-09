'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { TempleForm, TempleFormValues } from '@/features/admin-temples/components/temple-form';
import { useTempleMutations } from '@/features/admin-temples/hooks/use-temple-mutations';

export default function NewTemplePage() {
  const { createTemple, isLoading } = useTempleMutations();

  const handleSubmit = async (data: TempleFormValues) => {
    await createTemple(data);
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
          <h1 className="text-3xl font-heading font-bold tracking-tight">Add New Temple</h1>
          <p className="text-muted-foreground mt-1">Register a new temple to the platform.</p>
        </div>
      </div>

      <TempleForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
