import { Variable } from 'astal';
import { App, Astal, Gtk } from 'astal/gtk4';
import type { Gdk } from 'astal/gtk4';

const time = Variable('').poll(1000, 'date');

type BarProps = {
  monitor: Gdk.Monitor;
};

export const Bar = ({ monitor }: BarProps) => {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

  return (
    <window
      visible
      cssClasses={['Bar']}
      gdkmonitor={monitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={App}
    >
      <centerbox cssName="centerbox">
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
