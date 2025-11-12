import { z } from '@builder.io/qwik-city';

export const loginSchema = z.object({
  username: z.string().min(1, 'نام کاربری الزامی است'),
  password: z.string().min(1, 'رمز عبور الزامی است'),
  rememberMe: z.boolean().optional()
});

