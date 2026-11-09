import { repo } from '@/bridge/repository';
import { useInvokeRepo } from '@/hooks/useRepo';
import type { ToolkitKind } from '@/repository/overlay';
import type { MouseEvent } from 'react';

export const useToolkitPopup = (kind: ToolkitKind) => {
  const invoke = useInvokeRepo();
  return (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const rootSize = parseFloat(
      getComputedStyle(event.currentTarget.ownerDocument.documentElement).fontSize,
    );
    void invoke(
      repo.overlay.$invokeMethod('toggleToolkitPopup', {
        kind,
        position: { x: rect.left + rect.width / 2, y: Math.max(rect.bottom + 8, rootSize * 6) },
      }),
    );
  };
};
