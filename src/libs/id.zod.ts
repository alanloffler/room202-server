import z from 'zod';

export const idValidation = z.object({ id: z.number().positive() }).required({ id: true });