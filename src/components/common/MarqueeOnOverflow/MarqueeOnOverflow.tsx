import { useMeasure } from '@/hooks/useMeasure';
import * as styles from './MarqueeOnOverflow.css';
import type { ReactNode } from 'react';

type MarqueeOnOverflowProps = {
  className?: string;
  gap?: string;
  bleed?: string;
  speed?: number;
  children: ReactNode;
};

export const MarqueeOnOverflow = ({
  className,
  gap = '0.8rem',
  bleed = `calc(0.5 * ${gap})`,
  speed = 30,
  children,
}: MarqueeOnOverflowProps) => {
  const [containerRef, containerSize] = useMeasure();
  const [contentsRef, contentsSize] = useMeasure();
  const shouldMarquee = contentsSize && containerSize && contentsSize[0] > containerSize[0];

  return (
    <div
      css={styles.flowRootStyle}
      style={{
        '--gap': gap,
        '--bleed': bleed,
        '--duration': shouldMarquee ? `${contentsSize[0] / speed}s` : '5s',
      }}
    >
      <div css={styles.containerStyle} className={className} ref={containerRef}>
        <div css={styles.contentsWrapperStyle(!!shouldMarquee)}>
          <div ref={contentsRef}>{children}</div>
          {shouldMarquee && <div>{children}</div>}
        </div>
      </div>
    </div>
  );
};
