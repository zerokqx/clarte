import { Env } from '@humanwhocodes/env';
import { registerAs } from '@nestjs/config';

const env = new Env();
export const notificationConfiguration = registerAs('notification-service', () => ({
  port: env.get('NOTIFICATION_PORT', 5005),
  host: env.get('NOTIFICATION_HOST', 'localhost'),
}));

export type NotificationConfiguration = ReturnType<typeof notificationConfiguration>;
