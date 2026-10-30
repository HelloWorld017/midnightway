import { IconLock, IconLogOut, IconMoonStar, IconPower, IconRotateCcw } from '@/assets/icons';
import { bridgeRenderer } from '@/bridge/renderer';
import { defineI18n } from '@simplei18n/core';
import { useI18n } from '@simplei18n/core/react';
import { Fragment, useMemo } from 'react';
import * as styles from './PowerMenuDropdown.css';
import type { PowerMenuItem } from './types';

defineI18n(
  yaml => yaml`
  # scope: controlCenter
  powerShutdown: 'Shutdown'
  powerReboot: 'Reboot'
  powerSuspend: 'Suspend'
  sessionLogoff: 'Log Off'
  sessionLock: 'Lock'
`,
);

type PowerMenuDropdownProps = {
  onConfirm: (item: PowerMenuItem) => void;
};

export const PowerMenuDropdown = ({ onConfirm }: PowerMenuDropdownProps) => {
  const { ts } = useI18n();
  const items = useMemo<(PowerMenuItem | null)[]>(
    () => [
      {
        icon: <IconPower />,
        name: ts(ts.controlCenter.powerShutdown),
        command: ['systemctl', 'poweroff'],
        shouldConfirm: true,
      },
      {
        icon: <IconRotateCcw />,
        name: ts(ts.controlCenter.powerReboot),
        command: ['systemctl', 'reboot'],
        shouldConfirm: true,
      },
      {
        icon: <IconMoonStar />,
        name: ts(ts.controlCenter.powerSuspend),
        command: ['systemctl', 'suspend'],
      },
      null,
      {
        icon: <IconLogOut />,
        name: ts(ts.controlCenter.sessionLogoff),
        command: ['hyprctl', 'dispatch', 'exit'],
        shouldConfirm: true,
      },
      {
        icon: <IconLock />,
        name: ts(ts.controlCenter.sessionLock),
        command: ['loginctl', 'lock-session'],
      },
    ],
    [ts],
  );

  const onClickItem = (item: PowerMenuItem) => {
    if (!item.shouldConfirm) {
      void bridgeRenderer.exec({ command: item.command });
      return;
    }

    onConfirm(item);
  };

  return (
    <div css={styles.containerStyle}>
      {items.map((item, index) => (
        <Fragment key={index}>
          {item ? (
            <button css={styles.itemStyle} type="button" onClick={() => onClickItem(item)}>
              <div css={styles.iconStyle}>{item.icon}</div>
              <span css={styles.labelStyle}>{item.name}</span>
            </button>
          ) : (
            <hr css={styles.dividerStyle} />
          )}
        </Fragment>
      ))}
    </div>
  );
};
