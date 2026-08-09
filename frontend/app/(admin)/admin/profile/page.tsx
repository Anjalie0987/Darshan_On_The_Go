'use client';

import { Suspense } from 'react';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { useAdminSessions, useRevokeAdminSession } from '@/features/admin-auth/hooks/use-admin-sessions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Monitor, Smartphone, Globe, LogOut, Clock, CalendarDays, ShieldAlert, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

function getDeviceIcon(os?: string, device?: string) {
  if (!os && !device) return <Monitor className="w-5 h-5" />;
  const osLower = os?.toLowerCase() || '';
  const deviceLower = device?.toLowerCase() || '';
  if (osLower.includes('ios') || osLower.includes('android') || deviceLower.includes('mobile')) {
    return <Smartphone className="w-5 h-5" />;
  }
  return <Monitor className="w-5 h-5" />;
}

function AdminProfileContent() {
  const { admin, isLoading: isAuthLoading, logout } = useAdminAuth();
  const { data: sessions, isLoading: isSessionsLoading } = useAdminSessions();
  const { mutate: revokeSession, isPending: isRevoking } = useRevokeAdminSession();

  if (isAuthLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[200px] w-full rounded-xl" />
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <ShieldAlert className="w-12 h-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Unauthorized</h1>
        <p className="text-muted-foreground">You are not authorized to view this page.</p>
      </div>
    );
  }

  const initials = admin.name?.substring(0, 2).toUpperCase() || admin.email.substring(0, 2).toUpperCase();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your account and active sessions</p>
        </div>
      </div>

      {/* Header Profile Section */}
      <Card className="border-border shadow-sm overflow-hidden bg-card">
        <div className="h-24 bg-primary/5 border-b"></div>
        <CardContent className="px-6 pt-0 pb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-10">
            <Avatar className="w-24 h-24 border-4 border-background shadow-sm">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1 mt-2 md:mt-0">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold">{admin.name || 'Administrator'}</h2>
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md font-semibold tracking-wide uppercase">
                  {admin.role}
                </span>
              </div>
              <p className="text-muted-foreground">{admin.email}</p>
              {admin.created_at && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <CalendarDays className="w-4 h-4" />
                  <span>Joined {format(new Date(admin.created_at), 'MMMM d, yyyy')}</span>
                </div>
              )}
            </div>
            <div className="mt-4 md:mt-0 w-full md:w-auto">
              <Button 
                variant="outline" 
                className="w-full md:w-auto text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sessions Summary */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-primary" />
            Active Sessions
          </CardTitle>
          <CardDescription>Devices currently logged into your admin account</CardDescription>
        </CardHeader>
        <CardContent>
          {isSessionsLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full rounded-md" />
              <Skeleton className="h-16 w-full rounded-md" />
            </div>
          ) : !sessions || sessions.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No active sessions found.</p>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border bg-card/50 gap-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-muted-foreground bg-muted p-2 rounded-full flex-shrink-0">
                      {getDeviceIcon(session.device_info?.os, session.device_info?.device)}
                    </div>
                    <div className="space-y-1.5">
                      <p className="font-medium text-sm flex flex-wrap items-center gap-2">
                        {session.device_info?.os || 'Unknown OS'} • {session.device_info?.browser || 'Unknown Browser'}
                        {session.is_current && (
                          <span className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold">
                            Current Device
                          </span>
                        )}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5" />
                          {session.ip_address}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          Last active: {format(new Date(session.created_at), 'MMM d, yyyy h:mm a')}
                        </span>
                      </div>
                    </div>
                  </div>
                  {!session.is_current && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-muted-foreground hover:text-destructive shrink-0"
                      disabled={isRevoking}
                      onClick={() => {
                        revokeSession(session.id, {
                          onSuccess: () => toast.success('Session revoked successfully'),
                          onError: () => toast.error('Failed to revoke session')
                        });
                      }}
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminProfilePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading admin profile...</p>
      </div>
    }>
      <AdminProfileContent />
    </Suspense>
  );
}
