import { mkInject } from '@clarte/shared-nest/functions';
import { S3_STORAGE } from '../ports';

export const InjectS3 = mkInject(S3_STORAGE);
