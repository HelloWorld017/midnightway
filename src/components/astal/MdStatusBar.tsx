/** @jsxImportSource astal/gtk4 */

import { App, Astal, Gtk, Gdk } from 'astal/gtk4';
import WebKit from 'gi://WebKit';
import cairo from 'gi://cairo';
import { ref } from '@/utils/binding';
import { cssAstal as css } from '@/utils/css';
import { MdWebView } from './MdWebView';
import type { BridgeMethodsMain } from '@/bridge/types';

const { Layer, WindowAnchor } = Astal;

const transparentStyle = css`
  background: transparent;
`;

export const MdStatusBar = ({ monitor }: { monitor: Gdk.Monitor }) => {
  const toolkitWindowRef = ref<Astal.Window | null>(null);
  const bridgeRef = ref<BridgeMethodsMain | null>(null);

  const setupWindow = (window: Astal.Window) => {
    const surface = window.get_surface()!;
    const rect = new cairo.RectangleInt({
      x: 0,
      y: 0,
      width: monitor.get_geometry().width,
      height: 32,
    });

    const region = Astal.Utils.create_region_by_rectangles(rect);
    surface.set_input_region(region);
  };

  const setupToolkitWindow = (window: Astal.Window) => {
    const eventController = new Gtk.EventControllerFocus();
    eventController.connect('leave', () => {
      bridgeRef.current?.onToolkitCloseRequest();
    });

    window.add_controller(eventController);
    toolkitWindowRef(window);
  };

  return (
    <>
      <window
        visible
        gdkmonitor={monitor}
        exclusivitySize={32}
        layer={Layer.TOP}
        anchor={WindowAnchor.LEFT | WindowAnchor.RIGHT | WindowAnchor.TOP}
        application={App}
        cssClasses={[transparentStyle]}
        setup={setupWindow}
        defaultHeight={70}
      >
        <MdWebView
          initParams={{ kind: 'status-bar', params: { monitor: monitor.connector } }}
          onCreateChild={self => {
            const webView = new WebKit.WebView({ hexpand: true, vexpand: true, relatedView: self });
            webView.set_background_color(new Gdk.RGBA());
            toolkitWindowRef.current?.set_child(webView);

            return webView;
          }}
          bridge={{
            prepareOpenToolkit() {
              toolkitWindowRef.current?.present();
            },
            closeToolkit() {
              toolkitWindowRef.current?.hide();
              toolkitWindowRef.current?.set_child(null);
            },
          }}
          setupBridge={bridgeRef}
        />
      </window>
      <window
        visible={false}
        gdkmonitor={monitor}
        layer={Layer.OVERLAY}
        anchor={WindowAnchor.LEFT | WindowAnchor.RIGHT | WindowAnchor.TOP}
        application={App}
        cssClasses={[transparentStyle]}
        setup={setupToolkitWindow}
        defaultHeight={400}
      />
    </>
  );
};
