import { JwtModule as JwtModuleNestJS } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { JwtService } from './jwt.service';
import { JWT_SERVICE } from '../../application';

@Module({
  imports: [
    JwtModuleNestJS.registerAsync({
      async useFactory() {
        const read = (file: string) =>
          readFileSync(join(__dirname, 'assets', file), 'utf-8');

        const privateKey = read('private.key');
        const publicKey = read('public.key');
        return {
          signOptions: { algorithm: 'RS256' },
          global: true,
          privateKey,
          publicKey,
        };
      },
    }),
  ],
  providers: [
    {
      provide: JWT_SERVICE,
      useClass: JwtService,
    },
  ],
  exports: [JWT_SERVICE],
})
export class JwtModule {}
