import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Code,
  Palette,
  Database,
  Cloud,
  CheckCircle2,
  Users,
  Award,
  ShieldCheck,
} from 'lucide-react';

const TRACKS = [
  {
    icon: Code,
    title: 'Full-Stack Web Dev',
    desc: 'Master HTML, CSS, JavaScript, React & Node.js through real projects.',
    age: 'Ages 10–18',
  },
  {
    icon: Palette,
    title: 'UI/UX Product Design',
    desc: 'Learn wireframing, color theory, and prototyping in Figma.',
    age: 'Ages 10–18',
  },
  {
    icon: Database,
    title: 'Data Science & Python',
    desc: 'Solve real-world problems using Python, data analysis, and AI.',
    age: 'Ages 12–18',
  },
  {
    icon: Cloud,
    title: 'Cloud & Cyber Security',
    desc: 'Understand network fundamentals, security, and cloud tools.',
    age: 'Ages 12–18',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-emerald-500 selection:text-zinc-950">
      {/* Background Decorative Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none -z-0" />

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <span className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-zinc-950 font-black text-base shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              G
            </span>
            <span className="text-white">Grove</span>
            <span className="text-emerald-400">Connect</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-400">
            <Link href="/about" className="hover:text-emerald-400 transition-colors">
              About Us
            </Link>
            <Link href="/instructors" className="hover:text-emerald-400 transition-colors">
              Instructors
            </Link>
            <Link href="/contact" className="hover:text-emerald-400 transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-zinc-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-md shadow-emerald-500/20 transition-all"
            >
              Enroll Kid
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5" /> Empowering Next-Gen Tech Talent
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Transform Your Child into a <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
            Tech Creator & Builder
          </span>
        </h1>

        <p className="mt-6 text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Interactive coding, design, and robotics bootcamps tailored for kids and teenagers. Guided by expert industry mentors in a safe, project-driven environment.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/about"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 font-semibold text-sm transition-all"
          >
            Learn More
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-6 pt-10 border-t border-zinc-800/80 max-w-3xl mx-auto">
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">1,200+</p>
            <p className="text-xs text-zinc-500 mt-1">Students Trained</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">98%</p>
            <p className="text-xs text-zinc-500 mt-1">Completion Rate</p>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="text-2xl sm:text-3xl font-extrabold text-white">15+</p>
            <p className="text-xs text-zinc-500 mt-1">Expert Mentors</p>
          </div>
        </div>
      </section>

      {/* Tracks Overview */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Bootcamp Tracks</h2>
          <p className="text-zinc-400 text-sm mt-2">
            Structured learning pathways tailored for different interest areas and skill levels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRACKS.map((track, i) => {
            const Icon = track.icon;
            return (
              <div
                key={i}
                className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 hover:border-emerald-500/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  {track.age}
                </span>
                <h3 className="font-bold text-lg text-white mt-3">{track.title}</h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{track.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-8 text-center text-xs text-zinc-500">
        <p>© 2026 Grove Connect. All rights reserved.</p>
      </footer>
    </div>
  );
}