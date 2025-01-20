/* eslint-disable no-console */
import type { BridgeMethodsMain, BridgeMethodsRenderer } from '@/bridge/types';
import type { MethodsProxy } from '@/utils/methodsProxy';

export const debugImpl =
  (_bridge: MethodsProxy<BridgeMethodsMain>): BridgeMethodsRenderer['debug'] =>
  (args: unknown) =>
    console.log('[Renderer] ', args);
