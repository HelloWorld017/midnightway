import * as z from 'zod';

export const ConfigSchema = z.object({
  network: z.object({
    interface: z.string().default('enp4s0'),
  }),

  weather: z
    .object({
      location: z.string(),
      apiToken: z.string(),
    })
    .optional(),
});

export type Config = z.TypeOf<typeof ConfigSchema>;
