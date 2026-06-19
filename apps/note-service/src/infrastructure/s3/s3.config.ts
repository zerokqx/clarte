import { Env } from '@humanwhocodes/env';
import { registerAs, ConfigType } from '@nestjs/config';

export const S3Configuration = registerAs('s3-config', () => {
  const env = new Env();
  const s3Env = <T extends string>(v: T): `S3_${Uppercase<T>}` =>
    `S3_${v.toUpperCase() as Uppercase<T>}`;
  return {
    endpoint: env.require(s3Env('endpoint')),
    bucket: env.require(s3Env('bucket')),
    accessKey: env.require(s3Env('access_key')),
    secretAccessKey: env.require(s3Env('secret_access_key')),
    accountId: env.require(s3Env('account_id')),
    region: env.get(s3Env('region'), 'ru-central1'),
  };
});

export type S3ConfigurationType = ConfigType<typeof S3Configuration>;
