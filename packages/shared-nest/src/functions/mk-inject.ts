import { Inject } from '@nestjs/common';

export const mkInject = (identifier: string | symbol) => () =>
  Inject(identifier);
