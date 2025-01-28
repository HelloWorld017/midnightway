import createCache from '@emotion/cache';
import { CacheProvider, Global } from '@emotion/react';
import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { IconCalendar, IconSlidersHorizontal } from '@/assets/icons';
import { SurfaceProvider } from '@/components/common/ThemeProvider';
import { Transition } from '@/components/common/Transition';
import { globalStyle } from '@/utils/css/global';
import { Calendar } from './Calendar';
import { ControlCenter } from './ControlCenter';
import * as styles from './Toolkit.css';
import { useToolkit } from './ToolkitProvider';
import type { ToolkitKind } from './ToolkitProvider';
import type { ReactNode } from 'react';

const TOOLKIT_MAP: Record<ToolkitKind, { icon: ReactNode; element: ReactNode }> = {
  'calendar': {
    icon: <IconCalendar strokeWidth={2.5} />,
    element: <Calendar />,
  },
  'control-center': {
    icon: <IconSlidersHorizontal strokeWidth={2.5} />,
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
  const toolkitInnerPortalRef = useToolkit(state => state.toolkitInnerPortalRef);
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
          <main css={styles.contentStyle}>
            <Transition kind={toolkitKind ?? ''}>
              {toolkitKind && TOOLKIT_MAP[toolkitKind].element}
            </Transition>
          </main>
          <div css={styles.innerPortalStyle} ref={toolkitInnerPortalRef} />
        </div>
      </SurfaceProvider>
    </CacheProvider>,
    toolkitWindow.document.body
  );
};
