/** @jsxImportSource astal/gtk4 */

import { App, Astal, Gtk, Gdk } from 'astal/gtk4';
import WebKit from 'gi://WebKit';
import cairo from 'gi://cairo';
import { match } from 'ts-pattern';
import { config } from '@/config';
import { ref } from '@/utils/binding';
import { cssAstal as css } from '@/utils/css';
import { MdWebView } from './MdWebView';
import type { BridgeMethodsMain } from '@/bridge/types';

const BAR_HEIGHT_HIDDEN = 1;
const BAR_HEIGHT_VISIBLE = 32;
const BAR_HEIGHT_MAXIMIZED = 70;

const { Keymode, Layer, WindowAnchor } = Astal;

const transparentStyle = css`
  background: transparent;
`;

export const MdStatusBar = ({ monitor }: { monitor: Gdk.Monitor }) => {
  const barWindowRef = ref<Astal.Window | null>(null);
  const toolkitWindowRef = ref<Astal.Window | null>(null);
  const bridgeRef = ref<BridgeMethodsMain | null>(null);

  const shouldAutohide = config().bar.autohide;
  const isHiddenRef = ref(false);
  const isMaximizedRef = ref(false);

  const updateIsHidden = (nextIsHidden: boolean) => {
    bridgeRef.current?.onHiddenChange(nextIsHidden);
    isHiddenRef(nextIsHidden);
    updateInputRegion();
  };

  const updateInputRegion = () => {
    const rect = new cairo.RectangleInt({
      x: 0,
      y: 0,
      width: monitor.get_geometry().width,
      height: match({ maximized: isMaximizedRef.current, hidden: isHiddenRef.current })
        .with({ maximized: true }, () => BAR_HEIGHT_MAXIMIZED)
        .with({ hidden: true }, () => BAR_HEIGHT_HIDDEN)
        .otherwise(() => BAR_HEIGHT_VISIBLE),
    });

    const region = Astal.Utils.create_region_by_rectangles(rect);
    const surface = barWindowRef.current?.get_surface();
    surface?.set_input_region(region);
  };

  const setupWindow = (window: Astal.Window) => {
    if (shouldAutohide) {
      const eventController = new Gtk.EventControllerMotion();
      eventController.connect('enter', () => updateIsHidden(false));
      eventController.connect('leave', () => updateIsHidden(true));
      window.add_controller(eventController);
    }

    barWindowRef(window);
    updateIsHidden(shouldAutohide);
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
        exclusivitySize={shouldAutohide ? 0 : BAR_HEIGHT_VISIBLE}
        layer={Layer.TOP}
        anchor={WindowAnchor.LEFT | WindowAnchor.RIGHT | WindowAnchor.TOP}
        application={App}
        cssClasses={[transparentStyle]}
        setup={setupWindow}
        defaultHeight={BAR_HEIGHT_MAXIMIZED}
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
        keymode={Keymode.ON_DEMAND}
        anchor={WindowAnchor.LEFT | WindowAnchor.RIGHT | WindowAnchor.TOP | WindowAnchor.BOTTOM}
        application={App}
        cssClasses={[transparentStyle]}
        setup={setupToolkitWindow}
      />
    </>
  );
};
