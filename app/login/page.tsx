'use client';

import Button from '@/components/Button';
import { useSupabase } from '@/lib/composables/useSupabase';
import Image from 'next/image';

export default function Login() {
  const supabase = useSupabase();

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.origin}/auth`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
  };

  return (
    <div className="flex justify-center">
      <Button
        onClick={loginWithGoogle}
        className="flex items-center gap-1"
      >
        <Image
          src="https://www.google.com/s2/favicons?domain=google.com&sz=128"
          alt="google"
          width={128}
          height={128}
          className="w-[32px] aspect-square"
        />
        <span className="text-xl">Login with Google</span>
      </Button>
    </div>
  );
}
