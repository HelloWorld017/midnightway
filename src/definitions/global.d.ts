declare global {
  interface Window {
    $debug: (...args: unknown[]) => void;
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
