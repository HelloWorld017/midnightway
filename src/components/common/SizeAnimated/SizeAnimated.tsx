import { useMeasure } from '@/hooks/useMeasure';
import * as styles from './SizeAnimated.css';
import type { ReactNode } from 'react';

type SizeAnimatedProps = {
  className?: string;
  children: ReactNode;
  axis?: 'x' | 'y' | 'xy';
};

export const SizeAnimated = ({ className, children, axis = 'xy' }: SizeAnimatedProps) => {
  const [innerRef, size] = useMeasure();

  return (
    <div
      className={className}
      css={styles.sizeAnimatedStyle}
      style={{
        width: axis !== 'y' && size ? `${size[0]}px` : undefined,
        height: axis !== 'x' && size ? `${size[1]}px` : undefined,
      }}
    >
      <div
        css={[
          axis === 'xy' && !!size && styles.sizeAnimatedChildrenStyle,
          axis === 'x' && styles.widthAnimatedChildrenStyle,
        ]}
        ref={innerRef}
      >
        {children}
      </div>
    </div>
  );
};
