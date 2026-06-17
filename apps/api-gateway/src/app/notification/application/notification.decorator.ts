import { Inject } from '@nestjs/common';
import { NOTIFICATION_CLIENT } from '@/app/notification/application/ports';

export const InjectNotificationClient = () => Inject(NOTIFICATION_CLIENT);
