/** @jsxImportSource astal/gtk4 */

import { join } from 'path';
import { App, Astal, astalify, Gdk } from 'astal/gtk4';
import Gio from 'gi://Gio';
import WebKit from 'gi://WebKit';
import { createMainBridge } from './bridge/main';
import { cssAstal as css } from './utils/css';
import type { InitParams } from './bridge/types';

const { Exclusivity, WindowAnchor } = Astal;
const WebView = astalify(WebKit.WebView);

const webViewStyle = css`
  min-height: 60px;
  background: transparent;
`;

const schemeEnabledContext = new WeakSet<WebKit.WebContext>();

App.start({
  main() {
    const setupWebView = (initParams: InitParams) => (webView: WebKit.WebView) =>
      setTimeout(() => {
        webView.set_background_color(new Gdk.RGBA());

        if (!schemeEnabledContext.has(webView.webContext)) {
          webView.webContext.register_uri_scheme('midnightway', request => {
            const file = Gio.file_new_for_path(join('./dist', request.get_path()));
            const stream = file.read(null);
            request.finish(stream, -1, null);
          });

          schemeEnabledContext.add(webView.webContext);
        }

        webView.load_html(
          '<main></main><script src="midnightway://midnightway/renderer.js"></script>',
          'about:blank'
        );

        const shouldInspect = ARGV.includes('--inspect');
        if (shouldInspect) {
          webView.get_settings().set_enable_developer_extras(true);
          webView.get_inspector().show();
        }

        createMainBridge(webView, { initParams: () => initParams });
      });

    App.add_icons('./icons');
    App.get_monitors().map(monitor => (
      <window
        visible
        gdkmonitor={monitor}
        exclusivity={Exclusivity.EXCLUSIVE}
        anchor={WindowAnchor.TOP | WindowAnchor.LEFT | WindowAnchor.RIGHT}
        application={App}
        cssClasses={[webViewStyle]}
      >
        <WebView
          cssClasses={[webViewStyle]}
          setup={setupWebView({ kind: 'status-bar', params: { monitor: monitor.connector } })}
          hexpand={true}
          vexpand={true}
        />
      </window>
    ));
  },
});
