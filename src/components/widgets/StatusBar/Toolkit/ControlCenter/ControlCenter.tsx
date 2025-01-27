import { config } from '@/config';
import * as styles from './ControlCenter.css';
import { ControlCenterHeader } from './ControlCenterHeader';
import { ControlCenterItem } from './ControlCenterItem';
import { PowerMenu } from './PowerMenu';

export const ControlCenter = () => (
  <div css={styles.containerStyle}>
    <ControlCenterHeader />
    <div css={styles.columnsContainerStyle}>
      {config().controlCenter.items.map((items, index) => (
        <div key={index} css={styles.columnStyle}>
          {items.map(item => (
            <ControlCenterItem key={item.id} item={item} />
          ))}
        </div>
      ))}
    </div>
    <div css={styles.powerMenuStyle}>
      <PowerMenu />
    </div>
  </div>
);
