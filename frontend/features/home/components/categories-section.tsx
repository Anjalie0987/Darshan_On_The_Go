import { CategoryCard } from '@/components/shared/cards';
import { MOCK_CATEGORIES } from '@/lib/mock-data';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export function CategoriesSection() {
  return (
    <section className="py-12 bg-background border-y border-border/50">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-xl font-heading font-semibold mb-6">Browse by Deity</h2>
        
        <ScrollArea className="w-full whitespace-nowrap pb-4">
          <div className="flex w-max space-x-4">
            {MOCK_CATEGORIES.map((cat) => (
              <CategoryCard key={cat.id} name={cat.name} image={cat.image} />
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="hidden md:flex" />
        </ScrollArea>
      </div>
    </section>
  );
}
