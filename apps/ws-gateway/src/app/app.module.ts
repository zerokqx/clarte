import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HocuspocusModule } from './hocuspocus/infrastructure/hocuspocus.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/infrastructure';
import { NoteModule } from './note/infrastructure';
import { JwtService } from '@nestjs/jwt';
import { NOTE_CLIENT } from './note';

import { type INoteClient } from './note';
import { RedisModule } from '../infrastructure';
import { IRedisConfiguration } from '../application';
import { map } from 'rxjs';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    NoteModule,
    HocuspocusModule.registerAsync({
      imports: [AuthModule, NoteModule, RedisModule],
      useFactory(jwtService: JwtService, noteService: INoteClient, config: ConfigService) {
        const { host, port, password } = config.getOrThrow<IRedisConfiguration>('redis-config');
        return {
          noteClient: {
            checkAccess(authorId, noteId) {
              return noteService.checkAccess(authorId, noteId).pipe(map((res) => res.status));
            },
            getBytes(id) {
              return noteService.getBytes(id);
            },
            saveNoteBytes(id, authorId, bytes) {
              return noteService.saveNoteBytes(id, authorId, bytes);
            },
          },
          redis: { host, port, password },
          jwtValidator: {
            async validate(token) {
              return jwtService.verifyAsync(token);
            },
          },
        };
      },
      inject: [JwtService, NOTE_CLIENT, ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
