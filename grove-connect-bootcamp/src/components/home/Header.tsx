'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/clients';
import { useInactivityTimeout } from '@/hooks/useInactivityTimeout';
import { User, LogOut, LayoutDashboard } from 'lucide-react';

export function Header() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // 2. Listen for auth changes (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Activate 30-minute inactivity timer if user is logged in
  useInactivityTimeout(!!user);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  return (
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
          {loading ? (
            <div className="h-9 w-24 bg-zinc-800 animate-pulse rounded-xl" />
          ) : user ? (
            /* Logged-In State Buttons */
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="px-3 py-2 rounded-xl border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 transition-colors flex items-center gap-1.5"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            /* Logged-Out State Buttons */
            <>
              <Link href="/login" className="px-4 py-2 rounded-xl text-zinc-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-lg shadow-emerald-500/20 transition-all"
              >
                Enroll Kid
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}