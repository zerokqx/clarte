import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';
import { UserModule } from './user.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
    }),
    DatabaseModule,
    UserModule,
  ],
})
export class AppModule {}
