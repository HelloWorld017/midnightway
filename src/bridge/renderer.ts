import { createMethodsProxy } from '@/utils/methodsProxy';
import { methodsMainImpl } from './implementations/main';
import type { BridgeMethodsMain, BridgeMethodsRenderer } from './types';

export const bridgeRenderer = createMethodsProxy<BridgeMethodsRenderer>((name, params) =>
  window.webkit.messageHandlers.bridge.postMessage({
    name,
    params,
  })
);

export const registerImplementations = (impl: Partial<BridgeMethodsMain>) => {
  const handler = ({ detail: { id, name, params } }: WindowEventMap['bridge']) => {
    if (!(name in impl)) {
      return;
    }

    const output = (impl as Record<string, (params: unknown) => void>)[name](params);
    void window.webkit.messageHandlers.bridge.postMessage({
      name: `reply/${id}`,
      params: output,
    });
  };

  window.addEventListener('bridge', handler);
  return () => window.removeEventListener('bridge', handler);
};

registerImplementations(methodsMainImpl(bridgeRenderer));
