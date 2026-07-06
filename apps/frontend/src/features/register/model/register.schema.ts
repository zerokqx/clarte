import z from 'zod';
import { UserLoginSchema, UserPasswordSchema } from '@/entities/user';

export const RegisterSchema = z.object({
  login: UserLoginSchema,
  password: UserPasswordSchema,
});
