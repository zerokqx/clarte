import { mkInject } from '@/functions';
import { S3_SERVICE_TOKEN } from '../ports';

export const InjectS3Service = mkInject(S3_SERVICE_TOKEN);
