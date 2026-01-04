// src/routes/admin/login/index.tsx
import { component$, useSignal } from '@builder.io/qwik';
import { DocumentHead, routeAction$, zod$ } from '@builder.io/qwik-city';
import { loginSchema } from '../../components/schemas/auth';
import { AuthService } from '../../components/service/auth-service';
import { AUTH_CONSTANTS } from '~/components/constants/auth';
import type { LoginFormData, LoginSuccessResponse, LoginErrorResponse } from '~/components/types/authAdmin';
import type { LoginActionStore } from '~/components/types/qwik-types';
import { LoginHeader } from '../../components/loginAdmin/login-header';
import { LoginLayout } from '../../components/loginAdmin/login-layout'
import { LoginCard } from '../../components/loginAdmin/login-card'
import { LoginForm } from '../../components/loginAdmin/login-form'
import { SecurityNotice } from '../../components/loginAdmin/security-notice'

export const useLoginAction = routeAction$(
  async (formData: LoginFormData, requestEvent): Promise<LoginSuccessResponse | LoginErrorResponse> => {
    try {
      const result = await AuthService.login(formData);

      setAuthCookies(requestEvent, result, formData.rememberMe);
      redirectToDashboard(requestEvent);

    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }
      return handleLoginError(error);
    }
  },
  zod$(loginSchema)
);

function setAuthCookies(
  requestEvent: any,
  result: any,
  rememberMe?: boolean
): void {
  const maxAge = rememberMe
    ? AUTH_CONSTANTS.COOKIE.MAX_AGE.REMEMBER_ME
    : AUTH_CONSTANTS.COOKIE.MAX_AGE.STANDARD;

  requestEvent.cookie.set('auth-token', result.token, {
    httpOnly: true,
    path: '/',
    secure: false,
    maxAge
  });

  requestEvent.cookie.set('admin-data', JSON.stringify(result.admin), {
    httpOnly: true,
    path: '/',
    secure: false,
    maxAge
  });
}

function redirectToDashboard(requestEvent: any): never {
  throw requestEvent.redirect(302, AUTH_CONSTANTS.REDIRECT.SUCCESS);
}

function isRedirectError(error: unknown): boolean {
  return error instanceof Error && error.message.includes('redirect');
}

function handleLoginError(error: unknown): LoginErrorResponse {
  const errorMessage = error instanceof Error
    ? error.message
    : 'خطا در ارتباط با سرور. لطفا دوباره تلاش کنید.';

  return {
    success: false,
    message: errorMessage
  };
}

export default component$(() => {
  const loginAction = useLoginAction() as LoginActionStore;
  const showPassword = useSignal(false);

  return (
    <LoginLayout>
      <LoginCard>
        <LoginHeader />
        <LoginForm
          action={loginAction}
          showPassword={showPassword}
        />
        <SecurityNotice />
      </LoginCard>
    </LoginLayout>
  );
});

export const head: DocumentHead = {
  title: 'صفحه ورود مدیریت',
};