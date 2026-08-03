import Link from 'next/link';
import {
  Sparkles,
  Target,
  Users,
  Award,
  Zap,
  ShieldCheck,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Code2,
} from 'lucide-react';
import { Header } from '@/components/home/Header';

const VALUES = [
  {
    icon: Target,
    title: 'Project-First Learning',
    desc: 'We skip pure theory. Students build real web applications, digital designs, and scripts from week one.',
  },
  {
    icon: Users,
    title: '1-on-1 Mentorship',
    desc: 'Every student gets dedicated guidance from active software engineers and industry practitioners.',
  },
  {
    icon: ShieldCheck,
    title: 'Safe Environment',
    desc: 'A secure, moderated learning space crafted specifically for young minds to explore technology.',
  },
  {
    icon: Zap,
    title: 'Future-Ready Skills',
    desc: 'From full-stack development to AI concepts, our curriculum evolves with industry demands.',
  },
];

const STATS = [
  { value: '1,200+', label: 'Graduated Students' },
  { value: '98%', label: 'Parent Satisfaction Rate' },
  { value: '15+', label: 'Senior Industry Instructors' },
  { value: '4:1', label: 'Student-to-Mentor Ratio' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-emerald-500 selection:text-zinc-950">
      {/* Background Decorative Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none -z-0" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-800/80">
        <Header />
      </header>

      {/* Hero Header Section */}
      <section className="relative z-10 pt-20 pb-12 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5" /> Our Story & Mission
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Nurturing the Next Generation of <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
            Digital Innovators
          </span>
        </h1>

        <p className="mt-6 text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Grove Connect was founded to bridge the gap between early curiosity and real-world tech competence. We equip kids and teens with production-grade coding, design, and problem-solving skills.
        </p>
      </section>

      {/* Impact Stats Grid */}
      <section className="py-8 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#121215] border border-zinc-800/80">
          {STATS.map((stat, idx) => (
            <div key={idx} className="text-center p-3">
              <p className="text-2xl sm:text-3xl font-extrabold text-white">{stat.value}</p>
              <p className="text-xs text-zinc-500 mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Vision Split Card */}
      <section className="py-12 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-2xl bg-[#121215] border border-zinc-800/80 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white mb-3">Our Mission</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              To empower young learners with actionable technical skills, fostering creative confidence and logical reasoning so they transition from technology consumers to active technology creators.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#121215] border border-zinc-800/80 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
              <Code2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white mb-3">Our Vision</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              To build Africa&apos;s most impactful technology accelerator for kids and youth, raising a generation capable of engineering world-class software solutions for global challenges.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-12 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Why Grove Connect?</h2>
          <p className="text-zinc-400 text-sm mt-2">
            The core principles that drive our curriculum design and student experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {VALUES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#121215] border border-zinc-800/80 flex items-start gap-4 hover:border-emerald-500/30 transition-all"
              >
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex-shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{item.title}</h3>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#121215] to-[#09090b] border border-emerald-500/20 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Ready to start your child&apos;s journey?</h2>
            <p className="text-zinc-400 text-sm mt-2 max-w-lg mx-auto">
              Join hundreds of parents giving their children a head start in digital technology.
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                href="/login"
                className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
              >
                Enroll Kid Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-8 text-center text-xs text-zinc-500">
        <p>© 2026 Grove Connect. All rights reserved.</p>
      </footer>
    </div>
  );
}