import { IconBell, IconCalendar, IconSlidersHorizontal } from '@/assets/icons';
import { repo } from '@/bridge/repository';
import { ContextMenu } from '@/components/common/ContextMenu';
import { SurfaceProvider } from '@/components/common/ThemeProvider';
import { Transition } from '@/components/common/Transition';
import { useInvokeRepo } from '@/hooks/useRepo';
import { Calendar } from './Calendar';
import { ControlCenter } from './ControlCenter';
import { Notification } from './Notification';
import * as styles from './Toolkit.css';
import { ToolkitPortalProvider } from './ToolkitPortalProvider';
import type { ToolkitKind, ToolkitState } from '@/repository/overlay';
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
  'notification': {
    icon: <IconBell strokeWidth={2.5} />,
    element: <Notification />,
  },
  'performance': { icon: null, element: null },
};

const ToolkitMenu = ({ state }: { state: ToolkitState }) => {
  const invoke = useInvokeRepo();
  const setToolkitKind = (kind: ToolkitKind) => {
    const nextState = state && { ...state, kind };
    void invoke(repo.overlay.$invokeMethod('setToolkitState', nextState));
  };

  return (
    <aside css={styles.asideStyle}>
      {Object.entries(TOOLKIT_MAP).map(([key, { icon }]) => (
        <button
          key={key}
          css={styles.asideItemStyle(state?.kind === key)}
          type="button"
          onClick={() => setToolkitKind(key as ToolkitKind)}
        >
          {icon}
        </button>
      ))}
    </aside>
  );
};

export const Toolkit = ({ state }: { state: ToolkitState }) => {
  const invoke = useInvokeRepo();
  const onClose = () => {
    void invoke(repo.overlay.$invokeMethod('setToolkitState', null));
  };

  if (!state) {
    return null;
  }

  return (
    <SurfaceProvider surface="floating">
      <ContextMenu>
        <div css={styles.backdropStyle} onClick={onClose}></div>
        <div
          css={styles.toolkitStyle(state.position.anchor)}
          style={{ left: `${state.position.x}px` }}
        >
          <ToolkitPortalProvider css={styles.innerPortalStyle}>
            <ToolkitMenu state={state} />
            <main css={styles.contentStyle}>
              <Transition kind={state.kind ?? ''}>
                <div css={styles.scrollerStyle}>
                  {state.kind && TOOLKIT_MAP[state.kind].element}
                </div>
              </Transition>
            </main>
          </ToolkitPortalProvider>
        </div>
      </ContextMenu>
    </SurfaceProvider>
  );
};
