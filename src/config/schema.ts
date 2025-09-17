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
      kind: z.literal('toggle'),
      icon: z.string(),
      title: z.union([z.string(), z.object({ active: z.string(), inactive: z.string() })]),
      description: z.union([z.string(), z.object({ active: z.string(), inactive: z.string() })]),
      state: zControlCenterState(z.boolean()),
      activateCommand: z.string(),
      deactivateCommand: z.string(),
    }),
    z.object({
      kind: z.literal('button'),
      icon: z.string(),
      command: z.string(),
    }),
    z.object({
      kind: z.literal('slider'),
      icon: z.string(),
      command: z.string().describe('use {{percent}} or {{frac}} to interpolate the slider value'),
      state: zControlCenterState(z.number()),
    }),
    z.object({
      kind: z.enum(['network', 'silent', 'volume-slider', 'bluetooth']),
    }),
  ])
  .and(z.object({ id: zGeneratedId }));

const zBarStatusItem = z
  .discriminatedUnion('kind', [
    z.object({
      kind: z.literal('performance'),
      visibility: z.enum(['minimized', 'default', 'full']),
      threshold: z.number().default(50),
    }),
    z.object({
      kind: z.literal('temperature'),
      visibility: z.enum(['minimized', 'default', 'full']),
      threshold: z.number().default(60),
    }),
    z.object({
      kind: z.literal('network'),
      visibility: z.enum(['default', 'full']),
    }),
    z.object({
      kind: z.literal('sound'),
      visibility: z.enum(['default', 'full']),
    }),
    z.object({
      kind: z.literal('battery'),
      visibility: z.enum(['default', 'full']),
    }),
  ])
  .and(z.object({ id: zGeneratedId }));

export const zConfig = z
  .object({
    locale: z.enum(['en-US', 'ko-KR']).default('en-US'),

    bar: z
      .object({
        autohide: z.boolean().default(false),
        maxSizes: z
          .object({
            workspace: z.number().default(220),
            music: z.number().default(160),
          })
          .default({}),
        status: z
          .object({
            items: z.array(zBarStatusItem).default([
              { kind: 'temperature', visibility: 'default' },
              { kind: 'performance', visibility: 'default' },
              { kind: 'network', visibility: 'default' },
              { kind: 'sound', visibility: 'default' },
              { kind: 'battery', visibility: 'full' },
            ]),
          })
          .default({}),
      })
      .default({}),

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

export type Config = z.TypeOf<typeof zConfig>;

export type BarStatusItem = z.TypeOf<typeof zBarStatusItem>;
export type ControlCenterItem = z.TypeOf<typeof zControlCenterItem>;
export type ControlCenterState<T> = z.TypeOf<ReturnType<typeof zControlCenterState<T>>>;
export type GeneratedId = z.TypeOf<typeof zGeneratedId>;
