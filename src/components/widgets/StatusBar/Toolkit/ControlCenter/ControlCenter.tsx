import { config } from '@/config';
import * as styles from './ControlCenter.css';
import { ControlCenterHeader } from './ControlCenterHeader';
import { ControlCenterItem } from './ControlCenterItem';

export const ControlCenter = () => (
  <div>
    <ControlCenterHeader />
    <div css={styles.columnStyle}>
      {config().controlCenter.items.map((items, index) => (
        <div key={index} css={styles.columnStyle}>
          {items.map(item => (
            <ControlCenterItem key={item.id} item={item} />
          ))}
        </div>
      ))}
    </div>
  </div>
);
