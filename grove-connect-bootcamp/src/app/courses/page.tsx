'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Code,
  Palette,
  Cpu,
  Play,
  ArrowRight,
  Search,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/clients';

const COURSES = [
  {
    id: 'fullstack-kids',
    icon: Code,
    title: 'Full-Stack Web Engineering',
    badge: 'Popular',
    category: 'Software Engineering',
    color: 'from-emerald-500/20 to-teal-500/10',
    borderColor: 'hover:border-emerald-500/60',
    iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    desc: 'Build real websites and web apps using HTML, CSS, JavaScript & React. Perfect for kids who want to launch their own digital ideas.',
    highlights: [
      'Frontend & Web Layouts',
      'JavaScript Fundamentals',
      'Interactive Web Apps',
      'Portfolio Deployment',
    ],
    ageGroup: 'teens',
    age: 'Ages 10–18',
    price: '₦20,000',
  },
  {
    id: 'uiux-kids',
    icon: Palette,
    title: 'Graphic & Product Design',
    badge: 'Creative',
    category: 'UI/UX & Design',
    color: 'from-purple-500/20 to-pink-500/10',
    borderColor: 'hover:border-purple-500/60',
    iconBg: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    desc: 'Design mobile apps, logos, and prototypes using Figma and modern design principles to bring creative visual concepts to life.',
    highlights: [
      'UI/UX & Wireframing',
      'Figma Masterclass',
      'Color & Typography Theory',
      'Brand Identity Creation',
    ],
    ageGroup: 'kids',
    age: 'Ages 10–18',
    price: '₦15,000',
  },
  {
    id: 'python-ai',
    icon: Cpu,
    title: 'Python AI & Data Science',
    badge: 'Hot Track',
    category: 'Artificial Intelligence',
    color: 'from-amber-500/20 to-orange-500/10',
    borderColor: 'hover:border-amber-500/60',
    iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    desc: 'Learn Python programming, data analytics, and build machine learning bots. Ideal for students interested in future-tech and AI.',
    highlights: [
      'Python Syntax & Logic',
      'Data Visualization',
      'Intro to AI & Machine Learning',
      'Chatbot Construction',
    ],
    ageGroup: 'teens',
    age: 'Ages 12–18',
    price: '₦20,000',
  },
  {
    id: 'video-editing',
    icon: Play,
    title: 'Video Editing & Content Creation',
    badge: 'Media',
    category: 'Digital Media',
    color: 'from-cyan-500/20 to-blue-500/10',
    borderColor: 'hover:border-cyan-500/60',
    iconBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    desc: 'Master visual storytelling, timeline editing, color grading, sound design, and special effects for YouTube and digital platforms.',
    highlights: [
      'Video Cut & Transition Effects',
      'Audio & Sound Enhancement',
      'Color Grading Fundamentals',
      'Content Production Workflows',
    ],
    ageGroup: 'teens',
    age: 'Ages 12–18',
    price: '₦20,000',
  },
];

const FAQS = [
  {
    q: 'Do students need prior coding or design experience?',
    a: 'No prior experience is required! All our tracks start with foundational concepts before moving into project-based learning.',
  },
  {
    q: 'What hardware or software is needed for the classes?',
    a: 'A working laptop or computer with a stable internet connection and a modern browser (Google Chrome or Firefox) is all that is required.',
  },
  {
    q: 'Will students receive a certificate upon completion?',
    a: 'Yes, every student who completes their track project receives a verified digital certificate from Grove Connect.',
  },
];

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [user, setUser] = useState<any>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, [supabase]);

  // Filter courses based on search query and age filter
  const filteredCourses = COURSES.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAge =
      selectedAge === 'all' ||
      (selectedAge === '10-14' && (course.ageGroup === 'kids' || course.ageGroup === 'teens')) ||
      (selectedAge === '12-18' && course.ageGroup === 'teens');

    return matchesSearch && matchesAge;
  });

  const enrollUrl = user ? '/dashboard/course-selection' : '/login';

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-emerald-500 selection:text-zinc-950 overflow-x-hidden">
      {/* Background Decorative Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none -z-0" />

      {/* Header Banner */}
      <section className="relative z-10 pt-16 pb-12 px-4 sm:px-6 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
          <Sparkles className="w-4 h-4" /> Practical Hands-On Learning
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
          Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">Tech Bootcamps</span>
        </h1>

        <p className="mt-4 text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Comprehensive learning tracks designed to transform young learners into tech creators, software engineers, and digital designers.
        </p>

        {/* Search & Filter Bar */}
        <div className="mt-10 max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-3 bg-[#121216] p-2.5 rounded-2xl border border-zinc-800 shadow-2xl">
          <div className="relative w-full flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search courses (e.g. Python, Web, Video, Figma)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setSelectedAge('all')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all w-full sm:w-auto ${
                selectedAge === 'all'
                  ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              All Ages
            </button>
            <button
              onClick={() => setSelectedAge('10-14')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all w-full sm:w-auto ${
                selectedAge === '10-14'
                  ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              Ages 10–14
            </button>
            <button
              onClick={() => setSelectedAge('12-18')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all w-full sm:w-auto ${
                selectedAge === '12-18'
                  ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              Ages 12–18
            </button>
          </div>
        </div>
      </section>

      {/* Course Cards Grid */}
      <section className="py-10 px-4 sm:px-6 max-w-6xl mx-auto">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16 bg-[#121216] border border-zinc-800 rounded-3xl max-w-md mx-auto">
            <Search className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No courses matched your search</h3>
            <p className="text-xs text-zinc-500 mt-1">Try searching for a different keyword or filter.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedAge('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs text-emerald-400 font-bold transition-all"
            >
              Reset Search Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredCourses.map((course) => {
              const Icon = course.icon;
              return (
                <div
                  key={course.id}
                  className={`relative bg-gradient-to-br ${course.color} bg-[#121216] border border-zinc-800 rounded-3xl p-6 sm:p-8 transition-all duration-300 ${course.borderColor} hover:-translate-y-1 flex flex-col justify-between group shadow-xl`}
                >
                  <div>
                    {/* Top Row: Icon, Category & Age */}
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${course.iconBg}`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                          {course.badge}
                        </span>
                        <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-300 bg-zinc-900/90 px-3 py-1 rounded-full border border-zinc-700">
                          {course.age}
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-zinc-500 block mb-1">
                      {course.category}
                    </span>
                    <h2 className="text-2xl font-black text-white">{course.title}</h2>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-3 leading-relaxed">{course.desc}</p>

                    {/* What You'll Learn Highlights */}
                    <div className="mt-6 pt-5 border-t border-zinc-800/60">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-3">
                        Key Learning Outcomes:
                      </p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-400">
                        {course.highlights.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Bottom Tuition & Enroll Row */}
                  <div className="mt-8 pt-6 border-t border-zinc-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-zinc-500 block">Tuition Fee</span>
                      <span className="text-2xl font-black text-white">{course.price}</span>
                    </div>

                    <Link
                      href={enrollUrl}
                      className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                    >
                      Enroll Student <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white mt-3">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className="bg-[#121216] border border-zinc-800 rounded-2xl overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-zinc-200 hover:text-white"
              >
                <span className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-500 transition-transform ${
                    openFaq === index ? 'rotate-180 text-emerald-400' : ''
                  }`}
                />
              </button>

              {openFaq === index && (
                <div className="px-5 pb-5 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}