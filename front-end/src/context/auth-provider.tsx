import {
  component$,
  useStore,
  useContextProvider,
  useVisibleTask$
} from '@builder.io/qwik';
import { AuthContext } from './auth-context';
import { API_BASE_URL } from '~/config/api';
import { Slot } from '@builder.io/qwik';

export const AuthProvider = component$(() => {
  const auth = useStore({
    isAuthenticated: false,
    loading: true,
    user: undefined
  });

  useContextProvider(AuthContext, auth);

  useVisibleTask$(({ cleanup }) => {
    const refreshAuth = async () => {
      auth.loading = true;
      const res = await fetch(`${API_BASE_URL}/api/user/me`, {
        credentials: 'include'
      });
      const data = await res.json();
      auth.isAuthenticated = data.success;
      auth.user = data.user;
      auth.loading = false;
    };

    window.addEventListener('auth-updated', refreshAuth);

    cleanup(() =>
      window.removeEventListener('auth-updated', refreshAuth)
    );
  });

  return <Slot />;
});
