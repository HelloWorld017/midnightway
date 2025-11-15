import { DynamicIcon } from 'lucide-react/dynamic';
import { bridgeRenderer } from '@/bridge/renderer';
import * as styles from './ControlCenterItemButton.css';
import type { ControlCenterItem } from '@/config/schema';
import type { IconName } from 'lucide-react/dynamic';
import type { ReactNode } from 'react';

type ControlCenterItemButtonProps = {
  item: ControlCenterItem & { kind: 'button' };
  icon?: ReactNode;
  onClick?: () => void;
};

export const ControlCenterItemButton = ({
  item,
  icon,
  onClick: propsOnClick,
}: ControlCenterItemButtonProps) => {
  const onClick = () => {
    if (propsOnClick) {
      return propsOnClick();
    }

    void bridgeRenderer.exec({ command: item.command });
  };

  return (
    <button css={styles.buttonStyle} type="button" onClick={onClick}>
      <span css={styles.buttonIconStyle}>
        {icon || <DynamicIcon name={item.icon as IconName} width="1em" height="1em" />}
      </span>

      <div css={styles.buttonContentStyle}>
        {item.description && <span css={styles.buttonDescriptionStyle}>{item.description}</span>}
        <span css={styles.buttonTitleStyle}>{item.title}</span>
      </div>
    </button>
  );
};
