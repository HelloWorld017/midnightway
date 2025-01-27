import { useMeasure } from '@/hooks/useMeasure';
import * as styles from './SizeAnimated.css';
import type { ReactNode } from 'react';

type SizeAnimatedProps = {
  className?: string;
  children: ReactNode;
};

export const SizeAnimated = ({ className, children }: SizeAnimatedProps) => {
  const [innerRef, size] = useMeasure();

  return (
    <div
      className={className}
      css={styles.sizeAnimatedStyle}
      style={{
        width: size ? `${size[0]}px` : 'initial',
        height: size ? `${size[1]}px` : 'initial',
      }}
    >
      <div css={!!size && styles.sizeAnimatedChildrenStyle} ref={innerRef}>
        {children}
      </div>
    </div>
  );
};
