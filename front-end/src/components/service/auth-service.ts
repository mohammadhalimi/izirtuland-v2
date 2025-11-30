// src/services/auth-service.ts
import { API_BASE_URL } from '~/config/api';
import type { LoginFormData, LoginResponse } from '../types/authAdmin';

const API_BASE = `${API_BASE_URL}/api`;

export class AuthService {
  static async login(credentials: LoginFormData): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(this.handleErrorResponse(response.status, errorText));
    }

    return await response.json();
  }

  private static handleErrorResponse(status: number, errorText: string): string {
    try {
      const errorData = JSON.parse(errorText);
      return errorData.message || 'خطا در ارتباط با سرور';
    } catch {
      return `خطای سرور: ${status}`;
    }
  }
}