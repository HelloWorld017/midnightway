import { ChevronDown as IconChevronDown, Power as IconPower } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Transition } from '@/components/common/Transition';
import { useToolkit } from '@/components/widgets/StatusBar/Toolkit/ToolkitProvider';
import * as styles from './PowerMenu.css';
import { PowerMenuConfirm } from './PowerMenuConfirm';
import { PowerMenuDropdown } from './PowerMenuDropdown';
import type { PowerMenuItem } from './types';

type PowerMenuUIState = { kind: 'dropdown' } | { kind: 'confirm'; item: PowerMenuItem } | null;

export const PowerMenu = () => {
  const toolkitInnerPortalRef = useToolkit(state => state.toolkitInnerPortalRef);
  const [uiState, setUIState] = useState<PowerMenuUIState>(null);

  return (
    <div css={styles.rootStyle}>
      <button
        css={styles.powerButtonStyle}
        type="button"
        onClick={() => setUIState(value => (value ? null : { kind: 'dropdown' }))}
      >
        <IconPower width="1em" height="1em" />
        <IconChevronDown width="1em" height="1em" />
      </button>

      {createPortal(
        <div>
          <Transition kind={uiState?.kind ?? ''}>
            {uiState && <div css={styles.backdropStyle} onClick={() => setUIState(null)} />}
            {uiState?.kind === 'dropdown' && (
              <PowerMenuDropdown onConfirm={item => setUIState({ kind: 'confirm', item })} />
            )}
            {uiState?.kind === 'confirm' && (
              <PowerMenuConfirm item={uiState.item} onClose={() => setUIState(null)} />
            )}
          </Transition>
        </div>,
        toolkitInnerPortalRef.current!
      )}
    </div>
  );
};
