import { useLayoutEffect, useRef, useState } from 'react';
import * as styles from './SizeAnimated.css';
import type { ReactNode } from 'react';

type SizeAnimatedProps = {
  className?: string;
  children: ReactNode;
};

export const SizeAnimated = ({ className, children }: SizeAnimatedProps) => {
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<[number, number] | null>(null);
  const [observer] = useState(
    () =>
      new ResizeObserver(([state]) => {
        const size = state?.contentBoxSize[0];
        if (!size) {
          return;
        }

        setSize([size.inlineSize, size.blockSize]);
      })
  );

  useLayoutEffect(() => {
    const child = innerRef.current!;
    observer.observe(child);
    return () => observer.unobserve(child);
  }, []);

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
