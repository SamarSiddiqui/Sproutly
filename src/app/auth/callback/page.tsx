'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../utils/supabaseClient';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if session has resolved on mount, otherwise listen for state change
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace('/botanical-base');
      } else {
        // Fallback listen to auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (session) {
            router.replace('/botanical-base');
            subscription.unsubscribe();
          }
        });

        // Safe fallback timeout to redirect if auth session resolves but callback event isn't captured
        const timeout = setTimeout(() => {
          router.replace('/botanical-base');
          subscription.unsubscribe();
        }, 2000);

        return () => {
          clearTimeout(timeout);
          subscription.unsubscribe();
        };
      }
    };

    checkSession();
  }, [router]);

  return (
    <div className="min-h-screen bg-sproutly-bg flex flex-col items-center justify-center gap-3">
      <Loader2 size={36} className="text-sproutly-primary animate-spin" />
      <p className="text-sm font-semibold text-sproutly-secondary">Completing sign in...</p>
    </div>
  );
}
