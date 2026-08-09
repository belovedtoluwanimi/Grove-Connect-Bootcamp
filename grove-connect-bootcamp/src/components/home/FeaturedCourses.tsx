import Link from 'next/link';
import { Code, Palette, Cpu, ShieldAlert, ArrowRight, Zap, Play } from 'lucide-react';

const COURSES = [
  {
    id: 'fullstack-kids',
    icon: Code,
    title: 'Full-Stack Web Engineering',
    badge: 'Popular',
    color: 'from-emerald-500/20 to-teal-500/10',
    borderColor: 'hover:border-emerald-500/60',
    iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    desc: 'Build real websites and web apps using HTML, CSS, JavaScript & React.',
   
    price: '₦20,000',
  },
  {
    id: 'uiux-kids',
    icon: Palette,
    title: 'Graphic & Product Design',
    badge: 'Creative',
    color: 'from-purple-500/20 to-pink-500/10',
    borderColor: 'hover:border-purple-500/60',
    iconBg: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    desc: 'Design mobile apps and prototypes using Figma and modern design principles.',
   
    price: '₦20,000',
  },
  {
    id: 'python-ai',
    icon: Cpu,
    title: 'Python AI & Data Science',
    badge: 'Hot Track',
    color: 'from-amber-500/20 to-orange-500/10',
    borderColor: 'hover:border-amber-500/60',
    iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    desc: 'Learn Python programming, data analytics, and build machine learning bots.',
    
    price: '₦20,000',
  },
  {
    id: 'video-editing',
    icon: Play,
    title: 'Video Editing',
    badge: 'Essential',
    color: 'from-cyan-500/20 to-blue-500/10',
    borderColor: 'hover:border-cyan-500/60',
    iconBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    desc: 'Master network safety, ethical hacking concepts, and cloud tools.',
   
    price: '₦20,000',
  },
];

export function FeaturedCourses() {
  return (
    <section id="courses" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          Curriculum Built for everyone inclusive
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-white mt-4 tracking-tight">
          Pick Your Tech Pathway
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base mt-3">
          Step-by-step tracks designed to teach high-demand skills through game development and live projects.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {COURSES.map((course) => {
          const Icon = course.icon;
          return (
            <div
              key={course.id}
              className={`relative bg-gradient-to-br ${course.color} bg-[#121216] border border-zinc-800 rounded-3xl p-8 transition-all duration-300 ${course.borderColor} hover:-translate-y-1 flex flex-col justify-between group`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${course.iconBg}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                </div>

                <h3 className="text-2xl font-black text-white">{course.title}</h3>
                <p className="text-sm text-zinc-400 mt-3 leading-relaxed">{course.desc}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block">Tuition Fee</span>
                  <span className="text-xl font-black text-white">{course.price}</span>
                </div>

                <Link
                  href="/login"
                  className="px-5 py-2.5 rounded-xl bg-zinc-100 hover:bg-emerald-400 hover:text-zinc-950 text-zinc-900 font-black text-xs flex items-center gap-2 transition-all shadow-md"
                >
                  Enroll <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}