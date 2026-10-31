import { asConnectable, writable } from '@/utils/binding';
import { createComputed } from 'ags';

export type OverlayItem =
  | { kind: 'toolkit'; state: ToolkitState }
  | { kind: 'notificationBubbles'; state: NotificationBubblesState };
export type ToolkitKind = 'control-center' | 'calendar' | 'notification' | 'performance';
export type ToolkitPosition = { x: number; anchor: 'left' | 'center' | 'right' };
export type ToolkitState = { position: ToolkitPosition; kind: ToolkitKind };
export type NotificationBubblesState = { ids: number[] };

const toolkitState = writable<ToolkitState | null>(null);
const notificationBubblesState = writable<NotificationBubblesState | null>(null);
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
  setToolkitState: (state: ToolkitState | null) => toolkitState.set(state),
  setNotificationBubblesState: (state: NotificationBubblesState | null) =>
    notificationBubblesState.set(state),
});
