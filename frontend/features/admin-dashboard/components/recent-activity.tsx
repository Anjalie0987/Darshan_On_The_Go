'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Loader2 } from 'lucide-react';
import { templeService } from '@/features/admin-temples/services/temples.service';

export function RecentActivity() {
  const [recentTemples, setRecentTemples] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const data = await templeService.getRecentActivity();
        setRecentTemples(data || []);
      } catch (error) {
        console.error('Failed to fetch recent activity', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecentActivity();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'live':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'offline':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <Card className="col-span-1 h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest temples added to the platform</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : recentTemples.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No recent activity
          </div>
        ) : (
          <div className="space-y-6">
            {recentTemples.map((temple) => (
              <div key={temple.id} className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-full mr-4 flex-shrink-0">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1 min-w-0">
                  <p className="text-sm font-medium leading-none truncate">
                    {temple.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(temple.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <Badge variant="secondary" className={`ml-auto ${getStatusColor(temple.status)}`}>
                  {temple.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
