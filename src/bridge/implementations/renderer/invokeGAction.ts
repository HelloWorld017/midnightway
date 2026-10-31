import { repositoryImpl } from '@/repository';
import { applyDescriptor } from '@/utils/repositoryProxy/operations';
import GLib from 'gi://GLib?version=2.0';
import type { BridgeMethodsMain, BridgeMethodsRenderer } from '@/bridge/types';
import type { MethodsProxy } from '@/utils/methodsProxy';
import type Gio from 'gi://Gio?version=2.0';

export const invokeGActionImpl =
  (_: MethodsProxy<BridgeMethodsMain>): BridgeMethodsRenderer['invokeGAction'] =>
  ({ descriptor, action, actionTarget }) => {
    const [, ...path] = descriptor;
    const result = applyDescriptor<Gio.ActionGroup>(path, repositoryImpl);
    const target = actionTarget && new GLib.Variant('s', actionTarget);
    result.activate_action(action, target || null);
  };
