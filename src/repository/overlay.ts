import { Variable } from 'astal';
import { asConnectable } from '@/utils/binding';

export type OverlayItem =
  | { kind: 'toolkit'; state: ToolkitState }
  | { kind: 'notificationBubbles'; state: NotificationBubblesState };
export type ToolkitKind = 'control-center' | 'calendar' | 'notification' | 'performance';
export type ToolkitPosition = { x: number; anchor: 'left' | 'center' | 'right' };
export type ToolkitState = { position: ToolkitPosition; kind: ToolkitKind };
export type NotificationBubblesState = { ids: number[] };

const toolkitState = new Variable<ToolkitState | null>(null);
const notificationBubblesState = new Variable<NotificationBubblesState | null>(null);
const overlayItems = Variable.derive(
  [toolkitState, notificationBubblesState],
  (toolkitState, notificationBubblesState): OverlayItem[] => [
    ...(toolkitState ? [{ kind: 'toolkit' as const, state: toolkitState }] : []),
    ...(notificationBubblesState
      ? [{ kind: 'notificationBubbles' as const, state: notificationBubblesState }]
      : []),
  ]
);

export const overlayRepository = asConnectable({
  overlayItems,
  toolkitState,
  notificationBubblesState,
  setToolkitState: (state: ToolkitState | null) => toolkitState.set(state),
  setNotificationBubblesState: (state: NotificationBubblesState | null) =>
    notificationBubblesState.set(state),
});
