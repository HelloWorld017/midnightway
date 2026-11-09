import { repo } from '@/bridge/repository';
import { ContextMenu } from '@/components/common/ContextMenu';
import { RenderArea } from '@/components/common/RenderArea';
import { SizeAnimated } from '@/components/common/SizeAnimated';
import { SurfaceProvider } from '@/components/common/ThemeProvider';
import { Transition } from '@/components/common/Transition';
import { useInvokeRepo } from '@/hooks/useRepo';
import { Main } from './Popup/Main/Main';
import { Notifications } from './Popup/Notifications/Notifications';
import { PowerMenuPopup } from './Popup/PowerMenu/PowerMenu';
import { Sound } from './Popup/Sound/Sound';
import { Tray } from './Popup/Tray/Tray';
import * as styles from './Toolkit.css';
import { ToolkitPortalProvider } from './ToolkitPortalProvider';
import type { ToolkitKind, ToolkitPopup } from '@/repository/overlay';
import type { ReactNode } from 'react';

const popups: Record<ToolkitKind, { element: ReactNode; halfWidth: string }> = {
  'main': { element: <Main />, halfWidth: '20rem' },
  'sound': { element: <Sound />, halfWidth: '15rem' },
  'tray': { element: <Tray />, halfWidth: '15rem' },
  'notifications': { element: <Notifications />, halfWidth: '18rem' },
  'power-menu': { element: <PowerMenuPopup />, halfWidth: '10rem' },
};

export const Toolkit = ({ popup, isLeaving }: { popup: ToolkitPopup; isLeaving: boolean }) => {
  const invoke = useInvokeRepo();
  const onClose = () => void invoke(repo.overlay.$invokeMethod('setToolkitPopup', null));
  const halfWidth = `min(${popups[popup.kind].halfWidth}, 50vw - 1rem)`;

  return (
    <SurfaceProvider surface="floating">
      <ContextMenu>
        <RenderArea kind="input" role="presentation" css={styles.backdropStyle} onClick={onClose} />
        <RenderArea
          kind={isLeaving ? 'input' : 'default'}
          radius={popup.kind === 'main' ? '3rem' : '1.6rem'}
          css={styles.toolkitStyle}
          style={{
            left: `clamp(calc(${halfWidth} + 1rem), ${popup.position.x}px, calc(100vw - ${halfWidth} - 1rem))`,
            top: `${popup.position.y}px`,
          }}
        >
          <ToolkitPortalProvider css={styles.innerPortalStyle}>
            <SizeAnimated>
              <Transition kind={popup.kind}>{popups[popup.kind].element}</Transition>
            </SizeAnimated>
          </ToolkitPortalProvider>
        </RenderArea>
      </ContextMenu>
    </SurfaceProvider>
  );
};
