import { Variable } from 'astal';
import { App, Astal, Gtk } from 'astal/gtk4';
import styles from './StatusBar.module.less';
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
      cssClasses={[styles.statusBar]}
      gdkmonitor={monitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={App}
    >
      <centerbox>
        <button onClicked="echo hello" hexpand halign={Gtk.Align.CENTER}>
          Welcome to AGS!
        </button>
        <box />
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
