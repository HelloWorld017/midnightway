import { config } from '@/config';
import { asConnectable, poll } from '@/utils/binding';
import { execAsync } from 'ags/process';
import AstalNetwork from 'gi://AstalNetwork';
import * as z from 'zod';

const zIpOutput = z.array(
  z.object({
    ifname: z.string(),
    stats64: z.object({
      rx: z.object({ bytes: z.number().finite().nonnegative() }),
      tx: z.object({ bytes: z.number().finite().nonnegative() }),
    }),
  }),
);

type Usage = {
  initialRx: number | null;
  initialTx: number | null;
  totalRx: number;
  totalTx: number;
};

const network = AstalNetwork.get_default();
const networkUsage = poll<Usage>(
  {
    initialRx: null,
    initialTx: null,
    totalRx: 0,
    totalTx: 0,
  },
  config().system.updateInterval,
  async prev => {
    const out = await execAsync([
      'ip',
      '-s',
      '-j',
      'link',
      'show',
      config().system.networkInterface,
    ]);
    const ipOutput = zIpOutput.parse(JSON.parse(out));
    const totalRx = ipOutput.reduce((prev, item) => prev + item.stats64.rx.bytes, 0);
    const totalTx = ipOutput.reduce((prev, item) => prev + item.stats64.tx.bytes, 0);

    return {
      initialRx: Math.min(totalRx, prev.initialRx ?? totalRx),
      initialTx: Math.min(totalTx, prev.initialTx ?? totalTx),
      totalTx,
      totalRx,
    };
  },
);

export const networkRepository = asConnectable({
  networkManager: network,
  usage: networkUsage,
});
