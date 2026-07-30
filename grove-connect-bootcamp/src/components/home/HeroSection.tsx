import Link from 'next/link';
import { Sparkles, ArrowRight, Play, Star, Rocket, ShieldCheck } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative z-10 pt-16 pb-20 px-4 sm:px-6 max-w-6xl mx-auto text-center">
      {/* Floating Sparkle Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-8 animate-pulse">
        <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
        <span>Summer Bootcamp Registration Open!</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.1]">
        Where Young Minds Build <br className="hidden sm:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
          The Next Big Thing
        </span> 🚀
      </h1>

      <p className="mt-6 text-zinc-300 text-base sm:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
        Fun, hands-on coding, product design, and AI bootcamps designed for kids & teens. 
        Turn screen time into valuable creator skills!
      </p>

      {/* Primary Action Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/login"
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-black text-base flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.35)] hover:scale-105 transition-all duration-200"
        >
          Enroll Student Now <ArrowRight className="w-5 h-5 stroke-[3]" />
        </Link>
        
        <Link
          href="#courses"
          className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-zinc-700/80 bg-zinc-900/80 hover:bg-zinc-800/80 text-zinc-200 font-bold text-base flex items-center justify-center gap-2 hover:border-emerald-500/50 transition-all"
        >
          <Play className="w-4 h-4 fill-emerald-400 text-emerald-400" /> Explore Courses
        </Link>
      </div>

      {/* Social Proof & Trust Badges */}
      <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 font-medium">
        <div className="flex items-center gap-2 bg-zinc-900/60 px-4 py-2 rounded-xl border border-zinc-800">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span><strong className="text-white">4.9/5 Rating</strong> from 500+ Parents</span>
        </div>

        <div className="flex items-center gap-2 bg-zinc-900/60 px-4 py-2 rounded-xl border border-zinc-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>100% Safe & Verified Instructors</span>
        </div>
      </div>
    </section>
  );
}