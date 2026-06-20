import { Inject } from '@nestjs/common';

export const mkRepoInject =
  (w: symbol | string, r: symbol | string) => (type: 'w' | 'r') =>
    Inject(type === 'w' ? w : r);
