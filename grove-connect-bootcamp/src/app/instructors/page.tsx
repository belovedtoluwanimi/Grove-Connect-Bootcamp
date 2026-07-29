import Link from 'next/link';
import {
  Sparkles,
  Code2,
  Palette,
  Database,
  Cloud,
  CheckCircle2,
  Award,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

const INSTRUCTORS = [
  {
    name: 'Alex Turner',
    role: 'Lead Full-Stack Instructor',
    experience: '8+ Yrs Experience',
    specialty: 'React, Next.js, Node.js & PostgreSQL',
    bio: 'Former Senior Frontend Engineer. Passionate about breaking down complex web architecture into fun, actionable projects for teens.',
    skills: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'],
    track: 'Full-Stack Web Dev',
    icon: Code2,
  },
  {
    name: 'Sarah Chen',
    role: 'Head of UI/UX Product Design',
    experience: '6+ Yrs Experience',
    specialty: 'Figma, Design Systems & Prototyping',
    bio: 'Product Designer with experience leading UX across top tech startups. Teaches creative thinking and user-centric design principles.',
    skills: ['Figma', 'Wireframing', 'UI Design', 'Design Systems'],
    track: 'UI/UX Design',
    icon: Palette,
  },
  {
    name: 'David Adeleke',
    role: 'Data Science & AI Educator',
    experience: '7+ Yrs Experience',
    specialty: 'Python, SQL & Machine Learning Fundamentals',
    bio: 'Data Scientist and researcher focused on introducing young minds to data visualization, algorithms, and practical AI models.',
    skills: ['Python', 'SQL', 'Data Analytics', 'Machine Learning'],
    track: 'Data Science & AI',
    icon: Database,
  },
  {
    name: 'Michael Vance',
    role: 'Cloud & DevOps Specialist',
    experience: '9+ Yrs Experience',
    specialty: 'AWS, Docker & Cybersecurity Fundamentals',
    bio: 'Certified Cloud Solutions Architect dedicated to teaching students network safety, cloud deployment pipelines, and Linux basics.',
    skills: ['AWS', 'Docker', 'Linux', 'Cybersecurity'],
    track: 'Cloud Engineering',
    icon: Cloud,
  },
];

export default function InstructorsPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-emerald-500 selection:text-zinc-950">
      {/* Background Decorative Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none -z-0" />

      {/* Navigation Header */}
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
            <Link href="/instructors" className="text-emerald-400 font-semibold">
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

      {/* Hero Header Section */}
      <section className="relative z-10 pt-20 pb-12 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5" /> World-Class Tech Mentors
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Learn directly from <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
            Industry Engineers & Creators
          </span>
        </h1>

        <p className="mt-6 text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Our mentors are active software engineers, designers, and system architects who bring real-world production experience into live interactive sessions.
        </p>
      </section>

      {/* Instructors Grid */}
      <section className="py-12 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {INSTRUCTORS.map((instructor, idx) => {
            const TrackIcon = instructor.icon;
            return (
              <div
                key={idx}
                className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-emerald-500/40 transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg">
                        {instructor.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {instructor.name}
                        </h3>
                        <p className="text-xs text-zinc-400 font-medium">{instructor.role}</p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      {instructor.experience}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                    {instructor.bio}
                  </p>

                  <div className="mb-4">
                    <span className="text-[11px] font-semibold text-zinc-500 block mb-2 uppercase tracking-wider">
                      Core Stack & Skills
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {instructor.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[10px] font-medium text-zinc-300 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                  <div className="flex items-center gap-2">
                    <TrackIcon className="w-4 h-4 text-emerald-400" />
                    <span className="font-medium text-zinc-300">{instructor.track}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-zinc-500">Verified Mentor</span>
                  </div>
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
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Give your child mentorship from top engineers
            </h2>
            <p className="text-zinc-400 text-sm mt-2 max-w-lg mx-auto">
              Small cohort sizes ensure 1-on-1 feedback and personalized project guidance.
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