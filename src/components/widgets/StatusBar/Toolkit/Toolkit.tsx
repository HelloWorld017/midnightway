import createCache from '@emotion/cache';
import { CacheProvider, Global } from '@emotion/react';
import { Calendar as IconCalendar, SlidersHorizontal as IconSlidersHorizontal } from 'lucide-react';
import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { SurfaceProvider } from '@/components/common/ThemeProvider';
import { globalStyle } from '@/utils/css/global';
import { Calendar } from './Calendar';
import { ControlCenter } from './ControlCenter';
import * as styles from './Toolkit.css';
import { useToolkit } from './ToolkitProvider';
import type { ToolkitKind } from './ToolkitProvider';
import type { ReactNode } from 'react';

const TOOLKIT_MAP: Record<ToolkitKind, { icon: ReactNode; element: ReactNode }> = {
  'calendar': {
    icon: <IconCalendar width="1em" height="1em" strokeWidth={2.5} />,
    element: <Calendar />,
  },
  'control-center': {
    icon: <IconSlidersHorizontal width="1em" height="1em" strokeWidth={2.5} />,
    element: <ControlCenter />,
  },
  'notification': { icon: null, element: null },
  'performance': { icon: null, element: null },
};

const ToolkitMenu = () => {
  const toolkitKind = useToolkit(state => state.toolkitKind);
  const setToolkitKind = useToolkit(state => state.setToolkitKind);

  return (
    <aside css={styles.asideStyle}>
      {Object.entries(TOOLKIT_MAP).map(([key, { icon }]) => (
        <button
          key={key}
          css={styles.asideItemStyle(toolkitKind === key)}
          type="button"
          onClick={() => setToolkitKind(key as ToolkitKind)}
        >
          {icon}
        </button>
      ))}
    </aside>
  );
};

export const Toolkit = () => {
  const toolkitWindow = useToolkit(state => state.toolkitWindow);
  const toolkitPosition = useToolkit(state => state.toolkitPosition);
  const toolkitKind = useToolkit(state => state.toolkitKind);
  const cache = useMemo(
    () =>
      toolkitWindow &&
      createCache({
        key: 'tk',
        container: toolkitWindow.document.head,
      }),
    [toolkitWindow]
  );

  if (!toolkitWindow) {
    return null;
  }

  return createPortal(
    <CacheProvider value={cache}>
      <Global styles={[globalStyle, styles.toolkitGlobalStyle]} />
      <SurfaceProvider surface="floating">
        <div css={styles.toolkitStyle} style={{ left: `${toolkitPosition.x}px` }}>
          <ToolkitMenu />
          <main css={styles.contentStyle}>{toolkitKind && TOOLKIT_MAP[toolkitKind].element}</main>
        </div>
      </SurfaceProvider>
    </CacheProvider>,
    toolkitWindow.document.body
  );
};
