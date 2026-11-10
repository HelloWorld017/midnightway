import { Transition } from '@/components/common/Transition';
import { useState } from 'react';
import { PowerMenuConfirm } from '../../ControlCenter/PowerMenu/PowerMenuConfirm';
import { PowerMenuDropdown } from '../../ControlCenter/PowerMenu/PowerMenuDropdown';
import * as styles from '../index.css';
import type { PowerMenuItem } from '../../ControlCenter/PowerMenu/types';

export const PowerMenuPopup = ({ width }: { width: string }) => {
  const [item, setItem] = useState<PowerMenuItem | null>(null);
  return (
    <div css={styles.popupStyle(width)}>
      <Transition kind={item ? 'confirm' : 'menu'}>
        {item ? (
          <div>
            <button css={styles.backButtonStyle} type="button" onClick={() => setItem(null)}>
              ← Back
            </button>
            <PowerMenuConfirm item={item} onClose={() => setItem(null)} inline />
          </div>
        ) : (
          <PowerMenuDropdown onConfirm={setItem} inline />
        )}
      </Transition>
    </div>
  );
};
