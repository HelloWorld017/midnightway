import { subscribeImpl, unsubscribeImpl } from './subscribe';
import type { BridgeMethodsMain } from '@/bridge/types';
import type { MethodsProxy } from '@/utils/proxy';

export const methodsRendererImpl = (bridge: MethodsProxy<BridgeMethodsMain>) => ({
  subscribe: subscribeImpl(bridge),
  unsubscribe: unsubscribeImpl(bridge),
});
