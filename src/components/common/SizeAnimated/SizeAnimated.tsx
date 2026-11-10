import { useMeasure } from '@/hooks/useMeasure';
import { useEffect, useState } from 'react';
import * as styles from './SizeAnimated.css';
import type { ReactNode } from 'react';

type SizeAnimatedProps = {
  className?: string;
  children: ReactNode;
  axis?: 'x' | 'y' | 'xy';
  skipInitialAnimation?: boolean;
};

export const SizeAnimated = ({
  className,
  children,
  axis = 'xy',
  skipInitialAnimation = false,
}: SizeAnimatedProps) => {
  const [innerRef, size] = useMeasure();
  const [initialized, setInitialized] = useState(false);
  const hasInitialSize = !!size && (axis === 'y' || size[0] > 0) && (axis === 'x' || size[1] > 0);
  const measuredSize = skipInitialAnimation && !initialized && !hasInitialSize ? null : size;

  useEffect(() => {
    if (skipInitialAnimation && hasInitialSize && !initialized) {
      setInitialized(true);
    }
  }, [skipInitialAnimation, hasInitialSize, initialized]);

  return (
    <div
      className={className}
      css={styles.sizeAnimatedStyle}
      style={{
        width: axis !== 'y' && measuredSize ? `${measuredSize[0]}px` : undefined,
        height: axis !== 'x' && measuredSize ? `${measuredSize[1]}px` : undefined,
        transition: skipInitialAnimation && !initialized ? 'none' : undefined,
      }}
    >
      <div
        css={[
          axis === 'xy' && !!measuredSize && styles.sizeAnimatedChildrenStyle,
          axis === 'x' && styles.widthAnimatedChildrenStyle,
        ]}
        ref={innerRef}
      >
        {children}
      </div>
    </div>
  );
};
