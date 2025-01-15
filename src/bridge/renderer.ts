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
  window.addEventListener('bridge', ({ detail: { id, name, params } }) => {
    if (!(name in impl)) {
      return;
    }

    const output = (impl as Record<string, (params: unknown) => void>)[name](params);
    void window.webkit.messageHandlers.bridge.postMessage({
      name: `reply/${id}`,
      params: output,
    });
  });
};

registerImplementations(methodsMainImpl(bridgeRenderer));
