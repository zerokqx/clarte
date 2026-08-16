import { NOTIFICATION_WRITE_REPO, NOTIFICATION_READ_REPO } from '../ports/di-tokens';
import { mkRepoInjectV2 } from '@clarte/shared-nest/core/functions';
import { INotificationRepository } from '../ports';

export const InjectNotificationRepo = mkRepoInjectV2<INotificationRepository>(
  NOTIFICATION_WRITE_REPO,
  NOTIFICATION_READ_REPO,
);
