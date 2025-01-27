import * as z from 'zod';

const zGeneratedId = z
  .string()
  .default('')
  .transform(id => id || Math.random().toString(36).slice(2))
  .brand('Id');

const zControlCenterState = <T>(type: z.ZodSchema<T>) =>
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

const zControlCenterItem = z
  .discriminatedUnion('kind', [
    z.object({
      icon: z.string(),
      title: z.union([z.string(), z.object({ active: z.string(), inactive: z.string() })]),
      description: z.union([z.string(), z.object({ active: z.string(), inactive: z.string() })]),
      kind: z.literal('toggle'),
      state: zControlCenterState(z.boolean()),
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
      state: zControlCenterState(z.number()),
    }),
    z.object({
      kind: z.enum(['network', 'silent', 'volume-slider']),
    }),
  ])
  .and(z.object({ id: zGeneratedId }));

export const zConfig = z
  .object({
    locale: z.enum(['en-US', 'ko-KR']).default('en-US'),

    controlCenter: z
      .object({
        items: z.tuple([z.array(zControlCenterItem), z.array(zControlCenterItem)]).default([
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

export type GeneratedId = z.TypeOf<typeof zGeneratedId>;
export type Config = z.TypeOf<typeof zConfig>;
export type ControlCenterItem = z.TypeOf<typeof zControlCenterItem>;
export type ControlCenterState<T> = z.TypeOf<ReturnType<typeof zControlCenterState<T>>>;
