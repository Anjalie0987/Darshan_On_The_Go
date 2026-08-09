'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { 
  ArrowLeft, Edit, AlertTriangle, Clock, 
  MapPin, Image as ImageIcon, Video
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { templeService } from '../services/temples.service';

export function TempleDetailsView({ temple: initialTemple }: { temple: any }) {
  const router = useRouter();
  const [temple, setTemple] = useState(initialTemple);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <Badge className="bg-green-500 hover:bg-green-600">Published</Badge>;
      case 'DRAFT':
        return <Badge variant="secondary">Draft</Badge>;
      case 'ARCHIVED':
        return <Badge variant="outline" className="text-muted-foreground">Archived</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push('/admin/temples')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{temple.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">{temple.slug}</span>
              <Separator orientation="vertical" className="h-4" />
              {getStatusBadge(temple.status)}
              {temple.isActive ? (
                <Badge variant="outline" className="border-green-200 text-green-600">Active</Badge>
              ) : (
                <Badge variant="outline" className="border-red-200 text-red-600">Inactive</Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-destructive hover:bg-destructive/10">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Deactivate
          </Button>
          <Button onClick={() => router.push(`/admin/temples/${temple.id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Temple
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Main details) */}
        <div className="lg:col-span-2 space-y-6">
          
          <Card>
            <CardHeader>
              <CardTitle>Temple Information</CardTitle>
              <CardDescription>Primary details and location.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                  <p className="text-sm">{temple.description || 'No description provided.'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Category</h4>
                  <p className="text-sm font-medium">{temple.category || 'N/A'}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">Location</h4>
                    <p className="text-sm text-muted-foreground">{temple.city}, {temple.state}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-muted-foreground" />
                YouTube Channel
              </CardTitle>
              <CardDescription>Connected official YouTube channel details.</CardDescription>
            </CardHeader>
            <CardContent>
              {temple.youtubeChannelUrl ? (
                <div className="flex flex-col p-4 border rounded-lg bg-muted/20">
                  <div className="flex-1 space-y-1">
                    <h4 className="text-base font-semibold">YouTube URL</h4>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                      <a href={temple.youtubeChannelUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate max-w-full">
                        {temple.youtubeChannelUrl}
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 border border-dashed rounded-lg text-muted-foreground">
                  <p>No YouTube channel connected.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Side details) */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Temple Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Cover Image</h4>
                <div className="w-full aspect-video rounded-md border bg-muted/50 flex items-center justify-center overflow-hidden">
                  <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                </div>
              </div>

            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="mt-0.5"><div className="w-2 h-2 rounded-full bg-primary" /></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Temple Created</p>
                    <p className="text-xs text-muted-foreground">
                      {temple.createdAt ? format(new Date(temple.createdAt), 'MMM d, yyyy h:mm a') : 'Unknown'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-0.5"><div className="w-2 h-2 rounded-full bg-muted-foreground/50" /></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Last Updated</p>
                    <p className="text-xs text-muted-foreground">
                      {temple.updatedAt ? format(new Date(temple.updatedAt), 'MMM d, yyyy h:mm a') : 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
      </div>
    </div>
  );
}
