import z from 'zod';

export const RegisterSchema = z.object({
  login: z.string().min(3, 'Логин должен быть не менее 3 символов').max(30),
  password: z.string().min(8, 'Пароль должен быть не менее 8 символов'),
});
