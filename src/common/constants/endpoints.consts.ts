export const GLOBAL_PREFIXES = {
  AUTH: 'auth',
  USER: 'user',
  POST: 'post'
} as const;

export const ENDPOINTS = {
  AUTH: {
    LOGIN: 'login',
    REGISTER: 'register',
    REFRESH: 'refresh',
    LOGOUT: 'logout',
  },
  USER: {
    CREATE: '',
    ALL: 'all',
    UPDATE: ':id',
    REMOVE: ':id',
  },
  POST: {
    CREATE: '',
    ALL: 'all',
    UPDATE: ':id',
    REMOVE: ':id',
  },
} as const;
