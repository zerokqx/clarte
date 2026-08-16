import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Todo } from '@clarte/shared-contracts/proto';
import { proto } from '@clarte/shared/functions';
import { join } from 'path';
import { TodoController } from './presentation/todo.controller';
import { TodoClient } from './infrastructure/clients/todo.client';
import { TODO_CLIENT, TODO_GRPC_CLIENT } from './application';
import { MicroserviceConfigModule, MicroserviceConfigType } from '@clarte/shared-nest/config';

import { PROTO_PATH } from '@/app/ports/di-tokens';

@Module({
  imports: [
    MicroserviceConfigModule.register({
      registerAsName: 'todo-service',
      prefixOptions: { value: 'todo_', upperCase: true },
    }),
    ClientsModule.registerAsync([
      {
        name: TODO_GRPC_CLIENT,
        useFactory(config: ConfigService, protoPath: string) {
          const { host, port } = config.getOrThrow<MicroserviceConfigType>('todo-service');
          return {
            transport: Transport.GRPC,
            options: {
              url: `${host}:${port}`,
              package: Todo.TODO_PACKAGE_NAME,
              protoPath: join(protoPath, proto('todo')),
            },
          };
        },
        inject: [ConfigService, PROTO_PATH],
      },
    ]),
  ],
  controllers: [TodoController],
  providers: [
    {
      provide: TODO_CLIENT,
      useClass: TodoClient,
    },
  ],
})
export class TodoModule {}
