import { repositoryImpl } from '@/repository';
import { createRepositoryProxy } from '@/utils/repositoryProxy';
import { bindRepositoryProxy } from '@/utils/repositoryProxy/bind';
import type { BridgeMethodsMain, BridgeMethodsRenderer } from '@/bridge/types';
import type { MethodsProxy } from '@/utils/methodsProxy';

const subscriptions = new Map<string, () => void>();
export const subscribeImpl =
  (bridge: MethodsProxy<BridgeMethodsMain>): BridgeMethodsRenderer['subscribe'] =>
  ({ descriptor }) => {
    const id = Math.random().toString(36).slice(2, 9);
    const proxy = createRepositoryProxy(descriptor);
    const bindable = bindRepositoryProxy(proxy, repositoryImpl);

    subscriptions.set(
      id,
      bindable.subscribe(() => {
        void bridge.onUpdate({
          id,
          value: bindable.get(),
        });
      })
    );

    return { id, value: bindable.get() };
  };

export const unsubscribeImpl =
  (_bridge: MethodsProxy<BridgeMethodsMain>): BridgeMethodsRenderer['unsubscribe'] =>
  ({ id }) => {
    subscriptions.get(id)?.();
    subscriptions.delete(id);
  };
