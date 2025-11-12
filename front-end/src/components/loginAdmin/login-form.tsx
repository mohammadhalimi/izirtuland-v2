// src/components/loginAdmin/login-form.tsx
import { component$ } from '@builder.io/qwik';
import { Form } from '@builder.io/qwik-city';
import type { LoginActionResponse } from '~/components/types/authAdmin';

import { 
  UsernameInput, 
  PasswordInput, 
  RememberMe, 
  ErrorMessage, 
  LoginButton 
} from './form-components';

// استفاده از نوع ساده‌تر برای ActionStore
interface LoginFormProps {
  action: any; // یا از نوع دقیق‌تر در ادامه
  showPassword: { value: boolean };
}

// helper function برای استخراج fieldErrors
const getFieldErrors = (actionValue: LoginActionResponse | undefined) => {
  if (!actionValue) return undefined;
  
  if ('failed' in actionValue && actionValue.failed) {
    return actionValue.fieldErrors;
  }
  
  if ('success' in actionValue && !actionValue.success) {
    return actionValue.fieldErrors;
  }
  
  return undefined;
};

// helper function برای استخراج message
const getErrorMessage = (actionValue: LoginActionResponse | undefined) => {
  if (!actionValue) return undefined;
  
  if ('failed' in actionValue && actionValue.failed) {
    return actionValue.formErrors?.[0];
  }
  
  if ('success' in actionValue && !actionValue.success) {
    return actionValue.message;
  }
  
  return undefined;
};

export const LoginForm = component$<LoginFormProps>(({ action, showPassword }) => {
  const fieldErrors = getFieldErrors(action.value);
  const errorMessage = getErrorMessage(action.value);

  return (
    <Form action={action} class="space-y-6">
      <UsernameInput fieldErrors={fieldErrors} />
      <PasswordInput fieldErrors={fieldErrors} showPassword={showPassword} />
      <RememberMe />
      <ErrorMessage message={errorMessage} />
      <LoginButton isRunning={action.isRunning} />
    </Form>
  );
});