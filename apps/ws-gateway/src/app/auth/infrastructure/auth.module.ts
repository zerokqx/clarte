import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { MicroserviceConfigModule, MicroserviceConfigType } from '@clarte/shared-nest/config';
import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Auth } from '@clarte/shared-contracts/proto';
import { JwtModule, type JwtVerifyOptions } from '@nestjs/jwt';
import { lastValueFrom } from 'rxjs';
import {
  AUTH_CLIENT,
  AUTH_GRPC_CLIENT,
  JWT_ALOGORITM,
  type IAuthClient,
} from '../application/ports';
import { proto } from '@clarte/shared';
import { PROTO_PATH } from '../../ports/di-tokens';
import { AuthClient } from './auth.client';

type Algorithm = NonNullable<JwtVerifyOptions['algorithms']>[number];

@Global()
@Module({
  imports: [
    MicroserviceConfigModule.register({
      registerAsName: 'auth-service',
      prefixOptions: { value: 'auth_', upperCase: true },
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_GRPC_CLIENT,
        useFactory(config: ConfigService, protoPath: string) {
          const { host, port } = config.getOrThrow<MicroserviceConfigType>('auth-service');

          return {
            transport: Transport.GRPC,
            options: {
              url: `${host}:${port}`,
              package: Auth.AUTH_PACKAGE_NAME,
              protoPath: join(protoPath, proto('auth')),
            },
          };
        },
        inject: [ConfigService, PROTO_PATH],
      },
    ]),
    JwtModule.registerAsync({
      useFactory(authClient: IAuthClient, algorithm: Algorithm) {
        let cachedKey: string | null = null;
        return {
          verifyOptions: { algorithms: [algorithm] },
          secretOrKeyProvider: async () => {
            if (cachedKey) return cachedKey;
            const token = await lastValueFrom(authClient.getPublicKey());
            cachedKey = String(token);
            return token;
          },
        };
      },
      inject: [AUTH_CLIENT, JWT_ALOGORITM],
    }),
  ],
  providers: [
    {
      provide: AUTH_CLIENT,
      useClass: AuthClient,
    },
    {
      provide: JWT_ALOGORITM,
      useValue: 'RS256' as Algorithm,
    },
  ],
  exports: [AUTH_CLIENT, JWT_ALOGORITM, JwtModule],
})
export class AuthModule {}
