import { ShieldCheck, Video, Heart, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const FEATURES = [
  {
    icon: <Video className="w-6 h-6 text-primary" />,
    title: 'HD Live Streams',
    description: 'Experience crystal clear, uninterrupted live darshans from major temples directly on your device.'
  },
  {
    icon: <Clock className="w-6 h-6 text-primary" />,
    title: 'Daily Aarti Alerts',
    description: 'Never miss a sacred moment. Get notified precisely before daily rituals and festivals begin.'
  },
  {
    icon: <Heart className="w-6 h-6 text-primary" />,
    title: 'Save Favorites',
    description: 'Create your personal spiritual dashboard by bookmarking your most revered temples.'
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-primary" />,
    title: 'Ad-Free Premium',
    description: 'A completely serene, distraction-free environment dedicated purely to your devotion.'
  }
];

export function WhyChooseUsSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-heading font-bold tracking-tight mb-4">A Modern Platform for Ancient Devotion</h2>
          <p className="text-muted-foreground text-sm md:text-base">
            We bridge the gap between physical distance and spiritual presence through elegant technology.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => (
            <Card key={i} className="bg-muted/10 border-none shadow-none text-center hover:bg-muted/30 transition-colors">
              <CardContent className="pt-6 p-6 flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="font-heading font-semibold text-lg">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
