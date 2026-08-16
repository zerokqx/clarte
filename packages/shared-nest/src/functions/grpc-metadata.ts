import { Metadata, status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { E } from '@clarte/shared';
import { snake } from 'radash';

export function makeGrpcMetadata(params: Record<string, string | undefined>): Metadata {
  const metadata = new Metadata();
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null) {
      metadata.set(snake(key), val);
    }
  }
  return metadata;
}

export function getUserIdFromGrpcMetadata(metadata: unknown): string {
  const getMeta = E.safeMetadataGrpcGetter(metadata);
  const raw = getMeta('user_id') || getMeta('userid') || getMeta('x-user-id');
  const first = Array.isArray(raw) ? raw[0] : raw;

  if (!first) {
    throw new RpcException({
      code: status.UNAUTHENTICATED,
      message: 'Missing user_id in gRPC metadata',
    });
  }

  return typeof first === 'string' ? first : first.toString('utf-8');
}
