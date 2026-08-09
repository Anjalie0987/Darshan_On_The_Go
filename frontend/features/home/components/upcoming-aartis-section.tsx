import { AartiCard } from '@/components/shared/cards';
import { MOCK_AARTIS } from '@/lib/mock-data';
import { BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function UpcomingAartisSection() {
  return (
    <section className="py-16 bg-background relative overflow-hidden">
      {/* Decorative bg element */}
      <div className="absolute right-0 top-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-accent/5 blur-[100px] -z-10" />

      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-8">
          <div className="max-w-xl">
            <h2 className="text-3xl font-heading font-bold tracking-tight mb-2">Today's Sacred Aartis</h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Never miss a daily ritual. View schedules and get notified before the Aarti begins.
            </p>
          </div>
          <Button variant="outline" className="shrink-0 group">
            <BellRing className="w-4 h-4 mr-2 group-hover:animate-ping" />
            Manage Alerts
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_AARTIS.map((aarti) => (
            <AartiCard key={aarti.id} {...aarti} />
          ))}
        </div>
      </div>
    </section>
  );
}
