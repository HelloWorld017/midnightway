import { execAsync } from 'astal';
import type { BridgeMethodsMain, BridgeMethodsRenderer } from '@/bridge/types';
import type { MethodsProxy } from '@/utils/methodsProxy';

export const execImpl =
  (_bridge: MethodsProxy<BridgeMethodsMain>): BridgeMethodsRenderer['exec'] =>
  ({ command }) =>
    execAsync(command).catch(() => {});
