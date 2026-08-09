import { Metadata } from 'next';
import { StatCards } from '@/features/admin-dashboard/components/stat-cards';
import { QuickActions } from '@/features/admin-dashboard/components/quick-actions';
import { RecentActivity } from '@/features/admin-dashboard/components/recent-activity';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Darshan',
  description: 'Overview of Darshan On The Go platform',
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-heading font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome to the admin control panel. Here is a quick snapshot of the platform.
        </p>
      </div>
      
      <StatCards />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <QuickActions />
        </div>
        <div className="lg:col-span-3">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
