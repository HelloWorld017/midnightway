import JavaScriptCore from 'gi://JavaScriptCore';
import { createMethodsProxy } from '@/utils/methodsProxy';
import { methodsRendererImpl } from './implementations/renderer';
import type { BridgeMethodsMain, BridgeMethodsRenderer } from './types';
import type WebKit from 'gi://WebKit';

const js = (template: TemplateStringsArray, ...values: unknown[]) =>
  String.raw(template, ...values.map(value => JSON.stringify(value)));

type MissingMethods = Omit<BridgeMethodsRenderer, keyof ReturnType<typeof methodsRendererImpl>>;
type Message = { id: string; name: string; params: unknown };

export const createMainBridge = (webView: WebKit.WebView, methodsImpl: Partial<MissingMethods>) => {
  /* Create Bridge */
  const bridge = createMethodsProxy<BridgeMethodsMain>((name: string, params: unknown) => {
    const id = `${Date.now()}+${Math.random().toString(36).slice(2, 7)}`;
    const outputPromise = new Promise(resolve => {
      callbackPool.set(id, resolve);
      setTimeout(() => {
        resolve(undefined);
        callbackPool.delete(id);
      }, 1000);
    });

    const code = js`
      window.dispatchEvent(
        new CustomEvent('bridge', { detail: { id: ${id}, name: ${name}, params: ${params} } })
      )
    `;

    webView.evaluate_javascript(code, -1, null, null, null, null);
    return outputPromise;
  });

  /* Renderer Methods Handling */
  const impl = { ...methodsRendererImpl(bridge), ...methodsImpl };
  const contentManager = webView.userContentManager;
  contentManager.register_script_message_handler_with_reply('bridge', null);
  contentManager.connect('script-message-with-reply-received', (_source, value, reply) => {
    const { name, params } = JSON.parse(value.to_json(0)) as Message;
    if (name.startsWith('reply/')) {
      return;
    }

    if (!(name in impl)) {
      console.error(`Unknown message: ${name}, ignoring`);
      return;
    }

    const output = (impl as Record<string, (params: unknown) => void>)[name](params);
    const outputValue = JavaScriptCore.Value.new_from_json(
      value.context,
      JSON.stringify(output) ?? 'null'
    );

    reply.return_value(outputValue);
  });

  /* Reply Handling */
  const callbackPool = new Map<string, (output: unknown) => void>();
  contentManager.register_script_message_handler('bridgeReply', null);
  contentManager.connect('script-message-received', (_source, value) => {
    const { name, params } = JSON.parse(value.to_json(0)) as Message;
    if (!name.startsWith('reply/')) {
      return;
    }

    const originId = name.slice(6);
    const callback = callbackPool.get(originId);
    callback?.(params);
  });

  return bridge;
};
