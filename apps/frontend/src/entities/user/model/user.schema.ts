import z from 'zod';

export const UserLoginSchema = z
  .string()
  .regex(/^\S+$/, 'Логин не должен содержать пробелы')
  .min(3, 'Логин должен быть не менее 3 символов')
  .max(30, 'Логин должен быть не более 30 символов');

export const UserPasswordSchema = z
  .string()
  .regex(/^\S+$/, 'Логин не должен содержать пробелы')
  .min(8, 'Пароль должен быть не менее 8 символов');
