'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { client as supabaseClient } from '@/lib/composables/useSupabase';

type Props = {
    children: React.ReactNode
}

export default function AuthWrapper({ children }: Props) {
  const router = useRouter();

  const redirectIfNotAuthenticated = async () => {
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) {
      await supabaseClient.auth.signOut();
      router.replace('/login');
    }
  };

  useEffect(() => {
    redirectIfNotAuthenticated();
  }, []);

  return children;
}
