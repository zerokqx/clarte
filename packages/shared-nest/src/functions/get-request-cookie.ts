import { Request } from 'express';

export const getRequestCookie = (
  request: Request,
  cookieName: string,
): string | undefined => {
  const cookie = request.cookies?.[cookieName];
  if (typeof cookie !== 'string') {
    return undefined;
  }

  const normalized = cookie.trim();
  return normalized || undefined;
};
