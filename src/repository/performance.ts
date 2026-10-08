import { createSubprocess } from 'ags/process';
import * as z from 'zod';
import { config } from '@/config';
import { asConnectable, bindFile } from '@/utils/binding';

const VMSTAT_NAMES = {
  r: 'processWaiting',
  b: 'processBlocked',
  swpd: 'memorySwap',
  free: 'memoryFree',
  buff: 'memoryBuffer',
  cache: 'memoryCache',
  si: 'swapIn',
  so: 'swapOut',
  bi: 'blocksIn',
  bo: 'blocksOut',
  in: 'systemInterrupts',
  cs: 'systemContextSwitches',
  us: 'cpuUser',
  sy: 'cpuSystem',
  id: 'cpuIdle',
  wa: 'cpuWait',
  st: 'cpuStolen',
  gu: 'cpuGuest',
} as const;

type VmStatKeys = keyof typeof VMSTAT_NAMES;
const zVmStatKey = z.custom<VmStatKeys>(
  key => typeof key === 'string' && Object.hasOwn(VMSTAT_NAMES, key)
);

const zVmStatHeaders = z.array(zVmStatKey);
const zVmStatValues = z
  .record(z.nativeEnum(VMSTAT_NAMES), z.number().finite())
  .and(z.object({ cpuIdle: z.number().finite() }));

type VmStat = {
  headers?: z.TypeOf<typeof zVmStatHeaders>;
  values?: z.TypeOf<typeof zVmStatValues>;
};

const zSystemNumber = z.string().trim().min(1).pipe(z.coerce.number().finite().nonnegative());
const zMemory = z.object({
  total: z.number().finite().nonnegative(),
  available: z.number().finite().nonnegative(),
});

const vmstat = createSubprocess<VmStat>({}, ['vmstat', '1', '-y'], (out, prev) => {
  try {
    out = out.trim();
    if (!/^\d/.test(out)) {
      if (out.startsWith('r ')) {
        return { headers: zVmStatHeaders.parse(out.split(/\s+/)) };
      }

      return prev;
    }

    const { headers } = prev;
    if (!headers) {
      return {
        headers: Object.keys(VMSTAT_NAMES) as VmStatKeys[],
      };
    }

    const row = z.array(z.coerce.number().finite()).length(headers.length).parse(out.split(/\s+/));
    const values = zVmStatValues.parse(
      Object.fromEntries(row.map((value, index) => [VMSTAT_NAMES[headers[index]], value]))
    );

    return { headers, values };
  } catch (err) {
    console.error(err);
    return prev;
  }
});

const { gpuCard, updateInterval } = config().system;
const gpuUsage = bindFile(
  gpuCard && `/sys/class/drm/${gpuCard}/device/gpu_busy_percent`,
  value => zSystemNumber.pipe(z.number().max(100)).parse(value),
  updateInterval
);

const gpuMemUsed = bindFile(
  gpuCard && `/sys/class/drm/${gpuCard}/device/mem_info_vram_used`,
  value => zSystemNumber.parse(value),
  updateInterval
);

const gpuMemTotal = bindFile(
  gpuCard && `/sys/class/drm/${gpuCard}/device/mem_info_vram_total`,
  value => zSystemNumber.parse(value),
  updateInterval
);

const memory = bindFile(
  '/proc/meminfo',
  value =>
    zMemory.parse(
      Object.fromEntries(
        Array.from(value.matchAll(/^Mem(Total|Available):\s*(\d+)[\skB]*$/gm)).map(
          ([, key, value]) => [key.toLowerCase(), Number(value) * 1024]
        )
      )
    ),
  updateInterval
);

export const performanceRepository = asConnectable({
  cpuUsage: vmstat(stat => (stat.values ? 100 - stat.values.cpuIdle : null)),
  gpuUsage,
  gpuMemUsed,
  gpuMemTotal,
  memoryUsed: memory(value => (value ? value.total - value.available : null)),
  memoryTotal: memory(value => value?.total ?? null),
});
