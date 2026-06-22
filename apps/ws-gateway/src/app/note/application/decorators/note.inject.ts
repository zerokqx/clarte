import { mkInject } from '@clarte/shared-nest/functions';
import { NOTE_CLIENT, NOTE_GRPC_CLIENT } from '../ports';

export const InjectNoteClient = mkInject(NOTE_CLIENT);
export const InjectNoteGrpcClient = mkInject(NOTE_GRPC_CLIENT);
