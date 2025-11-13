import { Suspense, useMemo, useRef, useState } from 'react';
import { match } from 'ts-pattern';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useMeasure } from '@/hooks/useMeasure';
import { useMergedRef } from '@/hooks/useMergedRef';
import * as styles from './ContextMenu.css';
import { ContextMenuProvider, useContextMenuProvider } from './ContextMenuProvider';
import type { ContextMenuNode, ContextMenuToken } from './types';
import type { ReactNode } from 'react';

const ContextMenuFallback = () => <div css={styles.fallbackStyle} />;

const ContextMenuSubmenu = ({ submenu }: { submenu: ContextMenuNode }) => {
  const [isOpened, setIsOpened] = useState(false);
  const isOpenedDebounced = useDebouncedValue(isOpened, { delay: 500 });

  return (
    <div
      css={styles.submenuStyle}
      onMouseEnter={() => setIsOpened(false)}
      onMouseLeave={() => setIsOpened(true)}
    >
      {submenu.children && isOpenedDebounced && (
        <div css={styles.submenuChildrenStyle}>
          <Suspense fallback={<ContextMenuFallback />}>
            <ContextMenuRenderer token={submenu.children} />
          </Suspense>
        </div>
      )}
    </div>
  );
};

const ContextMenuSection = ({ section }: { section: ContextMenuNode }) => (
  <div css={styles.sectionStyle}>
    {section.label}
    {section.children && <ContextMenuRenderer token={section.children} />}
  </div>
);

const ContextMenuItem = ({ item }: { item: ContextMenuNode }) => (
  <button css={styles.itemStyle}>{item.label}</button>
);

const ContextMenuRenderer = ({ token }: { token: ContextMenuToken }) => {
  const expandToken = useContextMenuProvider(state => state.expandToken);
  const menu = useMemo(() => expandToken(token), []);
  if (!menu) {
    return null;
  }

  const children = menu.map(node =>
    match(node)
      .with({ kind: 'submenu' }, submenu => <ContextMenuSubmenu submenu={submenu} />)
      .with({ kind: 'section' }, section => <ContextMenuSection section={section} />)
      .otherwise(item => <ContextMenuItem item={item} />)
  );

  return <div css={styles.listStyle}>{children}</div>;
};

type ContextMenuFrameProps = Pick<JSX.IntrinsicElements['div'], 'className' | 'style'> & {
  children: ReactNode;
};

const ContextMenuFrame = ({ className, style, children }: ContextMenuFrameProps) => {
  const positionRef = useRef<HTMLDivElement | null>(null);
  const [measureRef, size] = useMeasure();
  const frameRef = useMergedRef(positionRef, measureRef);

  const [isLeftwards, isUpwards] = (() => {
    const elem = positionRef.current;
    if (!elem || !size) {
      return [false, false];
    }

    const position = elem.getBoundingClientRect();
    const root = elem.ownerDocument.documentElement;
    const rootWidth = root.clientWidth;
    const rootHeight = root.clientHeight;

    const isLeftwards = position.x + size[0] > rootWidth - 50;
    const isUpwards = position.y + size[1] > rootHeight - 50;
    return [isLeftwards, isUpwards];
  })();

  return (
    <div className={className} style={style} ref={frameRef}>
      <div css={styles.frameStyle(isLeftwards, isUpwards)}>{children}</div>
    </div>
  );
};

const ContextMenuRoot = () => {
  const root = useContextMenuProvider(state => state.root);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const position = useContextMenuProvider(state => state.position);
  const style = { top: `${position.y}px`, left: `${position.x}px` };

  return (
    <div ref={rootRef}>
      {root && (
        <ContextMenuFrame style={style}>
          <ContextMenuRenderer token={root} />
        </ContextMenuFrame>
      )}
    </div>
  );
};

export const ContextMenu = ({ children }: { children: ReactNode }) => (
  <ContextMenuProvider>
    {children}
    <Suspense>
      <ContextMenuRoot />
    </Suspense>
  </ContextMenuProvider>
);
