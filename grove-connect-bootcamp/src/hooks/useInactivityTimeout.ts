'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/clients';

// 10 minutes in milliseconds (10 * 60 * 1000)
const INACTIVITY_LIMIT_MS = 10 * 60 * 1000;

export function useInactivityTimeout(isLoggedIn: boolean) {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const supabase = createClient();

  const handleFullLogout = useCallback(async (reason = 'timeout') => {
    try {
      // 1. Server-side revocation of session & refresh token
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      console.error('Error invalidating server session:', err);
    } finally {
      // 2. Clear client-side token storage & local state
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();

        // Expire potential auth cookies on browser
        document.cookie.split(';').forEach((cookie) => {
          const name = cookie.split('=')[0].trim();
          if (name.includes('supabase') || name.includes('token') || name.includes('sb-')) {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          }
        });
      }

      // 3. Force hard redirect to login page to wipe memory state
      window.location.href = `/login?reason=${reason}`;
    }
  }, [supabase]);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (isLoggedIn) {
      timeoutRef.current = setTimeout(() => {
        handleFullLogout('timeout');
      }, INACTIVITY_LIMIT_MS);
    }
  }, [isLoggedIn, handleFullLogout]);

  useEffect(() => {
    if (!isLoggedIn) return;

    // Track common user interactions
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll', 'click'];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    // Start timer on initial hook mount
    resetTimer();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [isLoggedIn, resetTimer]);

  return { handleFullLogout };
}