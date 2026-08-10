import { 
  HeroSection, 
  LiveDarshanSection, 
  PopularTemplesSection, 
  UpcomingAartisSection, 
  WhyChooseUsSection, 
  CTASection 
} from '@/features/home/components';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <LiveDarshanSection />
      <PopularTemplesSection />
      <UpcomingAartisSection />
      <WhyChooseUsSection />
      <CTASection />
    </div>
  );
}
