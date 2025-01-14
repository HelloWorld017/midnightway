declare global {
  interface Window {
    webkit: {
      messageHandlers: {
        bridge: {
          postMessage: (...args: unknown[]) => Promise<unknown>;
        };
        bridgeReply: {
          postMessage: (...args: unknown[]) => Promise<void>;
        };
      };
    };
  }

  interface GlobalEventHandlersEventMap {
    bridge: CustomEvent<{ id: string; name: string; params: unknown }>;
  }
}

export {};
