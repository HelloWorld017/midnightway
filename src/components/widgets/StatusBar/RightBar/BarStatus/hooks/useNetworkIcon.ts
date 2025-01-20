import { IconNetworkOff, IconNetworkWired, IconNetworkWireless } from '@/assets/icons';
import { repo } from '@/bridge/repository';
import { useRepo } from '@/hooks/useRepo';

const enum NetworkState {
  DISCONNECTED = 2,
  CONNECTED_GLOBAL = 70,
}

const enum NetworkPrimary {
  WIRED = 1,
  WIFI = 2,
}
export const useNetworkIcon = () => {
  const networkStatus = useRepo(repo.network.networkManager.$pick('primary', 'state')) as {
    state: NetworkState;
    primary: NetworkPrimary;
  } | null;

  const IconNetwork =
    networkStatus?.state === NetworkState.CONNECTED_GLOBAL
      ? networkStatus.primary === NetworkPrimary.WIFI
        ? IconNetworkWireless
        : IconNetworkWired
      : IconNetworkOff;

  return IconNetwork;
};
