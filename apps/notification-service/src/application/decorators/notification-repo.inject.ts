import { Inject } from '@nestjs/common';
import { NOTIFICATION_REPO } from '../ports/di-tokens';

export const InjectNotificationRepo = () => Inject(NOTIFICATION_REPO);
