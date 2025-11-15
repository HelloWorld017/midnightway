/** @jsxImportSource astal/gtk4 */

import { App, Astal, Gtk } from 'astal/gtk4';
import cairo from 'gi://cairo';
import { match } from 'ts-pattern';
import { config } from '@/config';
import { repositoryImpl } from '@/repository';
import { ref } from '@/utils/binding';
import { cssAstal as css } from '@/utils/css';
import { MdWebView } from './MdWebView';
import type { MdWebViewProps } from './MdWebView';
import type { BridgeMethodsMain } from '@/bridge/types';
import type { OverlayItem } from '@/repository/overlay';
import type { Gdk } from 'astal/gtk4';

const BAR_HEIGHT_HIDDEN = 1;
const BAR_HEIGHT_VISIBLE = 32;
const BAR_HEIGHT_MAXIMIZED = 70;

const { Keymode, Layer, WindowAnchor } = Astal;

const transparentStyle = css`
  background: transparent;
`;

export const MdApp = ({ monitor }: { monitor: Gdk.Monitor }) => {
  const barWindowRef = ref<Astal.Window | null>(null);
  const barBridgeRef = ref<BridgeMethodsMain | null>(null);
  const overlayWindowRef = ref<Astal.Window | null>(null);
  const overlayBridgeRef = ref<BridgeMethodsMain | null>(null);

  /* Bar States */
  const shouldAutohideBar = config().bar.autohide;
  const isBarHiddenRef = ref(false);
  const isBarMaximizedRef = ref(false);

  const updateInputRegion = () => {
    const barRect = new cairo.RectangleInt({
      x: 0,
      y: 0,
      width: monitor.get_geometry().width,
      height: match({ maximized: isBarMaximizedRef.current, hidden: isBarHiddenRef.current })
        .with({ maximized: true }, () => BAR_HEIGHT_MAXIMIZED)
        .with({ hidden: true }, () => BAR_HEIGHT_HIDDEN)
        .otherwise(() => BAR_HEIGHT_VISIBLE),
    });

    const region = Astal.Utils.create_region_by_rectangles(barRect);
    const surface = barWindowRef.current?.get_surface();
    surface?.set_input_region(region);
  };

  const updateBarIsHidden = (nextIsHidden: boolean) => {
    barBridgeRef.current?.onHiddenChange({ isHidden: nextIsHidden });
    isBarHiddenRef(nextIsHidden);
    updateInputRegion();
  };

  const setupBarWindow = (window: Astal.Window) => {
    if (shouldAutohideBar) {
      const eventController = new Gtk.EventControllerMotion();
      eventController.connect('enter', () => updateBarIsHidden(false));
      eventController.connect('leave', () => updateBarIsHidden(true));
      window.add_controller(eventController);
    }

    barWindowRef(window);
    updateBarIsHidden(shouldAutohideBar);
  };

  const setupOverlayWindow = (window: Astal.Window) => {
    const eventController = new Gtk.EventControllerFocus();
    eventController.connect('leave', () => {
      overlayBridgeRef.current?.onOverlayCloseRequest();
    });

    window.add_controller(eventController);
    overlayWindowRef(window);
  };

  const bridge: Required<MdWebViewProps>['bridge'] = {};
  const overlayConnectId = repositoryImpl.overlay.connect(
    'overlayItems',
    (items: OverlayItem[]) => {
      if (items.length === 0) {
        overlayWindowRef.current?.hide();
        overlayWindowRef.current?.set_child(null);
      }

      if (items.length > 0 && !overlayWindowRef.current?.visible) {
        overlayWindowRef.current?.present();
        overlayWindowRef.current?.set_child(
          <MdWebView
            initParams={{ kind: 'overlay', params: { monitor: monitor.connector } }}
            bridge={bridge}
            setupBridge={overlayBridgeRef}
          />
        );
      }
    }
  );

  return (
    <>
      <window
        visible
        gdkmonitor={monitor}
        exclusivitySize={shouldAutohideBar ? 0 : BAR_HEIGHT_VISIBLE}
        layer={Layer.TOP}
        anchor={WindowAnchor.LEFT | WindowAnchor.RIGHT | WindowAnchor.TOP}
        application={App}
        cssClasses={[transparentStyle]}
        setup={setupBarWindow}
        defaultHeight={BAR_HEIGHT_MAXIMIZED}
        onDestroy={() => {
          repositoryImpl.overlay.disconnect(overlayConnectId);
        }}
      >
        <MdWebView
          initParams={{ kind: 'status-bar', params: { monitor: monitor.connector } }}
          bridge={bridge}
          setupBridge={barBridgeRef}
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
        setup={setupOverlayWindow}
      ></window>
    </>
  );
};
