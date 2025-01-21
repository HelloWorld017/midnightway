/** @jsxImportSource astal/gtk4 */

import { join } from 'path';
import { Gio } from 'astal';
import { astalify, Gdk } from 'astal/gtk4';
import WebKit from 'gi://WebKit';
import { createMainBridge } from '@/bridge/main';
import { config } from '@/config';
import type { InitParams } from '@/bridge/types';

const html = String.raw;
const schemeEnabledContext = new WeakSet<WebKit.WebContext>();
const WebView = astalify(WebKit.WebView);

type MissingMethods = Omit<Parameters<typeof createMainBridge>[1], 'initParams'>;
type MdWebViewProps = {
  initParams: Omit<InitParams, 'config'>;
  bridge?: MissingMethods;
  classNames?: string[];
};

export const MdWebView = ({ initParams, bridge, classNames = [] }: MdWebViewProps) => {
  const setupWebView = (webView: WebKit.WebView) =>
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

      const shouldInspect = ARGV.includes('--inspect');
      if (shouldInspect) {
        webView.get_settings().set_enable_developer_extras(true);
        webView.get_inspector().show();
      }

      webView.load_html(
        html`<!DOCTYPE html>
          <html>
            <body>
              <main></main>
              <script src="midnightway://midnightway/renderer.js" type="module"></script>
            </body>
          </html>`,
        'midnightway://midnightway/'
      );

      createMainBridge(webView, {
        ...bridge,
        initParams: () => ({ ...initParams, config: config() }),
      });
    });

  return <WebView cssClasses={classNames} setup={setupWebView} hexpand={true} vexpand={true} />;
};
