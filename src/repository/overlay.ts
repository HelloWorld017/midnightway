import { Variable } from 'astal';
import { asConnectable } from '@/utils/binding';

export type OverlayItem = { kind: 'toolkit'; state: ToolkitState };
export type ToolkitKind = 'control-center' | 'calendar' | 'notification' | 'performance';
export type ToolkitPosition = { x: number; anchor: 'left' | 'center' | 'right' };
export type ToolkitState = { position: ToolkitPosition; kind: ToolkitKind };

const toolkitState = new Variable<ToolkitState | null>(null);
const overlayItems = Variable.derive([toolkitState], (toolkitState): OverlayItem[] => [
  ...(toolkitState ? [{ kind: 'toolkit' as const, state: toolkitState }] : []),
]);

export const overlayRepository = asConnectable({
  overlayItems,
  toolkitState,
  setToolkitState: (state: ToolkitState | null) => toolkitState.set(state),
});
