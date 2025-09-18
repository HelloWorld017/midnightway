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
const WebView = astalify(WebKit.WebView);

type MissingMethods = Omit<Parameters<typeof createMainBridge>[1], 'initParams'>;
type MdWebViewProps = {
  initParams: Omit<InitParams, 'config'>;
  onCreateChild?: (
    self: WebKit.WebView,
    navigationAction: WebKit.NavigationAction
  ) => Gtk.Widget | null;
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

      if (!schemeEnabledContext.has(webView.webContext)) {
        webView.webContext.get_security_manager().register_uri_scheme_as_secure('midnightway');
        webView.webContext.register_uri_scheme('midnightway', request => {
          if (request.get_path() === '/') {
            return index;
          }

          const [filename] = GLib.filename_from_uri(import.meta.url);
          const dirname = GLib.path_get_dirname(filename);
          const file = Gio.file_new_for_path(join(dirname, request.get_path()));
          const stream = file.read(null);
          request.finish(stream, -1, null);
        });

        schemeEnabledContext.add(webView.webContext);
      }

      const shouldInspect = ARGV.includes('--inspect');
      if (shouldInspect) {
        webView.get_settings().set_enable_developer_extras(true);
        webView.get_inspector().show();
      }

      webView.connect(
        'create',
        (self, navigationAction) => onCreateChild?.(self, navigationAction) ?? null
      );

      webView.load_html(index, 'midnightway://midnightway/');

      const mainBridge = createMainBridge(webView, {
        ...bridge,
        initParams: () => ({ ...initParams, config: config() }) as InitParams,
      });

      setupBridge?.(mainBridge);
    });

  return <WebView cssClasses={classNames} setup={setupWebView} hexpand={true} vexpand={true} />;
};
