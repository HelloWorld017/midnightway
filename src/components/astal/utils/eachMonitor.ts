import { App, Gtk } from 'astal/gtk4';
import type { Gdk } from 'astal/gtk4';

export const eachMonitor = (onMonitor: (monitor: Gdk.Monitor) => Gtk.Widget | Gtk.Widget[]) => {
  const widgetWindows = new Map<Gdk.Monitor, Set<Gtk.Window>>();
  const onAddMonitor = (monitor: Gdk.Monitor) => {
    const widgets = onMonitor(monitor);
    const widgetList = Array.isArray(widgets) ? widgets : [widgets];
    widgetWindows.set(monitor, new Set());
    widgetList.forEach(widget => {
      if (!(widget instanceof Gtk.Window)) {
        throw new Error('Given widget is not a window!');
      }

      widgetWindows.get(monitor)?.add(widget);
    });
  };

  App.get_monitors().forEach(onAddMonitor);

  // FIXME monitor-added is not supported in gtk4
  App.connect('monitor-added', (_, monitor: Gdk.Monitor) => onAddMonitor(monitor));
  App.connect('monitor-removed', (_, monitor: Gdk.Monitor) => {
    const widgetWindow = widgetWindows.get(monitor);
    if (widgetWindow) {
      widgetWindow.forEach(widget => {
        App.remove_window(widget);
        widgetWindows.delete(monitor);
      });
    }
  });
};
