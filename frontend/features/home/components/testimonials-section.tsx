import { TestimonialCard } from '@/components/shared/cards';
import { MOCK_TESTIMONIALS } from '@/lib/mock-data';

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-muted/20 border-y border-border/50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-heading font-bold tracking-tight mb-4">What Our Community Says</h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Join thousands of devotees worldwide experiencing spiritual connectivity without boundaries.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_TESTIMONIALS.map((testimonial) => (
            <TestimonialCard key={testimonial.id} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
