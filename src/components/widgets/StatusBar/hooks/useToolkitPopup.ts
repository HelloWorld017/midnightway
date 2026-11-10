import { repo } from '@/bridge/repository';
import { useInvokeRepo } from '@/hooks/useRepo';
import type { ToolkitKind } from '@/repository/overlay';
import type { MouseEvent } from 'react';

export const useToolkitPopup = (kind: ToolkitKind) => {
  const invoke = useInvokeRepo();
  return (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const bar = event.currentTarget.closest('[data-status-bar]');
    const barBottom = bar?.getBoundingClientRect().bottom ?? rect.bottom;
    void invoke(
      repo.overlay.$invokeMethod('toggleToolkitPopup', {
        kind,
        position: { x: rect.left + rect.width / 2, y: barBottom + 4 },
      }),
    );
  };
};
