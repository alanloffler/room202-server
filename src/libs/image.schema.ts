import z from 'zod';

export const imageIdSchema = z.object({ id: z.number().positive().gte(0) }).required({ id: true });
