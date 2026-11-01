/** @jsxImportSource ags/gtk4 */

import { config } from '@/config';
import { repositoryImpl } from '@/repository';
import { ref, subscribeProperty } from '@/utils/binding';
import { cssAstal as css } from '@/utils/css';
import { onCleanup, onMount } from 'ags';
import { Astal, Gtk } from 'ags/gtk4';
import app from 'ags/gtk4/app';
import Cairo from 'cairo';
import Gtk4LayerShell from 'gi://Gtk4LayerShell';
import WebKit from 'gi://WebKit';
import { match } from 'ts-pattern';
import { MdWebView } from './MdWebView';
import type { MdWebViewProps } from './MdWebView';
import type { BridgeMethodsMain } from '@/bridge/types';
import type { Gdk } from 'ags/gtk4';

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

  const getAnyLivingBridge = () => barBridgeRef.current;

  /* Bar States */
  const shouldAutohideBar = config().bar.autohide;
  const isBarHiddenRef = ref(false);
  const isBarMaximizedRef = ref(false);

  const updateInputRegion = () => {
    const region = new Cairo.Region();
    region.unionRectangle({
      x: 0,
      y: 0,
      width: monitor.get_geometry().width,
      height: match({ maximized: isBarMaximizedRef.current, hidden: isBarHiddenRef.current })
        .with({ maximized: true }, () => BAR_HEIGHT_MAXIMIZED)
        .with({ hidden: true }, () => BAR_HEIGHT_HIDDEN)
        .otherwise(() => BAR_HEIGHT_VISIBLE),
    });

    const surface = barWindowRef.current?.get_surface();
    surface?.set_input_region(region);
  };

  const updateBarIsHidden = (nextIsHidden: boolean) => {
    barBridgeRef.current?.onHiddenChange({ isHidden: nextIsHidden });
    isBarHiddenRef(nextIsHidden);
    updateInputRegion();
  };

  const setupBarWindow = (window: Astal.Window) => {
    Gtk4LayerShell.set_exclusive_zone(window, shouldAutohideBar ? 0 : BAR_HEIGHT_VISIBLE);
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

  const updateOverlayInputRegion = () => {
    const window = overlayWindowRef.current;
    const hasToolkit = repositoryImpl.overlay.overlayItems.some(item => item.kind === 'toolkit');
    window?.set_keymode(hasToolkit ? Keymode.ON_DEMAND : Keymode.NONE);

    const surface = window?.get_surface();
    if (!surface) {
      return;
    }

    if (hasToolkit) {
      surface.set_input_region(null);
      return;
    }

    const region = new Cairo.Region();
    const bounds = repositoryImpl.overlay.notificationBubblesBounds;
    if (bounds && bounds.width > 0 && bounds.height > 0) {
      region.unionRectangle({
        x: Math.floor(bounds.x),
        y: Math.floor(bounds.y),
        width: Math.ceil(bounds.width),
        height: Math.ceil(bounds.height),
      });
    }

    surface.set_input_region(region);
  };

  const bridge: Required<MdWebViewProps>['bridge'] = {};
  const updateOverlay = () => {
    const items = repositoryImpl.overlay.overlayItems;
    if (items.length === 0) {
      overlayWindowRef.current?.hide();
      overlayWindowRef.current?.set_child(null);
      overlayBridgeRef.current?.zygoteRelease({ id: 'overlay' });
      overlayBridgeRef.current = null;
    }

    if (items.length > 0 && !overlayWindowRef.current?.visible) {
      overlayWindowRef.current?.set_visible(true);
      overlayBridgeRef.current = getAnyLivingBridge();
      overlayBridgeRef.current?.zygoteFork({
        id: 'overlay',
        initParams: {
          kind: 'overlay',
          params: { monitor: monitor.connector ?? '' },
          config: config(),
        },
      });
    }
    updateOverlayInputRegion();
  };

  onCleanup(subscribeProperty(repositoryImpl.overlay, 'overlayItems', updateOverlay));
  onCleanup(
    subscribeProperty(
      repositoryImpl.overlay,
      'notificationBubblesBounds',
      updateOverlayInputRegion,
    ),
  );

  onMount(updateOverlay);

  return [
    <window
      visible
      gdkmonitor={monitor}
      layer={Layer.TOP}
      anchor={WindowAnchor.LEFT | WindowAnchor.RIGHT | WindowAnchor.TOP}
      application={app}
      cssClasses={[transparentStyle]}
      $={setupBarWindow}
      onRealize={updateInputRegion}
      defaultHeight={BAR_HEIGHT_MAXIMIZED}
    >
      <MdWebView
        initParams={{ kind: 'status-bar', params: { monitor: monitor.connector ?? '' } }}
        onCreateChild={({ self, navigationAction }) => {
          const navigationURI = navigationAction.get_request().get_uri();
          const forkId = navigationURI.match(/\?(.*)$/)?.at(1);
          const targetWindow = match(forkId)
            .with('overlay', () => overlayWindowRef.current)
            .otherwise(() => null);

          if (targetWindow) {
            const webView = new WebKit.WebView({
              hexpand: true,
              vexpand: true,
              relatedView: self,
            });
            targetWindow.set_child(webView);
            return webView;
          }

          return null;
        }}
        bridge={bridge}
        setupBridge={barBridgeRef}
      />
    </window>,
    <window
      visible={false}
      gdkmonitor={monitor}
      layer={Layer.OVERLAY}
      keymode={Keymode.ON_DEMAND}
      anchor={WindowAnchor.LEFT | WindowAnchor.RIGHT | WindowAnchor.TOP | WindowAnchor.BOTTOM}
      application={app}
      cssClasses={[transparentStyle]}
      onRealize={updateOverlayInputRegion}
      $={setupOverlayWindow}
    ></window>,
  ] as Astal.Window[];
};
