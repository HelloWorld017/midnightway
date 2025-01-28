import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IconLock, IconLogOut, IconMoonStar, IconPower, IconRotateCcw } from '@/assets/icons';
import { bridgeRenderer } from '@/bridge/renderer';
import * as styles from './PowerMenuDropdown.css';
import type { PowerMenuItem } from './types';

type PowerMenuDropdownProps = {
  onConfirm: (item: PowerMenuItem) => void;
};

export const PowerMenuDropdown = ({ onConfirm }: PowerMenuDropdownProps) => {
  const { t } = useTranslation();
  const items = useMemo<(PowerMenuItem | null)[]>(
    () => [
      {
        icon: <IconPower />,
        name: t('control-center.power-shutdown'),
        command: ['systemctl', 'poweroff'],
        shouldConfirm: true,
      },
      {
        icon: <IconRotateCcw />,
        name: t('control-center.power-reboot'),
        command: ['systemctl', 'reboot'],
        shouldConfirm: true,
      },
      {
        icon: <IconMoonStar />,
        name: t('control-center.power-suspend'),
        command: ['systemctl', 'suspend'],
      },
      null,
      {
        icon: <IconLogOut />,
        name: t('control-center.session-logoff'),
        command: ['hyprctl', 'dispatch', 'exit'],
        shouldConfirm: true,
      },
      {
        icon: <IconLock />,
        name: t('control-center.session-lock'),
        command: ['loginctl', 'lock-session'],
      },
    ],
    [t]
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
      {items.map(item =>
        item ? (
          <button css={styles.itemStyle} type="button" onClick={() => onClickItem(item)}>
            <div css={styles.iconStyle}>{item.icon}</div>
            <span css={styles.labelStyle}>{item.name}</span>
          </button>
        ) : (
          <hr css={styles.dividerStyle} />
        )
      )}
    </div>
  );
};
