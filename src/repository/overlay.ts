import { asConnectable, writable } from '@/utils/binding';
import AstalNotifd from 'gi://AstalNotifd';
import GLib from 'gi://GLib';

export type OverlayItem =
  | { kind: 'toolkit'; popup: ToolkitPopup }
  | { kind: 'notificationBubbles'; state: NotificationBubblesState };

export type ToolkitKind = 'main' | 'sound' | 'tray' | 'notifications' | 'power-menu';
export type ToolkitPopup = {
  kind: ToolkitKind;
  anchor: 'left' | 'center' | 'right';
  position: { x: number; y: number };
};
export type NotificationBubblesState = { ids: number[] };

const BUBBLE_DURATION = 5000;

const overlayItems = writable<OverlayItem[]>([]);

const getBubbles = () =>
  overlayItems.peek().find(item => item.kind === 'notificationBubbles')?.state ?? null;

const setNotificationBubblesState = (state: NotificationBubblesState | null) => {
  const items = overlayItems.peek().filter(item => item.kind !== 'notificationBubbles');
  overlayItems.set(state ? [...items, { kind: 'notificationBubbles', state }] : items);
};

const setToolkitPopup = (popup: ToolkitPopup | null) => {
  const items = overlayItems.peek().filter(item => item.kind !== 'toolkit');
  overlayItems.set(popup ? [{ kind: 'toolkit', popup }, ...items] : items);
};

const notifd = AstalNotifd.get_default();
notifd.ignore_timeout = true;

const bubbleTimers = new Map<number, number>();

const pauseNotificationBubble = (id: number) => {
  const timer = bubbleTimers.get(id);
  if (timer !== undefined) {
    GLib.source_remove(timer);
    bubbleTimers.delete(id);
  }
};

const hideNotificationBubble = (id: number) => {
  pauseNotificationBubble(id);
  const state = getBubbles();
  if (state?.ids.includes(id)) {
    setNotificationBubblesState({ ids: state.ids.filter(current => current !== id) });
  }
};

const resumeNotificationBubble = (id: number) => {
  pauseNotificationBubble(id);
  const notification = notifd.get_notification(id);
  if (
    !getBubbles()?.ids.includes(id) ||
    !notification ||
    notification.urgency === AstalNotifd.Urgency.CRITICAL ||
    notification.expire_timeout === 0
  ) {
    return;
  }

  const duration = notification.expire_timeout > 0 ? notification.expire_timeout : BUBBLE_DURATION;
  bubbleTimers.set(
    id,
    GLib.timeout_add(GLib.PRIORITY_DEFAULT, duration, () => {
      bubbleTimers.delete(id);
      hideNotificationBubble(id);
      return GLib.SOURCE_REMOVE;
    }),
  );
};

notifd.connect('notified', (_source, id) => {
  if (
    notifd.dont_disturb ||
    overlayItems.peek().some(item => item.kind === 'toolkit' && item.popup.kind === 'notifications')
  ) {
    hideNotificationBubble(id);
    return;
  }

  const ids = getBubbles()?.ids ?? [];
  setNotificationBubblesState({ ids: [id, ...ids.filter(current => current !== id)] });
  resumeNotificationBubble(id);
});

notifd.connect('resolved', (_source, id) => hideNotificationBubble(id));

export const overlayRepository = asConnectable({
  overlayItems,
  pauseNotificationBubble,
  resumeNotificationBubble,
  closeEmptyNotificationBubbles: () => {
    if (getBubbles()?.ids.length === 0) {
      setNotificationBubblesState(null);
    }
  },
  setToolkitPopup,
  toggleToolkitPopup: (popup: ToolkitPopup) => {
    const current = overlayItems.peek().find(item => item.kind === 'toolkit');
    setToolkitPopup(current?.popup.kind === popup.kind ? null : popup);
  },
  setNotificationBubblesState,
});
