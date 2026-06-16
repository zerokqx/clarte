import { S3Module } from 'nestjs-s3';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Configuration, S3ConfigurationType } from './s3.config';
import { S3_STORAGE } from '@/application';
import { S3Storage } from './s3.storage';

@Global()
@Module({
  imports: [
    ConfigModule.forFeature(S3Configuration),
    S3Module.forRootAsync({
      useFactory(config: ConfigService) {
        const { accessKey, endpoint, region, secretAccessKey } =
          config.getOrThrow<S3ConfigurationType>('s3-config');
        return {
          config: {
            endpoint,
            region,
            credentials: { secretAccessKey, accessKeyId: accessKey },
            forcePathStyle: true,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: S3_STORAGE,
      useClass: S3Storage,
    },
  ],
  exports: [S3_STORAGE],
})
export class S3ModuleLocal {}
