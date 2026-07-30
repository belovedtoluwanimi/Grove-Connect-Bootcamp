import Link from 'next/link';
import { HeroSection } from '@/components/home/HeroSection';
import { PartnerLogos } from '@/components/home/PartnerLogos';
import { FeaturedCourses } from '@/components/home/FeaturedCourses';
import { CallToAction } from '@/components/home/CallToAction';
import { HomeFooter } from '@/components/home/HomeFooter';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-emerald-500 selection:text-zinc-950 overflow-x-hidden">
      {/* Background Decorative Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none -z-0" />

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-black tracking-tight">
            <span className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-zinc-950 font-black text-base shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              G
            </span>
            <span className="text-white">Grove</span>
            <span className="text-emerald-400">Connect</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-zinc-400">
            <Link href="#courses" className="hover:text-emerald-400 transition-colors">
              Courses
            </Link>
            <Link href="/about" className="hover:text-emerald-400 transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-emerald-400 transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3 text-xs font-bold">
            <Link href="/login" className="px-4 py-2 rounded-xl text-zinc-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-lg shadow-emerald-500/20 transition-all"
            >
              Enroll Kid
            </Link>
          </div>
        </div>
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