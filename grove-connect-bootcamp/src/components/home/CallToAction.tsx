import Link from 'next/link';
import { Rocket, Sparkles } from 'lucide-react';

export function CallToAction() {
  return (
    <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 p-8 sm:p-14 text-center overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.25)]">
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-zinc-950/20 backdrop-blur-md px-4 py-1.5 rounded-full text-zinc-950 text-xs font-black uppercase mb-4">
            <Sparkles className="w-4 h-4 fill-zinc-950" /> Limited Seats Available
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight leading-tight">
            Ready to Build Your Child's Digital Future?
          </h2>

          <p className="mt-4 text-zinc-900 text-sm sm:text-base font-semibold">
            Join hundreds of young innovators in our upcoming cohort. Flexible weekend and weekday slots available!
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              href="/login"
              className="px-8 py-4 rounded-2xl bg-zinc-950 hover:bg-zinc-900 text-white font-black text-base flex items-center gap-3 shadow-2xl hover:scale-105 transition-all"
            >
              <Rocket className="w-5 h-5 text-emerald-400" /> Start Enrollment Today
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}