import { createRoot, onCleanup } from 'ags';
import app from 'ags/gtk4/app';
import type Gdk from 'gi://Gdk?version=4.0';
import type Gtk from 'gi://Gtk?version=4.0';

export const eachMonitor = (create: (monitor: Gdk.Monitor) => Gtk.Window[]) => {
  const monitors = new Map<Gdk.Monitor, () => void>();
  const reconcile = () => {
    const current = new Set(app.get_monitors());
    for (const [monitor, dispose] of monitors) {
      if (!current.has(monitor)) {
        dispose();
        monitors.delete(monitor);
      }
    }

    for (const monitor of current) {
      if (!monitors.has(monitor)) {
        createRoot(dispose => {
          const windows = create(monitor);
          monitors.set(monitor, () => {
            dispose();
            windows.forEach(window => window.destroy());
          });
        });
      }
    }
  };

  const signal = app.connect('notify::monitors', reconcile);
  reconcile();
  onCleanup(() => {
    app.disconnect(signal);
    monitors.forEach(dispose => dispose());
    monitors.clear();
  });
};
