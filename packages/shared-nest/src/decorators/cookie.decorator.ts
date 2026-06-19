import { mkInject } from '@/functions';
import { COOKIE_INTERCEPTOR_OPTIONS, COOKIE_INTERCEPTOR_UUID } from '../ports/di-tokens';

export const InjectCookieInterceptorOptions = mkInject(COOKIE_INTERCEPTOR_OPTIONS);
export const InjectCookieInterceptorUuid = mkInject(COOKIE_INTERCEPTOR_UUID);
