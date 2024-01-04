import { client as supabaseClient } from '@/lib/composables/useSupabase';

export const getAuthenticatedUser = async () => {
  const { data: { user } } = await supabaseClient.auth.getUser();

  if (!user) {
    window.location.href = '/login';
    throw new Error('Authentication required');
  }

  return user;
};
