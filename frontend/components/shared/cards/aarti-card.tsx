import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, Sparkles } from 'lucide-react';

interface AartiCardProps {
  templeName: string;
  title: string;
  time: string;
  festival?: string | null;
}

export function AartiCard({ templeName, title, time, festival }: AartiCardProps) {
  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-colors bg-card">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col gap-1">
            <h3 className="font-heading font-semibold text-base">{title}</h3>
            <span className="text-sm text-muted-foreground">{templeName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-primary bg-primary/10 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
            <Clock className="w-4 h-4" />
            {time}
          </div>
        </div>
        
        {festival && (
          <div className="flex items-center gap-1.5 text-xs text-accent-foreground font-medium bg-accent/20 px-2 py-1 rounded w-fit">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            {festival}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
