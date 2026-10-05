import { debugImpl } from './debug';
import { execImpl } from './exec';
import { invokeImpl } from './invoke';
import { invokeGActionImpl } from './invokeGAction';
import { subscriptionMethods } from './subscribe';
import { traverseMenuImpl } from './traverseMenu';
import type { BridgeMethodsMain } from '@/bridge/types';
import type { MethodsProxy } from '@/utils/methodsProxy';

export const methodsRendererImpl = (bridge: MethodsProxy<BridgeMethodsMain>) => ({
  debug: debugImpl(bridge),
  exec: execImpl(bridge),
  invoke: invokeImpl(bridge),
  invokeGAction: invokeGActionImpl(bridge),
  ...subscriptionMethods(bridge),
  traverseMenu: traverseMenuImpl(bridge),
});
