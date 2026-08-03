import Link from 'next/link';
import { HeroSection } from '@/components/home/HeroSection';
import { PartnerLogos } from '@/components/home/PartnerLogos';
import { FeaturedCourses } from '@/components/home/FeaturedCourses';
import { CallToAction } from '@/components/home/CallToAction';
import { HomeFooter } from '@/components/home/HomeFooter';
import { Header } from '@/components/home/Header';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-emerald-500 selection:text-zinc-950 overflow-x-hidden">
      {/* Background Decorative Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none -z-0" />

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-800/80">
        <Header />
      </header>

      {/* Main Sections */}
      <main>
        <HeroSection />
        <PartnerLogos />
        <FeaturedCourses />
        <CallToAction />
      </main>

      {/* Footer */}
      <HomeFooter />
    </div>
  );
}