import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  location: string;
  text: string;
  rating: number;
  avatar: string;
}

export function TestimonialCard({ name, location, text, rating, avatar }: TestimonialCardProps) {
  return (
    <Card className="h-full bg-card hover:shadow-md transition-shadow">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-accent fill-accent' : 'text-muted'}`} />
          ))}
        </div>
        <p className="text-muted-foreground text-sm flex-1 mb-6 leading-relaxed">"{text}"</p>
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border border-border">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{name}</span>
            <span className="text-xs text-muted-foreground">{location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
