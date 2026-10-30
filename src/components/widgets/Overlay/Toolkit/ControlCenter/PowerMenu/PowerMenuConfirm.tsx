import { IconArrowRight } from '@/assets/icons';
import { bridgeRenderer } from '@/bridge/renderer';
import { useLatestRef } from '@/hooks/useLatestRef';
import { defineI18n } from '@simplei18n/core';
import { useI18n } from '@simplei18n/core/react';
import { useEffect, useRef, useState } from 'react';
import * as styles from './PowerMenuConfirm.css';
import type { PowerMenuItem } from './types';

defineI18n(
  yaml => yaml`
  # scope: controlCenter
  slideTo: 'Slide to {action}'
`,
);

type PowerMenuConfirmProps = {
  item: PowerMenuItem;
  onClose: () => void;
};

export const PowerMenuConfirm = ({ item, onClose }: PowerMenuConfirmProps) => {
  const hasConfirmedRef = useRef(false);

  const { t } = useI18n();
  const [state, setState] = useState(0);
  const itemRef = useLatestRef(item);

  useEffect(() => {
    if (!hasConfirmedRef.current && state === 100) {
      void bridgeRenderer.exec({ command: itemRef.current.command });
      hasConfirmedRef.current = true;
      onClose();
    }
  }, [state, itemRef, onClose]);

  return (
    <label css={styles.labelStyle} style={{ '--percentage': `${(state / 105) * 100}%` }}>
      <div css={styles.gradientStyle} />
      <div css={styles.sliderStyle}>
        <span css={styles.iconStyle}>{item.icon}</span>
      </div>
      <div css={styles.guideStyle(state === 0)}>
        <IconArrowRight css={styles.guideArrowStyle} />
        <span css={styles.guideTextStyle}>{t(t.controlCenter.slideTo, { action: item.name })}</span>
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
