import { Global, Module } from '@nestjs/common';
import { S3_STORAGE } from '@/application';
import { S3Storage } from './s3.storage';
import { S3SharedModule } from '@clarte/shared-nest/modules';

@Global()
@Module({
  imports: [S3SharedModule],
  providers: [
    {
      provide: S3_STORAGE,
      useClass: S3Storage,
    },
  ],
  exports: [S3_STORAGE],
})
export class S3ModuleLocal {}
