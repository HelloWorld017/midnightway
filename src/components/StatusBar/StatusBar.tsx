import { Variable } from 'astal';
import { App, Astal, Gtk } from 'astal/gtk4';
import * as styles from './StatusBar.css';
import type { Gdk } from 'astal/gtk4';

const time = Variable('').poll(1000, 'date');

type StatusBarProps = {
  monitor: Gdk.Monitor;
};

export const StatusBar = ({ monitor }: StatusBarProps) => {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

  return (
    <window
      visible
      cssClasses={[styles.statusBarStyle]}
      gdkmonitor={monitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={App}
    >
      <centerbox>
        <menubutton hexpand halign={Gtk.Align.CENTER}>
          <label label={time()} />
          <popover>
            <Gtk.Calendar />
          </popover>
        </menubutton>
      </centerbox>
    </window>
  );
};
