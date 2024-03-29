import z from 'zod';

export const propertyIdSchema = z.object({ id: z.number().positive().gte(0) }).required({ id: true });

export const getByIdSchema = z.object({ id: z.number().positive() }).required({ id: true });

export const setActiveSchema = z
  .object({
    id: z.number().positive(),
    active: z.boolean()
  })
  .required({
    id: true,
    active: true
  });

export const propertySchema = z.object({
  type: z.string().min(1, {
    message: 'Debes seleccionar un tipo'
  }),
  business_type: z.string().min(1, {
    message: 'Debes seleccionar un tipo'
  }),
  title: z.string().min(3, {
    message: 'El título debe poseer al menos 3 caracteres'
  }),
  short_description: z.string().min(3, {
    message: 'La descripción breve debe poseer al menos 3 caracteres'
  }),
  long_description: z.string().min(3, {
    message: 'La descripción extendida debe poseer al menos 3 caracteres'
  }),
  street: z.string().min(3, {
    message: 'La calle debe poseer al menos 3 caracteres'
  }),
  city: z.string().min(3, {
    message: 'La ciudad debe poseer al menos 3 caracteres'
  }),
  state: z.string().min(3, {
    message: 'La provincia debe poseer al menos 3 caracteres'
  }),
  zip: z.string().min(4, {
    message: 'El código postal debe poseer 4 cifras'
  }),
  is_active: z.number().lte(1).gte(0).default(1),
  price: z.coerce
    .number({ invalid_type_error: 'El precio debe ser un número' })
    .positive({ message: 'El precio debe ser positivo' })
    .gte(1000, { message: 'El precio debe ser un número de 4 dígitos' })
});
