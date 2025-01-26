import { Variable } from 'astal';
import AstalNetwork from 'gi://AstalNetwork';
import { config } from '@/config';
import { asConnectable } from '@/utils/binding';

type IpOutput = {
  ifname: string;
  stats64: {
    rx: { bytes: number };
    tx: { bytes: number };
  };
}[];

type Usage = {
  initialRx: number | null;
  initialTx: number | null;
  totalRx: number;
  totalTx: number;
};

const network = AstalNetwork.get_default();
const networkUsage = Variable<Usage>({
  initialRx: null,
  initialTx: null,
  totalRx: 0,
  totalTx: 0,
}).poll(
  config().system.updateInterval,
  ['ip', '-s', '-j', 'link', 'show', config().system.networkInterface],
  (out, prev) => {
    const ipOutput = JSON.parse(out) as IpOutput;
    const totalRx = ipOutput?.reduce((prev, item) => prev + item.stats64.rx.bytes, 0);
    const totalTx = ipOutput?.reduce((prev, item) => prev + item.stats64.tx.bytes, 0);

    return {
      initialRx: prev.initialRx ?? totalRx,
      initialTx: prev.initialTx ?? totalTx,
      totalTx,
      totalRx,
    };
  }
);

export const networkRepository = asConnectable({
  networkManager: network,
  usage: networkUsage,
});
