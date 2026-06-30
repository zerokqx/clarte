import { getProtoPath } from '@clarte/shared-contracts/functions';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { MicroserviceConfigModule, MicroserviceConfigType } from '@clarte/shared-nest/modules';
import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Notes } from '@clarte/shared-contracts/proto';
import { NOTE_CLIENT, NOTE_GRPC_CLIENT } from '../application/ports';
import { NoteClient } from './note.client';

@Global()
@Module({
  imports: [
    MicroserviceConfigModule.register({
      registerAsName: 'note-service',
      prefixOptions: { value: 'note_', upperCase: true },
    }),
    ClientsModule.registerAsync([
      {
        name: NOTE_GRPC_CLIENT,
        useFactory(config: ConfigService) {
          const { host, port } = config.getOrThrow<MicroserviceConfigType>('note-service');

          return {
            transport: Transport.GRPC,
            options: {
              url: `${host}:${port}`,
              package: Notes.NOTES_PACKAGE_NAME,
              protoPath: getProtoPath('notes'),
            },
          };
        },
        inject: [ConfigService],
        imports: [ConfigModule],
      },
    ]),
  ],
  providers: [
    {
      provide: NOTE_CLIENT,
      useClass: NoteClient,
    },
  ],
  exports: [NOTE_CLIENT],
})
export class NoteModule {}
