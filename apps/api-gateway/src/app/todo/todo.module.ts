import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TodoConfiguration, todoConfiguration } from './infrastructure/todo.config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Todo } from '@clarte/shared-contracts/proto';
import { getProtoPath } from '@clarte/shared-contracts/functions';
import { TodoController } from './presentation/todo.controller';
import { TodoClient } from './infrastructure/clients/todo.client';
import { TODO_CLIENT, TODO_GRPC_CLIENT } from './application';

@Module({
  imports: [
    ConfigModule.forFeature(todoConfiguration),
    ClientsModule.registerAsync([
      {
        name: TODO_GRPC_CLIENT,
        useFactory(config: ConfigService) {
          const { host, port } =
            config.getOrThrow<TodoConfiguration>('todo-service');
          return {
            transport: Transport.GRPC,
            options: {
              url: `${host}:${port}`,
              package: Todo.TODO_PACKAGE_NAME,
              protoPath: getProtoPath('todo'),
            },
          };
        },
        inject: [ConfigService],
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
