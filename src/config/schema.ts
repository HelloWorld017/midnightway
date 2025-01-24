import * as z from 'zod';

export const ConfigSchema = z
  .object({
    locale: z.enum(['en-US', 'ko-KR']).default('en-US'),
    system: z
      .object({
        networkInterface: z.string().default('enp4s0'),
        gpuCard: z.string().nullable().default('renderD128'),
        temperatures: z
          .array(z.object({ name: z.string(), devices: z.array(z.string()) }))
          .default([
            { name: 'cpu', devices: ['k10temp', 'coretemp'] },
            { name: 'gpu', devices: ['amdgpu'] },
            { name: 'ssd', devices: ['nvme'] },
          ]),
        updateInterval: z.number().default(1000),
      })
      .default({}),

    weather: z
      .object({
        location: z.string(),
        apiToken: z.string(),
        updateInterval: z.number().default(3 * 60 * 1000),
      })
      .nullable()
      .default(null),
  })
  .default({});

export type Config = z.TypeOf<typeof ConfigSchema>;
