import { TempleDetailsView } from '@/features/admin-temples/components/temple-details-view';
import { templeService } from '@/features/admin-temples/services/temples.service';
import { notFound } from 'next/navigation';

interface TempleDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function TempleDetailsPage({ params }: TempleDetailsPageProps) {
  try {
    const temple = await templeService.getTempleById(params.id);
    
    if (!temple) {
      notFound();
    }
    
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <TempleDetailsView temple={temple} />
      </div>
    );
  } catch (error) {
    notFound();
  }
}
