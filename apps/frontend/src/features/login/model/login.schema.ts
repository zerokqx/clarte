import z from 'zod';

export const LoginSchema = z.object({
  login: z.string().min(1).max(30),
  password: z.string().min(8),
});
