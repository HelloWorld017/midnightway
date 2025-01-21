/** @jsxImportSource astal/gtk4 */

import { App, Astal } from 'astal/gtk4';
import cairo from 'gi://cairo';
import { cssAstal as css } from '@/utils/css';
import { MdWebView } from './MdWebView';
import type { Gdk } from 'astal/gtk4';

const { Layer, WindowAnchor } = Astal;

const statusBarStyle = css`
  background: transparent;
`;

export const MdStatusBar = ({ monitor }: { monitor: Gdk.Monitor }) => {
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

  return (
    <window
      visible
      gdkmonitor={monitor}
      exclusivitySize={32}
      layer={Layer.TOP}
      anchor={WindowAnchor.LEFT | WindowAnchor.RIGHT | WindowAnchor.TOP}
      application={App}
      cssClasses={[statusBarStyle]}
      setup={setupWindow}
      defaultHeight={70}
    >
      <MdWebView initParams={{ kind: 'status-bar', params: { monitor: monitor.connector } }} />
    </window>
  );
};
