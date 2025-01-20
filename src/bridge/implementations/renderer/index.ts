import { debugImpl } from './debug';
import { subscribeImpl, unsubscribeImpl } from './subscribe';
import type { BridgeMethodsMain } from '@/bridge/types';
import type { MethodsProxy } from '@/utils/methodsProxy';

export const methodsRendererImpl = (bridge: MethodsProxy<BridgeMethodsMain>) => ({
  debug: debugImpl(bridge),
  subscribe: subscribeImpl(bridge),
  unsubscribe: unsubscribeImpl(bridge),
});
