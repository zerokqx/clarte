import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@/app/user/infrastructure/users.module';
import { AuthModule } from '@/app/auth/auth.module';
import { TodoModule } from '@/app/todo/todo.module';
import { NotificationModule } from '@/app/notification/infrastructure/notifications.module';
import { NodeModule } from '@/app/node/node.module';
import { AppConfigModule } from '@clarte/shared-nest/config';
import { JwtModule } from '@clarte/shared-nest/auth';
import { JwtKeyProvider } from '@/app/auth/infrastructure';

import { createFolderPathModule } from '@clarte/shared-nest/infra';
import { PROTO_PATH } from '@/app/ports/di-tokens';

@Module({
  imports: [
    createFolderPathModule({ name: PROTO_PATH, folderName: 'proto', from: __dirname }),
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
    }),
    AppConfigModule,
    UserModule,
    AuthModule,
    TodoModule,
    NotificationModule,
    NodeModule,
    JwtModule.register({
      imports: [AuthModule],
      provider: JwtKeyProvider,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
