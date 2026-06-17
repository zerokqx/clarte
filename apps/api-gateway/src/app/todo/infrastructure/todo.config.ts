import { Env } from '@humanwhocodes/env';
import { registerAs } from '@nestjs/config';

const env = new Env();
export const todoConfiguration = registerAs('todo-service', () => ({
  port: env.get('TODO_PORT', 5004),
  host: env.get('TODO_HOST', 'localhost'),
}));

export type TodoConfiguration = ReturnType<typeof todoConfiguration>;
