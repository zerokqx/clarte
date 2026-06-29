import { mkInject } from '@clarte/shared-nest/functions';
import { HOCUSPOCUS_OPTIONS, HOCUSPOCUS_SERVER } from '../ports';

export const InjectHocuspocusServer = mkInject(HOCUSPOCUS_SERVER);
export const InjectHocuspocusOptions = mkInject(HOCUSPOCUS_OPTIONS)
