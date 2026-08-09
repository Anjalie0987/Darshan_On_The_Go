import { 
  HeroSection, 
  LiveDarshanSection, 
  PopularTemplesSection, 
  CategoriesSection, 
  UpcomingAartisSection, 
  WhyChooseUsSection, 
  CTASection 
} from '@/features/home/components';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <LiveDarshanSection />
      <CategoriesSection />
      <PopularTemplesSection />
      <UpcomingAartisSection />
      <WhyChooseUsSection />
      <CTASection />
    </div>
  );
}
