import z from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Formato de e-mail inválido' }),
  password: z.string().min(6, {
    message: 'El password debe poseer al menos 6 caracteres'
  })
});
