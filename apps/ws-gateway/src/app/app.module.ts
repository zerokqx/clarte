import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HocuspocusModule } from './hocuspocus/infrastructure/hocuspocus.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/infrastructure';
import { NoteModule } from './note/infrastructure';
import { JwtService } from '@nestjs/jwt';
import { NOTE_CLIENT } from './note';

import { type INoteClient } from './note';
import { map } from 'rxjs';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    NoteModule,
    HocuspocusModule.registerAsync({
      imports: [AuthModule],
      useFactory(jwtService: JwtService, noteService: INoteClient) {
        return {
          noteAccessChecker: {
            check(authorId, noteId) {
              return noteService
                .checkAccess(authorId, noteId)
                .pipe(map((response) => response.status));
            },
          },
          jwtValidator: {
            async validate(token) {
              return jwtService.verifyAsync(token);
            },
          },
        };
      },
      inject: [JwtService, NOTE_CLIENT],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
