import { Variable } from 'astal';
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
type VmStatNames = (typeof VMSTAT_NAMES)[VmStatKeys];
type VmStat = { headers?: VmStatKeys[]; values?: Record<VmStatNames, number> };

const vmstat = Variable<VmStat>({}).watch(['vmstat', '1', '-y'], (out, prev) => {
  const { headers } = prev;
  if (!headers) {
    return {
      headers: (out.match(/^[a-z\s]+$/m)?.[0].match(/[a-z]+/g) ??
        Object.keys(VMSTAT_NAMES)) as VmStatKeys[],
    };
  }

  const values = Object.fromEntries(
    Array.from(out.matchAll(/(\d+)\s+/g)).map(([, value], index) => [
      VMSTAT_NAMES[headers[index]],
      parseInt(value, 10),
    ])
  ) as Record<VmStatNames, number>;

  return { headers, values };
});

const { gpuCard, updateInterval } = config().system;
const gpuUsage = bindFile(
  gpuCard && `/sys/class/drm/${gpuCard}/device/gpu_busy_percent`,
  value => Number(value),
  updateInterval
);

const gpuMemUsed = bindFile(
  gpuCard && `/sys/class/drm/${gpuCard}/device/mem_info_vram_used`,
  value => Number(value),
  updateInterval
);

const gpuMemTotal = bindFile(
  gpuCard && `/sys/class/drm/${gpuCard}/device/mem_info_vram_total`,
  value => Number(value),
  updateInterval
);

const memory = bindFile(
  '/proc/meminfo',
  value =>
    Object.fromEntries(
      Array.from(value.matchAll(/^Mem(Total|Available):\s*(\d+)[\skB]*$/gm)).map(
        ([, key, value]) => [key.toLowerCase(), Number(value) * 1024]
      )
    ) as Record<'total' | 'available', number>,
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
