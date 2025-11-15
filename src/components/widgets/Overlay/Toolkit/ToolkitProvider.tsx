import { useRef } from 'react';
import { buildContext } from '@/utils/context';

export const [ToolkitProvider, useToolkit] = buildContext(() => {
  const toolkitInnerPortalRef = useRef<HTMLDivElement | null>(null);
  return { toolkitInnerPortalRef };
});
