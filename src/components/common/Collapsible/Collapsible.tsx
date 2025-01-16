import * as styles from './Collapsible.css';
import type { ReactNode } from 'react';

type CollapsibleProps = {
  className?: string;
  orientation: 'horizontal' | 'vertical';
  isVisible: boolean;
  children: ReactNode;
};

export const Collapsible = ({ className, orientation, isVisible, children }: CollapsibleProps) => (
  <div className={className} css={styles.collapsibleParentStyle(orientation, isVisible)}>
    <div css={styles.collapsibleChildStyle}>{children}</div>
  </div>
);
