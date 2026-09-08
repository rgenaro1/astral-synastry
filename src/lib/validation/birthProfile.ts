import { z } from 'zod';

export const BirthProfileInputSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (AAAA-MM-DD)'),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/, 'Formato de hora inválido (HH:mm)'),
  city: z.string().min(1, 'La ciudad es requerida'),
  country: z.string().min(1, 'El país es requerido'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezoneIana: z.string().min(1, 'La zona horaria es requerida'),
});

export const SynastryInputSchema = z.object({
  personA: BirthProfileInputSchema,
  personB: BirthProfileInputSchema,
  houseSystem: z.enum(['placidus', 'whole-sign', 'equal']).default('placidus'),
});

export type ValidatedBirthProfileInput = z.infer<typeof BirthProfileInputSchema>;
export type ValidatedSynastryInput = z.infer<typeof SynastryInputSchema>;
