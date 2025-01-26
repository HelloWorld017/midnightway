import { DynamicIcon } from 'lucide-react/dynamic';
import { bridgeRenderer } from '@/bridge/renderer';
import * as styles from './ControlCenterItemButton.css';
import type { ControlCenterItem } from '@/config/schema';
import type { IconName } from 'lucide-react/dynamic';

type ControlCenterItemButtonProps = {
  item: ControlCenterItem & { kind: 'button' };
  onClick?: () => void;
};

export const ControlCenterItemButton = ({ item, onClick }: ControlCenterItemButtonProps) => {
  const onClickButton = () => {
    if (onClick) {
      return onClick();
    }

    void bridgeRenderer.exec({ command: item.command });
  };

  return (
    <button css={styles.buttonStyle} type="button" onClick={onClickButton}>
      <DynamicIcon name={item.icon as IconName} width="1em" height="1em" />
    </button>
  );
};
