import { repositoryImpl } from '@/repository';
import { createRepositoryProxy } from '@/utils/repositoryProxy';
import { bindRepositoryProxy } from '@/utils/repositoryProxy/bind';
import { onCleanup } from 'ags';
import type { BridgeMethodsMain, BridgeMethodsRenderer } from '@/bridge/types';
import type { MethodsProxy } from '@/utils/methodsProxy';

export const subscriptionMethods = (bridge: MethodsProxy<BridgeMethodsMain>) => {
  const subscriptions = new Map<string, () => void>();
  onCleanup(() => {
    subscriptions.forEach(cleanup => cleanup());
    subscriptions.clear();
  });
  const subscribe: BridgeMethodsRenderer['subscribe'] = ({ descriptor }) => {
    const id = Math.random().toString(36).slice(2, 9);
    const proxy = createRepositoryProxy(descriptor);
    const bindable = bindRepositoryProxy(proxy, repositoryImpl);

    subscriptions.set(
      id,
      bindable.subscribe(value => {
        void bridge.onUpdate({
          id,
          value,
        });
      }),
    );

    return { id, value: bindable.get() };
  };

  const unsubscribe: BridgeMethodsRenderer['unsubscribe'] = ({ id }) => {
    subscriptions.get(id)?.();
    subscriptions.delete(id);
  };
  return { subscribe, unsubscribe };
};
