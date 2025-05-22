export type UserRole = 'admin' | 'auditor' | 'reviewer' | 'viewer';

export interface Role {
  id: number;
  name: string;
  permissions: string[];
}

export interface User {
  id: string;
  email: string;
  roles: Role[];
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  hasRole: (roleName: string) => boolean;
  hasPermission: (permission: string) => boolean;
}