/** @jsxImportSource ags/gtk4 */

import { config } from '@/config';
import { repositoryImpl } from '@/repository';
import { ref, subscribeProperty } from '@/utils/binding';
import { cssAstal as css } from '@/utils/css';
import { onCleanup, onMount } from 'ags';
import { Astal, Gtk } from 'ags/gtk4';
import app from 'ags/gtk4/app';
import Cairo from 'cairo';
import GLib from 'gi://GLib';
import Gtk4LayerShell from 'gi://Gtk4LayerShell';
import WebKit from 'gi://WebKit';
import { match } from 'ts-pattern';
import { BlurLayer } from './BlurLayer';
import { MdWebView } from './MdWebView';
import type { MdWebViewProps } from './MdWebView';
import type { BridgeMethodsMain, RenderArea } from '@/bridge/types';
import type { Gdk } from 'ags/gtk4';

const BAR_HEIGHT_VISIBLE = 32;
const BAR_HEIGHT_MAXIMIZED = 70;
const OVERLAY_CLOSE_TIMEOUT = 1500;

const { Keymode, Layer, WindowAnchor } = Astal;

const transparentStyle = css`
  background: transparent;
`;

const inputRegionForAreas = (areas: RenderArea[]) => {
  const region = new Cairo.Region();
  for (const area of areas) {
    if (area.input) {
      region.unionRectangle(area.clipBounds);
    }
  }
  return region;
};

export const MdApp = ({ monitor }: { monitor: Gdk.Monitor }) => {
  const barWindowRef = ref<Astal.Window | null>(null);
  const barBridgeRef = ref<BridgeMethodsMain | null>(null);
  const overlayWindowRef = ref<Astal.Window | null>(null);
  const overlayBridgeRef = ref<BridgeMethodsMain | null>(null);
  const barBlur = new BlurLayer({ hexpand: true, vexpand: true, canTarget: false });
  const overlayBlur = new BlurLayer({ hexpand: true, vexpand: true, canTarget: false });
  const overlayContainer = new Gtk.Overlay();
  overlayContainer.set_child(overlayBlur);
  const overlayWebViewRef = ref<WebKit.WebView | null>(null);
  let overlayCloseGeneration = 0;
  let overlayClosing: number | null = null;
  let overlayCloseTimeout = 0;

  const getAnyLivingBridge = () => barBridgeRef.current;

  /* Bar States */
  const shouldAutohideBar = config().bar.autohide;
  const renderAreas = { bar: [] as RenderArea[], overlay: [] as RenderArea[] };
  const updateInputRegion = (kind: 'bar' | 'overlay') => {
    const window = kind === 'bar' ? barWindowRef.current : overlayWindowRef.current;
    const inputAreas = kind === 'overlay' && overlayClosing !== null ? [] : renderAreas[kind];
    window?.get_surface()?.set_input_region(inputRegionForAreas(inputAreas));
    (kind === 'bar' ? barBlur : overlayBlur).setAreas(renderAreas[kind]);
  };

  const updateBarIsHidden = (nextIsHidden: boolean) => {
    barBridgeRef.current?.onHiddenChange({ isHidden: nextIsHidden });
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
    Gtk4LayerShell.set_namespace(window, 'midnightway-overlay');
    const eventController = new Gtk.EventControllerFocus();
    eventController.connect('leave', () => {
      overlayBridgeRef.current?.onOverlayCloseRequest();
    });

    window.add_controller(eventController);
    window.set_child(overlayContainer);
    overlayWindowRef(window);
  };

  const updateOverlayInputRegion = () => {
    const window = overlayWindowRef.current;
    const hasToolkit = repositoryImpl.overlay.overlayItems.some(item => item.kind === 'toolkit');
    window?.set_keymode(hasToolkit ? Keymode.ON_DEMAND : Keymode.NONE);
    updateInputRegion('overlay');
  };

  const bridge: Required<MdWebViewProps>['bridge'] = {
    setRenderAreas: ({ surface, areas }) => {
      if (surface === 'overlay' && !overlayWindowRef.current?.visible) {
        return;
      }
      renderAreas[surface] = areas;
      updateInputRegion(surface);
    },
    overlayExitFinished: ({ generation }) => finishOverlayClose(generation),
  };

  const cancelOverlayClose = () => {
    if (overlayCloseTimeout) {
      GLib.source_remove(overlayCloseTimeout);
      overlayCloseTimeout = 0;
    }
    overlayClosing = null;
  };

  const finishOverlayClose = (generation: number) => {
    if (generation !== overlayClosing || repositoryImpl.overlay.overlayItems.length !== 0) {
      return;
    }

    cancelOverlayClose();
    renderAreas.overlay = [];
    overlayWindowRef.current?.hide();
    if (overlayWebViewRef.current) {
      overlayContainer.remove_overlay(overlayWebViewRef.current);
      overlayWebViewRef(null);
    }
    overlayBlur.setAreas([]);
    overlayBridgeRef.current?.zygoteRelease({ id: 'overlay' });
    overlayBridgeRef.current = null;
    updateOverlayInputRegion();
  };

  const updateOverlay = () => {
    const items = repositoryImpl.overlay.overlayItems;
    if (items.length === 0) {
      if (overlayWindowRef.current?.visible && overlayClosing === null) {
        const generation = ++overlayCloseGeneration;
        overlayClosing = generation;
        overlayCloseTimeout = GLib.timeout_add(GLib.PRIORITY_DEFAULT, OVERLAY_CLOSE_TIMEOUT, () => {
          overlayCloseTimeout = 0;
          finishOverlayClose(generation);
          return GLib.SOURCE_REMOVE;
        });
        overlayBridgeRef.current?.onOverlayClosing({ generation });
      }
    } else {
      cancelOverlayClose();
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
  onCleanup(cancelOverlayClose);
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
      onRealize={() => updateInputRegion('bar')}
      defaultHeight={BAR_HEIGHT_MAXIMIZED}
    >
      <overlay>
        {barBlur}
        <MdWebView
          $type="overlay"
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
              overlayWebViewRef(webView);
              overlayContainer.add_overlay(webView);
              return webView;
            }

            return null;
          }}
          bridge={bridge}
          setupBridge={barBridgeRef}
        />
      </overlay>
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
