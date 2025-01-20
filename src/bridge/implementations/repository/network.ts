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

const network = AstalNetwork.get_default();
const networkUsage = Variable<IpOutput>([]).poll(
  1000,
  ['ip', '-s', '-j', 'link', 'show', config().system.networkInterface],
  out => JSON.parse(out) as IpOutput
);

export const networkRepository = asConnectable({
  networkManager: network,
  usage: networkUsage,
});
