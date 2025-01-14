import { createRepositoryProxy } from '@/utils/proxy';
import { bindRepositoryProxy } from '@/utils/proxy/bind';
import { repositoryImpl } from '../repository';
import type { BridgeMethodsMain, BridgeMethodsRenderer } from '@/bridge/types';
import type { MethodsProxy } from '@/utils/proxy';

const pathById = new Map<string, string>();
const bridgeById = new Map<string, BridgeMethodsMain>();
const pickById = new Map<string, string[]>();
const cleanupByPath = new Map<string, () => void>();
const subscriptions = new Map<string, Set<string>>();

const pickValue = (value: unknown, pick?: string[] | null) =>
  pick && value
    ? Object.fromEntries(pick.map(key => [key, (value as Record<string, unknown>)[key]]))
    : value;

export const subscribeImpl =
  (bridge: MethodsProxy<BridgeMethodsMain>): BridgeMethodsRenderer['subscribe'] =>
  ({ path, pick }) => {
    const id = Math.random().toString(36).slice(2, 9);
    pathById.set(id, path);
    bridgeById.set(id, bridge);
    if (pick) {
      pickById.set(id, pick);
    }

    const proxy = createRepositoryProxy(path);
    const bindable = bindRepositoryProxy(proxy, repositoryImpl);

    if (subscriptions.get(path)?.add(id)) {
      return { id, value: pickValue(bindable.get(), pick) };
    }

    subscriptions.set(path, new Set([id]));
    cleanupByPath.set(
      path,
      bindable.subscribe(() => {
        const value = bindable.get();
        subscriptions.get(path)?.forEach(id =>
          bridgeById.get(id)?.update({
            id,
            value: pickValue(value, pickById.get(id)),
          })
        );
      })
    );

    return { id, value: pickValue(bindable.get(), pick) };
  };

export const unsubscribeImpl =
  (_bridge: MethodsProxy<BridgeMethodsMain>): BridgeMethodsRenderer['unsubscribe'] =>
  ({ id }) => {
    const path = pathById.get(id)!;
    pathById.delete(id);
    bridgeById.delete(id);

    const subscriptionMap = subscriptions.get(path);
    subscriptionMap?.delete(id);
    if (subscriptionMap?.size ?? 0 > 0) {
      return;
    }

    const cleanup = cleanupByPath.get(path);
    cleanup?.();

    cleanupByPath.delete(path);
    subscriptions.delete(path);
  };
