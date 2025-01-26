import * as z from 'zod';

const GeneratedIdSchema = z
  .string()
  .default('')
  .transform(() => Math.random().toString(36).slice(2))
  .brand('Id');

const ControlCenterStateSchema = <T>(type: z.ZodSchema<T>) =>
  z.discriminatedUnion('kind', [
    z.object({
      kind: z.literal('poll'),
      pollCommand: z.string(),
      pollInterval: z.number().default(1000),
    }),
    z.object({
      kind: z.literal('default'),
      defaultState: type,
    }),
    z.object({
      kind: z.literal('init'),
      initCommand: z.string(),
    }),
  ]);

const ControlCenterItemSchema = z
  .discriminatedUnion('kind', [
    z.object({
      icon: z.string(),
      title: z.union([z.string(), z.object({ active: z.string(), inactive: z.string() })]),
      description: z.union([z.string(), z.object({ active: z.string(), inactive: z.string() })]),
      kind: z.literal('toggle'),
      state: ControlCenterStateSchema(z.boolean()),
      activateCommand: z.string(),
      deactivateCommand: z.string(),
    }),
    z.object({
      icon: z.string(),
      kind: z.literal('button'),
      command: z.string(),
    }),
    z.object({
      icon: z.string(),
      kind: z.literal('slider'),
      command: z.string().describe('use {{percent}} or {{frac}} to interpolate the slider value'),
      state: ControlCenterStateSchema(z.number()),
    }),
    z.object({
      kind: z.enum(['network', 'bluetooth', 'silent', 'volume-slider']),
    }),
  ])
  .and(z.object({ id: GeneratedIdSchema }));

export const ConfigSchema = z
  .object({
    locale: z.enum(['en-US', 'ko-KR']).default('en-US'),

    controlCenter: z
      .object({
        items: z
          .tuple([z.array(ControlCenterItemSchema), z.array(ControlCenterItemSchema)])
          .default([
            [{ kind: 'network' }, { kind: 'silent' }],
            [{ kind: 'bluetooth' }, { kind: 'volume-slider' }],
          ]),
      })
      .default({}),

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

export type GeneratedId = z.TypeOf<typeof GeneratedIdSchema>;
export type Config = z.TypeOf<typeof ConfigSchema>;
export type ControlCenterItem = z.TypeOf<typeof ControlCenterItemSchema>;
export type ControlCenterState<T> = z.TypeOf<ReturnType<typeof ControlCenterStateSchema<T>>>;
