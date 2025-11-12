// src/components/types/qwik-types.ts
import type { ActionStore } from '@builder.io/qwik-city';
import type { LoginActionResponse, LoginFormData } from './authAdmin';

// نوع دقیق برای ActionStore لاگین
export type LoginActionStore = ActionStore<
  LoginActionResponse, 
  LoginFormData, 
  true
>;

// export کردن LoginActionResponse از اینجا هم
export type { LoginActionResponse } from './authAdmin';