import { IconNetwork, IconRouteOff, IconWifi } from '@/assets/icons';
import { repo } from '@/bridge/repository';
import { NetworkPrimary, NetworkState } from '@/constants/gir';
import { useRepo } from '@/hooks/useRepo';
import { defineI18n } from '@simplei18n/core';
import { useI18n } from '@simplei18n/core/react';
import { match, P } from 'ts-pattern';

defineI18n(
  yaml => yaml`
  # scope: controlCenter
  networkConnected: 'Connected'
  networkConnectedWithoutGlobal: 'Local Only'
  networkConnecting: 'Connecting'
  networkDisconnecting: 'Disconnecting'
  networkDisconnected: 'Not Connected'
`,
);

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

  const { ts } = useI18n();
  const stateText = match(networkStatus?.state)
    .with(NetworkState.CONNECTED_GLOBAL, () => ts(ts.controlCenter.networkConnected))
    .with(P.union(NetworkState.CONNECTED_SITE, NetworkState.CONNECTED_LOCAL), () =>
      ts(ts.controlCenter.networkConnectedWithoutGlobal),
    )
    .with(NetworkState.CONNECTING, () => ts(ts.controlCenter.networkConnecting))
    .with(NetworkState.DISCONNECTING, () => ts(ts.controlCenter.networkDisconnecting))
    .otherwise(() => ts(ts.controlCenter.networkDisconnected));

  return { isConnected, icon: <Icon />, text: stateText };
};
