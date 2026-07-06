import z from 'zod';
import { UserLoginSchema, UserPasswordSchema } from '@/entities/user';

export const LoginSchema = z.object({
  login: UserLoginSchema,
  password: UserPasswordSchema,
});
