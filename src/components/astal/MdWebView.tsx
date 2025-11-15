/** @jsxImportSource astal/gtk4 */

import { join } from 'path';
import { Gio, GLib } from 'astal';
import { astalify, Gdk } from 'astal/gtk4';
import WebKit from 'gi://WebKit';
import { createMainBridge } from '@/bridge/main';
import { config } from '@/config';
import type { BridgeMethodsMain, InitParams } from '@/bridge/types';
import type { Gtk } from 'astal/gtk4';

const html = String.raw;
const index = html`
  <!DOCTYPE html>
  <html>
    <body>
      <main></main>
      <script src="midnightway://midnightway/renderer.js" type="module"></script>
    </body>
  </html>
`;

const schemeEnabledContext = new WeakSet<WebKit.WebContext>();
const enableSchemeForContext = (webContext: WebKit.WebContext) => {
  if (schemeEnabledContext.has(webContext)) {
    return;
  }

  webContext.get_security_manager().register_uri_scheme_as_secure('midnightway');
  webContext.register_uri_scheme('midnightway', request => {
    const path = request.get_path();
    if (path === '/') {
      return index;
    }

    const [filename] = GLib.filename_from_uri(import.meta.url);
    const dirname = GLib.path_get_dirname(filename);

    const filePath = path.startsWith('/@fs') ? path.slice(4) : join(dirname, path);
    const file = Gio.file_new_for_path(filePath);
    const stream = file.read(null);
    request.finish(stream, -1, null);
  });

  schemeEnabledContext.add(webContext);
};

const onDecidePolicyMain = (
  _webView: WebKit.WebView,
  decision: WebKit.PolicyDecision,
  decisionType: WebKit.PolicyDecisionType
) => {
  if (decisionType === WebKit.PolicyDecisionType.NAVIGATION_ACTION) {
    const navigationDecision = decision as WebKit.NavigationPolicyDecision;
    const navigationAction = navigationDecision.get_navigation_action();
    const navigationURI = navigationAction.get_request().get_uri();

    const isInternalRequest = navigationURI.startsWith('midnightway://');
    const isWindowOpenRequest =
      navigationAction.get_frame_name() === '' && navigationURI.match(/^about:blank(?:$|[?#])/);

    if (!isInternalRequest && !isWindowOpenRequest) {
      navigationDecision.ignore();
      return true;
    }
  }
};

const onDecidePolicyChild = (
  _webView: WebKit.WebView,
  decision: WebKit.PolicyDecision,
  decisionType: WebKit.PolicyDecisionType
) => {
  if (decisionType === WebKit.PolicyDecisionType.NAVIGATION_ACTION) {
    decision.ignore();
    return true;
  }
};

const WebView = astalify(WebKit.WebView);

type MissingMethods = Omit<Parameters<typeof createMainBridge>[1], 'initParams'>;
export type MdWebViewProps = {
  initParams: Omit<InitParams, 'config'>;
  onCreateChild?: (params: {
    self: WebKit.WebView;
    navigationAction: WebKit.NavigationAction;
  }) => WebKit.WebView | null;
  bridge?: MissingMethods;
  setupBridge?: (bridge: BridgeMethodsMain) => void;
  classNames?: string[];
};

export const MdWebView = ({
  initParams,
  onCreateChild,
  bridge,
  setupBridge,
  classNames = [],
}: MdWebViewProps) => {
  const setupWebView = (webView: WebKit.WebView) =>
    setTimeout(() => {
      webView.set_background_color(new Gdk.RGBA());
      webView.get_settings().set_javascript_can_open_windows_automatically(true);
      webView.connect('decide-policy', onDecidePolicyMain);
      enableSchemeForContext(webView.webContext);

      const shouldInspect = ARGV.includes('--inspect');
      if (shouldInspect) {
        webView.get_settings().set_enable_developer_extras(true);
        webView.get_inspector().show();
      }

      webView.connect('create', (self, navigationAction) => {
        const childWebView = onCreateChild?.({ self, navigationAction });
        if (!childWebView) {
          return null;
        }

        childWebView.set_background_color(new Gdk.RGBA());
        childWebView.connect('decide-policy', onDecidePolicyChild);
        enableSchemeForContext(childWebView.webContext);

        return childWebView;
      });

      webView.load_html(index, 'midnightway://midnightway/');

      const mainBridge = createMainBridge(webView, {
        ...bridge,
        initParams: () => ({ ...initParams, config: config() }) as InitParams,
      });

      setupBridge?.(mainBridge);
    });

  return <WebView cssClasses={classNames} setup={setupWebView} hexpand={true} vexpand={true} />;
};
