// src/components/types/authAdmin.ts
export interface Admin {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'superadmin';
}

export interface LoginResponse {
  token: string;
  admin: Admin;
}

export interface LoginFormData {
  username: string;
  password: string;
  rememberMe?: boolean;
}

// نوع اصلی برای پاسخ موفق
export interface LoginSuccessResponse {
  success: true;
  message?: string;
}

// نوع برای خطا
export interface LoginErrorResponse {
  success: false;
  message: string;
  fieldErrors?: {
    username?: string[];
    password?: string[];
  };
}

// نوع برای validation errors از Zod - استفاده از string[] به جای [string]
export interface LoginValidationErrorResponse {
  failed: true;
  formErrors?: string[];
  fieldErrors: {
    username?: string[];
    password?: string[];
    rememberMe?: string[];
  };
}

// Union type برای تمام حالت‌های ممکن
export type LoginActionResponse = 
  | LoginSuccessResponse 
  | LoginErrorResponse 
  | LoginValidationErrorResponse;

// نوع مشترک برای fieldErrors
export type FieldErrors = {
  username?: string[];
  password?: string[];
  rememberMe?: string[];
};

export interface AdminData {
  _id: string;
  username: string;
  role: "admin" | "superadmin";
  profileImage: string;
}