import { useTranslation } from 'react-i18next';
import { match, P } from 'ts-pattern';
import { IconNetwork, IconRouteOff, IconWifi } from '@/assets/icons';
import { repo } from '@/bridge/repository';
import { useRepo } from '@/hooks/useRepo';

const enum NetworkState {
  UNKNOWN = 0,
  ASLEEP = 10,
  DISCONNECTED = 20,
  DISCONNECTING = 30,
  CONNECTING = 40,
  CONNECTED_LOCAL = 50,
  CONNECTED_SITE = 60,
  CONNECTED_GLOBAL = 70,
}

const enum NetworkPrimary {
  WIRED = 1,
  WIFI = 2,
}

export const useNetworkState = () => {
  const networkStatus = useRepo(repo.network.networkManager.$pick('primary', 'state')) as {
    state: NetworkState;
    primary: NetworkPrimary;
  } | null;

  const isConnected = networkStatus?.state === NetworkState.CONNECTED_GLOBAL;

  const Icon = isConnected
    ? networkStatus.primary === NetworkPrimary.WIFI
      ? IconWifi
      : IconNetwork
    : IconRouteOff;

  const { t } = useTranslation();
  const stateText = match(networkStatus?.state)
    .with(NetworkState.CONNECTED_GLOBAL, () => t('control-center.network-connected'))
    .with(P.union(NetworkState.CONNECTED_SITE, NetworkState.CONNECTED_LOCAL), () =>
      t('control-center.network-connected-without-global')
    )
    .with(NetworkState.CONNECTING, () => t('control-center.network-connecting'))
    .with(NetworkState.DISCONNECTING, () => t('control-center.network-disconnecting'))
    .otherwise(() => t('control-center.network-disconnected'));

  return { isConnected, icon: <Icon />, text: stateText };
};
