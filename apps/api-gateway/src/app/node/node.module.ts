import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Notes } from '@clarte/shared-contracts/proto';
import { proto } from '@clarte/shared/functions';
import { join } from 'path';
import { NodeController } from './presentation/node.controller';
import { NodeClient } from './infrastructure/clients/node.client';
import { NODE_CLIENT, NODE_GRPC_CLIENT } from './application';
import { MicroserviceConfigModule, MicroserviceConfigType } from '@clarte/shared-nest/config';
import { PROTO_PATH } from '@/app/ports/di-tokens';

@Module({
  imports: [
    MicroserviceConfigModule.register({
      registerAsName: 'note-service',
      prefixOptions: { value: 'note_', upperCase: true },
    }),
    ClientsModule.registerAsync([
      {
        name: NODE_GRPC_CLIENT,
        useFactory(config: ConfigService, protoPath: string) {
          const { host, port } = config.getOrThrow<MicroserviceConfigType>('note-service');
          return {
            transport: Transport.GRPC,
            options: {
              url: `${host}:${port}`,
              package: Notes.NOTES_PACKAGE_NAME,
              protoPath: join(protoPath, proto('notes')),
            },
          };
        },
        inject: [ConfigService, PROTO_PATH],
      },
    ]),
  ],
  controllers: [NodeController],
  providers: [
    {
      provide: NODE_CLIENT,
      useClass: NodeClient,
    },
  ],
  exports: [NODE_CLIENT],
})
export class NodeModule {}
