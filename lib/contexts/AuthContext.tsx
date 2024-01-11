'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/gotrue-js';
import { client as supabaseClient } from '@/lib/composables/useSupabase';

type ContextProps = {
    user: User | null
}

export const AuthContext = createContext<ContextProps>({
  user: null,
});

export const useAuth = () => {
  const { user } = useContext(AuthContext);

  return {
    user,
  };
};

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User|null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabaseClient.auth.getUser();
      setUser(user);
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
