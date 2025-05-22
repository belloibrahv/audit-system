import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface CreateUserData {
  email: string;
  password: string;
  options?: {
    data?: {
      role?: string;
      firstName?: string;
      lastName?: string;
    };
  };
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  createUser: (userData: CreateUserData) => Promise<void>;
  hasRole: (role: string) => boolean;
}

// Create the context with a default value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (!data.user) throw new Error('No user returned');
    return data.user;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  const createUser = async (userData: CreateUserData) => {
    const { data, error } = await supabase.auth.signUp(userData);
    if (error) throw error;
    
    if (data.user) {
      // Create profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email: userData.email,
            role: userData.options?.data?.role || 'auditor',
            first_name: userData.options?.data?.firstName,
            last_name: userData.options?.data?.lastName
          }
        ]);
      
      if (profileError) throw profileError;
    }
  };

  const hasRole = (role: string): boolean => {
    return user?.user_metadata?.role === role;
  };

  useEffect(() => {
    // Initialize auth state
    const initAuth = async () => {
      try {
        // Check for existing session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session fetch error:', error);
          return;
        }

        if (session) {
          setUser(session.user);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      }
    };

    initAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session); // Debug log
        
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      signIn, 
      signOut, 
      createUser,
      hasRole 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create and export the hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
