'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Activity, WifiOff, PlusCircle } from 'lucide-react';
import { templeService } from '@/features/admin-temples/services/temples.service';

export function StatCards() {
  const [statsData, setStatsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await templeService.getDashboardStats();
        console.log('Dashboard Stats Data:', data);
        setStatsData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    {
      title: 'Total Temples',
      value: statsData?.totalTemples || 0,
      description: 'Total registered temples',
      icon: Building2,
      color: 'text-blue-500',
    },
    {
      title: 'Live Temples',
      value: statsData?.liveTemples || 0,
      description: 'Currently broadcasting',
      icon: Activity,
      color: 'text-green-500',
    },
    {
      title: 'Offline Temples',
      value: statsData?.offlineTemples || 0,
      description: 'Stream offline',
      icon: WifiOff,
      color: 'text-destructive',
    },
    {
      title: 'Newly Added',
      value: statsData?.newlyAdded || 0,
      description: 'In the last 30 days',
      icon: PlusCircle,
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-full bg-muted/50 ${stat.color}`}>
              <stat.icon className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-16 bg-muted animate-pulse rounded" />
            ) : (
              <div className="text-2xl font-bold font-heading">{stat.value}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
