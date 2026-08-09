import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        {children}
      </main>
      <Footer />
    </div>
  );
}
