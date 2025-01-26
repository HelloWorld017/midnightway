import { debugImpl } from './debug';
import { invokeImpl } from './invoke';
import { subscribeImpl, unsubscribeImpl } from './subscribe';
import type { BridgeMethodsMain } from '@/bridge/types';
import type { MethodsProxy } from '@/utils/methodsProxy';

export const methodsRendererImpl = (bridge: MethodsProxy<BridgeMethodsMain>) => ({
  debug: debugImpl(bridge),
  invoke: invokeImpl(bridge),
  subscribe: subscribeImpl(bridge),
  unsubscribe: unsubscribeImpl(bridge),
});
