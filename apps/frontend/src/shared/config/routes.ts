export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  todos: '/todos',
  notes: '/notes',
  profile: '/profile',
  notifications: '/notifications',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
