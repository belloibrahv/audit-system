import { supabase } from '../lib/supabase';

export const checkAuthStatus = async () => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('Current session:', session);
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return;
    }

    if (session?.user) {
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          role_id,
          roles:roles (
            id,
            name,
            permissions
          )
        `)
        .eq('user_id', session.user.id);

      console.log('User roles:', roles);
      
      if (rolesError) {
        console.error('Roles error:', rolesError);
      }
    }
  } catch (error) {
    console.error('Auth check error:', error);
  }
};
