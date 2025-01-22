import createCache from '@emotion/cache';
import { CacheProvider, Global } from '@emotion/react';
import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { SurfaceProvider } from '@/components/common/ThemeProvider';
import { globalStyle } from '@/utils/css/global';
import * as styles from './Toolkit.css';
import { useToolkit } from './ToolkitProvider';

export const Toolkit = () => {
  const toolkitWindow = useToolkit(state => state.toolkitWindow);
  const toolkitPosition = useToolkit(state => state.toolkitPosition);
  const toolkitElement = useToolkit(state => state.toolkitElement);
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
      <Global styles={globalStyle} />
      <SurfaceProvider surface="glass">
        <div
          css={styles.toolkitStyle}
          style={{ left: `${toolkitPosition.x}px`, width: `${toolkitPosition.width}px` }}
        >
          {toolkitElement}
        </div>
      </SurfaceProvider>
    </CacheProvider>,
    toolkitWindow.document.body
  );
};
