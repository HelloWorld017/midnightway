import { GLib } from 'astal';
import { applyDescriptor } from '@/utils/repositoryProxy/bind';
import type { BridgeMethodsMain, BridgeMethodsRenderer } from '@/bridge/types';
import type { MethodsProxy } from '@/utils/methodsProxy';
import type { Gio } from 'astal';

export const invokeGActionImpl =
  (_: MethodsProxy<BridgeMethodsMain>): BridgeMethodsRenderer['invokeGAction'] =>
  ({ descriptor, action, actionTarget }) => {
    const result = applyDescriptor<Gio.ActionGroup>(descriptor);
    const target = actionTarget && new GLib.Variant('s', actionTarget);
    result.activate_action(action, target || null);
  };
