import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-white/5 blur-[80px]" />
      <div className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-white/5 blur-[80px]" />

      <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-primary-foreground tracking-tight">
            Take Your Devotion Anywhere
          </h2>
          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl">
            Join the Darshan On The Go community today. Create an account to save your favorite temples, set aarti reminders, and experience premium live streams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
            <Button size="lg" variant="secondary" className="px-8 font-semibold w-full sm:w-auto">
              Create Free Account
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
