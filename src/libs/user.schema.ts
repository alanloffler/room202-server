import z from 'zod';

export const userIdSchema = z.object({ id: z.number().positive().gte(0) });

export const userSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(10),
  type: z.string().min(1)
});
