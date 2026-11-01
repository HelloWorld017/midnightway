import { asConnectable, writable } from '@/utils/binding';
import { createComputed } from 'ags';
import AstalNotifd from 'gi://AstalNotifd';
import GLib from 'gi://GLib';

export type OverlayItem =
  | { kind: 'toolkit'; state: ToolkitState }
  | { kind: 'notificationBubbles'; state: NotificationBubblesState };

export type ToolkitKind = 'control-center' | 'calendar' | 'notification' | 'performance';
export type ToolkitPosition = { x: number; anchor: 'left' | 'center' | 'right' };
export type ToolkitState = { position: ToolkitPosition; kind: ToolkitKind };
export type NotificationBubblesState = { ids: number[] };
type NotificationBubblesBounds = { x: number; y: number; width: number; height: number };

const BUBBLE_DURATION = 5000;

const toolkitState = writable<ToolkitState | null>(null);
const notificationBubblesState = writable<NotificationBubblesState | null>(null);
const notificationBubblesBounds = writable<NotificationBubblesBounds | null>(null);

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
  const state = notificationBubblesState.peek();
  if (state?.ids.includes(id)) {
    notificationBubblesState.set({ ids: state.ids.filter(current => current !== id) });
  }
};

const resumeNotificationBubble = (id: number) => {
  pauseNotificationBubble(id);
  const notification = notifd.get_notification(id);
  if (
    !notificationBubblesState.peek()?.ids.includes(id) ||
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
  if (notifd.dont_disturb || toolkitState.peek()?.kind === 'notification') {
    hideNotificationBubble(id);
    return;
  }

  const ids = notificationBubblesState.peek()?.ids ?? [];
  notificationBubblesState.set({ ids: [id, ...ids.filter(current => current !== id)] });
  resumeNotificationBubble(id);
});

notifd.connect('resolved', (_source, id) => hideNotificationBubble(id));

const overlayItems = createComputed((): OverlayItem[] => {
  const toolkit = toolkitState();
  const bubbles = notificationBubblesState();
  return [
    ...(toolkit ? [{ kind: 'toolkit' as const, state: toolkit }] : []),
    ...(bubbles ? [{ kind: 'notificationBubbles' as const, state: bubbles }] : []),
  ];
});

export const overlayRepository = asConnectable({
  overlayItems,
  toolkitState,
  notificationBubblesState,
  notificationBubblesBounds,
  setNotificationBubblesBounds: (bounds: NotificationBubblesBounds | null) =>
    notificationBubblesBounds.set(bounds),
  pauseNotificationBubble,
  resumeNotificationBubble,
  closeEmptyNotificationBubbles: () => {
    if (notificationBubblesState.peek()?.ids.length === 0) {
      notificationBubblesState.set(null);
      notificationBubblesBounds.set(null);
    }
  },
  setToolkitState: (state: ToolkitState | null) => toolkitState.set(state),
  setNotificationBubblesState: (state: NotificationBubblesState | null) =>
    notificationBubblesState.set(state),
});
