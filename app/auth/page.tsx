'use client';

import { useEffect } from 'react';
import { useSupabase } from '@/lib/composables/useSupabase';
import { useRouter } from 'next/navigation';

export default function Auth() {
  const supabase = useSupabase();
  const router = useRouter();

  const redirectAfterLogin = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      router.replace('/');
    } else {
      router.replace('/login');
    }
  };

  useEffect(() => {
    redirectAfterLogin();
  }, []);

  return (
    <p className="text-center text-xl opacity-50">Logging in...</p>
  );
}
