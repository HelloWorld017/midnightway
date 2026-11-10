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
import type { ComponentType } from 'react';

const popups: Record<ToolkitKind, { component: ComponentType<{ width: string }>; width: number }> =
  {
    'main': { component: Main, width: 40 },
    'sound': { component: Sound, width: 30 },
    'tray': { component: Tray, width: 20 },
    'notifications': { component: Notifications, width: 36 },
    'power-menu': { component: PowerMenuPopup, width: 20 },
  };

export const Toolkit = ({ popup, isLeaving }: { popup: ToolkitPopup; isLeaving: boolean }) => {
  const invoke = useInvokeRepo();
  const onClose = () => void invoke(repo.overlay.$invokeMethod('setToolkitPopup', null));
  const { component: Popup, width } = popups[popup.kind];
  const edgeOffset = `min(${width / 2}rem, 50vw - 1rem)`;

  return (
    <SurfaceProvider surface="floating">
      <ContextMenu>
        <RenderArea
          kind="input"
          role="presentation"
          css={styles.backdropStyle}
          style={{ top: `${popup.position.y - 4}px` }}
          onClick={onClose}
        />
        <RenderArea
          kind={isLeaving ? 'input' : 'default'}
          radius={popup.kind === 'main' ? '3rem' : '1.6rem'}
          css={styles.toolkitStyle}
          style={{
            left: `clamp(calc(${edgeOffset} + 1rem), ${popup.position.x}px, calc(100vw - ${edgeOffset} - 1rem))`,
            top: `${popup.position.y}px`,
          }}
        >
          <ToolkitPortalProvider css={styles.innerPortalStyle}>
            <SizeAnimated skipInitialAnimation>
              <Transition kind={popup.kind}>
                <Popup width={`${width}rem`} />
              </Transition>
            </SizeAnimated>
          </ToolkitPortalProvider>
        </RenderArea>
      </ContextMenu>
    </SurfaceProvider>
  );
};
