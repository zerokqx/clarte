export interface JwtCookieInterceptorOptions {
  isProd: boolean;
}

export const COOKIE_INTERCEPTOR_OPTIONS = Symbol('COOKIE_INTERCEPTOR_OPTIONS');
export const COOKIE_INTERCEPTOR_UUID = Symbol('COOKIE_INTERCEPTOR_UUID');
