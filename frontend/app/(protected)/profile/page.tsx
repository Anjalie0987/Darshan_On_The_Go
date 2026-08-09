'use client';

import { Suspense } from 'react';
import { useProfile, useUserSessions, useRevokeSession } from '@/features/users/hooks/use-profile';
import { useLogout } from '@/features/auth/hooks/use-logout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, Monitor, Smartphone, Globe, LogOut, Clock, CalendarDays, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
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

function ProfileContent() {
  const { data: profile, isLoading: isProfileLoading, isError: isProfileError } = useProfile();
  const { data: sessions, isLoading: isSessionsLoading } = useUserSessions();
  const { mutate: revokeSession } = useRevokeSession();
  const { mutate: logout, isPending: isLogoutPending } = useLogout();

  if (isProfileLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <Skeleton className="h-[200px] w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[150px] w-full rounded-xl" />
          <Skeleton className="h-[150px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (isProfileError || !profile) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center text-center">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Unable to load profile</h1>
        <p className="text-muted-foreground mb-6">There was a problem loading your profile information.</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  const initials = `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}` || profile.email[0].toUpperCase();
  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'User';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-screen space-y-8">
      {/* Header Profile Section */}
      <Card className="border-border/50 shadow-sm overflow-hidden bg-card">
        <div className="h-24 bg-primary/10"></div>
        <CardContent className="px-6 pt-0 pb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-12">
            <Avatar className="w-24 h-24 border-4 border-background shadow-sm">
              <AvatarFallback className="bg-primary/5 text-primary text-2xl font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1 mt-2 md:mt-0">
              <h1 className="text-2xl font-bold font-heading">{fullName}</h1>
              <p className="text-muted-foreground">{profile.email}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <CalendarDays className="w-4 h-4" />
                <span>Joined {format(new Date(profile.created_at), 'MMMM yyyy')}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 w-full md:w-auto">
              <Button 
                variant="outline" 
                className="w-full md:w-auto text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => logout()}
                disabled={isLogoutPending}
              >
                {isLogoutPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LogOut className="w-4 h-4 mr-2" />}
                Logout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Favorites Summary */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500 fill-current" />
              My Favorites
            </CardTitle>
            <CardDescription>Temples you have saved for quick access</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6 text-center">
            <div className="text-5xl font-bold text-foreground mb-4">{profile.favorites_count}</div>
            <p className="text-muted-foreground mb-6">Saved Temples</p>
            <Link href="/favorites">
              <Button className="w-full max-w-[200px]">View Favorites</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Sessions Summary */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-primary" />
              Active Sessions
            </CardTitle>
            <CardDescription>Devices currently logged into your account</CardDescription>
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
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-start justify-between p-3 rounded-lg border border-border bg-card/50">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-muted-foreground bg-muted p-2 rounded-full">
                        {getDeviceIcon(session.device_info?.os, session.device_info?.device)}
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-sm flex items-center gap-2">
                          {session.device_info?.os || 'Unknown OS'} • {session.device_info?.browser || 'Unknown Browser'}
                          {session.is_current && (
                            <span className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold">
                              Current
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <Globe className="w-3 h-3" />
                          {session.ip_address}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          Last active: {session.last_active_at ? (isNaN(new Date(session.last_active_at).getTime()) ? 'Unknown' : format(new Date(session.last_active_at), 'MMM d, h:mm a')) : 'Unknown'}
                        </p>
                      </div>
                    </div>
                    {!session.is_current && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-muted-foreground hover:text-destructive h-8 px-2"
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
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading profile...</p>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
