import { ArrowRight as IconArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { bridgeRenderer } from '@/bridge/renderer';
import * as styles from './PowerMenuConfirm.css';
import type { PowerMenuItem } from './types';

type PowerMenuConfirmProps = {
  item: PowerMenuItem;
  onClose: () => void;
};

export const PowerMenuConfirm = ({ item, onClose }: PowerMenuConfirmProps) => {
  const hasConfirmedRef = useRef(false);

  const { t } = useTranslation();
  const [state, setState] = useState(0);

  useEffect(() => {
    if (!hasConfirmedRef.current && state === 100) {
      void bridgeRenderer.debug({ command: item.command });
      hasConfirmedRef.current = true;
      onClose();
    }
  }, [state, onClose]);

  return (
    <label css={styles.labelStyle} style={{ '--percentage': `${state}%` }}>
      <div css={styles.gradientStyle} />
      <div css={styles.sliderStyle}>
        <span css={styles.iconStyle}>{item.icon}</span>
      </div>
      <div css={styles.guideStyle(state === 0)}>
        <IconArrowRight css={styles.guideArrowStyle} width="1em" height="1em" />
        <span css={styles.guideTextStyle}>
          {t('control-center.slide-to', { action: item.name })}
        </span>
      </div>
      <input
        css={styles.inputStyle}
        type="range"
        min={0}
        max={100}
        value={state}
        onChange={e => setState(e.currentTarget.valueAsNumber)}
        onMouseUp={() => setState(0)}
      />
      <div css={styles.maskStyle} />
    </label>
  );
};
