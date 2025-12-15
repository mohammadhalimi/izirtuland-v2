import { createContextId } from '@builder.io/qwik';

export interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  user?: {
    phone: string;
    name?: string;
  };
}

export const AuthContext = createContextId<AuthState>('auth-context');
