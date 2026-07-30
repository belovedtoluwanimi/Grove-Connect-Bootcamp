import Link from 'next/link';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';

export function HomeFooter() {
  return (
    <footer className="bg-[#0c0c0e] border-t border-zinc-800/80 pt-16 pb-12 px-4 sm:px-6 text-zinc-400">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand Info */}
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-2 text-lg font-black tracking-tight">
            <span className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-zinc-950 font-black text-base shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              G
            </span>
            <span className="text-white">Grove</span>
            <span className="text-emerald-400">Connect</span>
          </Link>
          <p className="mt-4 text-xs text-zinc-400 leading-relaxed">
            Empowering kids and teenagers with future-ready tech skills in software development, UI/UX, AI, and cybersecurity.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-white mb-4">
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-xs font-medium">
            <li>
              <Link href="#courses" className="hover:text-emerald-400 transition-colors">
                Bootcamp Tracks
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-emerald-400 transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/instructors" className="hover:text-emerald-400 transition-colors">
                Instructors
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-emerald-400 transition-colors">
                Student Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Tracks */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-white mb-4">
            Tracks
          </h4>
          <ul className="space-y-2.5 text-xs font-medium">
            <li className="hover:text-emerald-400 cursor-pointer transition-colors">Full-Stack Development</li>
            <li className="hover:text-emerald-400 cursor-pointer transition-colors">UI/UX Product Design</li>
            <li className="hover:text-emerald-400 cursor-pointer transition-colors">Python & Data Science</li>
            <li className="hover:text-emerald-400 cursor-pointer transition-colors">Cloud & Cyber Security</li>
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-white mb-4">
            Contact
          </h4>
          <ul className="space-y-3 text-xs font-medium">
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>hello@groveconnect.org</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>+234 800 GROVE CONNECT</span>
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Nigeria & Remote Operations</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
        <p>© 2026 Grove Connect. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Built with <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" /> for the next generation.
        </p>
      </div>
    </footer>
  );
}