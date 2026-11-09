import { Gtk } from 'ags/gtk4';
import GObject from 'gi://GObject';
import Graphene from 'gi://Graphene';
import Gsk from 'gi://Gsk';
import type { RenderArea } from '@/bridge/types';

// GTK 4.24 uses this threshold to identify a compositor background blur.
const BACKGROUND_BLUR_RADIUS = 20;
const supportsBackgroundBlur = Gtk.get_major_version() > 4 || Gtk.get_minor_version() >= 24;

export const BlurLayer = GObject.registerClass(
  class BlurLayer extends Gtk.Widget {
    areas: RenderArea[] = [];

    setAreas(areas: RenderArea[]) {
      this.areas = areas.filter(area => area.blur);
      this.queue_draw();
    }

    vfunc_snapshot(snapshot: Gtk.Snapshot) {
      if (!supportsBackgroundBlur || this.areas.length === 0) {
        return;
      }

      // Copy once so overlapping areas all sample the original background.
      snapshot.push_copy();
      for (const area of this.areas) {
        const { clipBounds } = area;
        const clip = new Graphene.Rect().init(
          clipBounds.x,
          clipBounds.y,
          clipBounds.width,
          clipBounds.height,
        );
        const bounds = new Graphene.Rect().init(area.x, area.y, area.width, area.height);
        const radius = new Graphene.Size().init(area.radiusX, area.radiusY);
        const rounded = new Gsk.RoundedRect().init(bounds, radius, radius, radius, radius);

        snapshot.push_clip(clip);
        snapshot.push_rounded_clip(rounded);
        snapshot.push_blur(BACKGROUND_BLUR_RADIUS);
        snapshot.append_paste(clip, 0);
        snapshot.pop();
        snapshot.pop();
        snapshot.pop();
      }
      snapshot.pop();
    }
  },
);
