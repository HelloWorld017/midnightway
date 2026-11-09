import { Transition } from '@/components/common/Transition';
import { useState } from 'react';
import { PowerMenuConfirm } from '../../ControlCenter/PowerMenu/PowerMenuConfirm';
import { PowerMenuDropdown } from '../../ControlCenter/PowerMenu/PowerMenuDropdown';
import * as styles from '../popup.css';
import type { PowerMenuItem } from '../../ControlCenter/PowerMenu/types';

export const PowerMenuPopup = () => {
  const [item, setItem] = useState<PowerMenuItem | null>(null);
  return (
    <div css={styles.popupStyle('20rem')}>
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
