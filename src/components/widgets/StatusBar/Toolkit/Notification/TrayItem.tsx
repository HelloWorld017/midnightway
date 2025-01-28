import { bridgeRenderer } from '@/bridge/renderer';
import { repo } from '@/bridge/repository';
import { useRepo } from '@/hooks/useRepo';
import * as styles from './TrayItem.css';

export const TrayItem = ({ id }: { id: string }) => {
  const tray = useRepo(repo.tray.$invokeMethod('get_item', id).$pick('title', 'id', 'iconName'));
  const trayTooltip = useRepo(
    repo.tray.$invokeMethod('get_item', id).tooltip.$pick('title', 'description')
  );

  const onClick = () => {
    void bridgeRenderer.debug(['primary-click', id]);
  };

  const onContextMenu = () => {
    void bridgeRenderer.debug(['secondary-click', id]);
  };

  return (
    <button
      css={styles.trayStyle}
      type="button"
      onClick={onClick}
      onContextMenu={onContextMenu}
      title={trayTooltip?.description}
    >
      <span css={styles.textStyle}>
        {trayTooltip?.title || tray?.title || tray?.id || tray?.iconName}
      </span>
    </button>
  );
};
