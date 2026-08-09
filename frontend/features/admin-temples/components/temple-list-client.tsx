'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminTemples } from '../hooks/use-admin-temples';
import { templeService } from '../services/temples.service';
import { TempleTable } from './temple-table';
import { TempleFilters as Filters } from './temple-filters';
import { TempleTableSkeleton } from './temple-table-skeleton';
import { DeleteTempleDialog } from './delete-temple-dialog';
import { EmptyState } from '@/components/shared/empty-state';
import { TempleAdmin, TempleFilters as FiltersType } from '../types';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import Link from 'next/link';

export function TempleListClient() {
  const [filters, setFilters] = useState<FiltersType>({
    search: '',
    state: 'all',
    category: 'all',
    status: 'all',
    liveStatus: 'all',
  });
  
  const [page, setPage] = useState(1);
  const limit = 5;
  
  const { data, isLoading, refetch } = useAdminTemples(filters, page, limit);
  
  const [templeToDelete, setTempleToDelete] = useState<TempleAdmin | null>(null);

  const totalPages = Math.ceil(data.total / limit);

  const router = useRouter();

  // Handlers for Temple Actions
  const handleView = (temple: TempleAdmin) => {
    router.push(`/admin/temples/${temple.id}`);
  };

  const handleEdit = (temple: TempleAdmin) => {
    router.push(`/admin/temples/${temple.id}/edit`);
  };

  const handleToggleActive = (temple: TempleAdmin) => {
    toast.success(`Temple ${temple.isActive ? 'deactivated' : 'activated'} successfully`);
  };

  const handleDelete = (temple: TempleAdmin) => {
    setTempleToDelete(temple);
  };

  const confirmDelete = async () => {
    if (!templeToDelete) return;
    try {
      await templeService.deleteTemple(templeToDelete.id);
      toast.success('Temple deleted successfully');
      setTempleToDelete(null);
      refetch();
    } catch (error) {
      toast.error('Failed to delete temple');
    }
  };

  const handleFilterChange = (newFilters: FiltersType) => {
    setFilters(newFilters);
    setPage(1); // Reset to page 1 on new filter
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Temple Management</h1>
          <p className="text-muted-foreground mt-1">Manage and oversee all temples on the platform.</p>
        </div>
        
        <Link href="/admin/temples/new">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Temple
          </Button>
        </Link>
      </div>

      <Filters filters={filters} onFilterChange={handleFilterChange} />

      <div className="mt-4">
        {isLoading ? (
          <TempleTableSkeleton />
        ) : data.temples.length > 0 ? (
          <>
            <TempleTable 
              temples={data.temples} 
              onView={handleView}
              onEdit={handleEdit}
              onToggleActive={handleToggleActive}
              onDelete={handleDelete}
            />
            
            {totalPages > 1 && (
              <div className="mt-4 flex justify-end">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (page > 1) setPage(page - 1);
                        }}
                        className={page === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink 
                          href="#"
                          isActive={page === i + 1}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(i + 1);
                          }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (page < totalPages) setPage(page + 1);
                        }}
                        className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon={Building2}
            title="No temples found"
            description="We couldn't find any temples matching your current filters. Try adjusting your search or add a new temple."
            action={{
              label: "Clear Filters",
              onClick: () => handleFilterChange({ search: '', state: 'all', category: 'all', status: 'all', liveStatus: 'all' })
            }}
          />
        )}
      </div>

      <DeleteTempleDialog 
        isOpen={!!templeToDelete}
        temple={templeToDelete}
        onClose={() => setTempleToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
