'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/clients';

const INACTIVITY_LIMIT_MS = 30 * 60 * 1000; // 30 minutes in milliseconds

export function useInactivityTimeout(isLoggedIn: boolean) {
  const router = useRouter(); // <-- Make sure this calls useRouter()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return;

    const supabase = createClient();

    const handleLogout = async () => {
      await supabase.auth.signOut();
      router.push('/login?reason=timeout'); // <-- Uses the lowercase 'router' instance
    };

    const resetTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(handleLogout, INACTIVITY_LIMIT_MS);
    };

    // User activity events to monitor
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Initialize timer on mount
    resetTimer();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [isLoggedIn, router]);
}