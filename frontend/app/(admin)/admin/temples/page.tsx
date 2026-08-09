import { Metadata } from 'next';
import { TempleListClient } from '@/features/admin-temples/components/temple-list-client';

export const metadata: Metadata = {
  title: 'Manage Temples | Admin Dashboard',
  description: 'View and manage all temples on Darshan On The Go',
};

export default function TemplesPage() {
  return <TempleListClient />;
}
