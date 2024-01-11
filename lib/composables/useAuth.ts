import { useEffect, useState } from 'react';
import { getAuthenticatedUser } from '@/lib/utils/auth';
import { User } from '@supabase/gotrue-js';

export const useAuth = () => {
  const [user, setUser] = useState<User|null>(null);

  useEffect(() => {
    (async () => {
      const data = await getAuthenticatedUser();
      setUser(data);
    })();
  }, []);

  return {
    user,
  };
};
