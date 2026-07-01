import z from 'zod';

export const CreateTodoSchema = z.object({
  title: z.string().min(10).max(50),
  description: z.string().min(10).max(1000),
  dueDate: z.date()
});
