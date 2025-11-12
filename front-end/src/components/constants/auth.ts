export const AUTH_CONSTANTS = {
  COOKIE: {
    AUTH_TOKEN: 'auth-token',
    ADMIN_DATA: 'admin-data',
    MAX_AGE: {
      STANDARD: 24 * 60 * 60, // 1 day
      REMEMBER_ME: 30 * 24 * 60 * 60 // 30 days
    }
  },
  REDIRECT: {
    SUCCESS: '/Admin/dashboard',
    LOGIN: '/Admin'
  }
} as const;