import { useRootProvider } from '@/components/common/RootProvider';
import { useClickOutside } from '@/hooks/useClickOutside';
import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { match } from 'ts-pattern';
import * as styles from './ContextMenu.css';
import { ContextMenuProvider, useContextMenuProvider } from './ContextMenuProvider';
import type { ContextMenuNode, ContextMenuToken } from './types';
import type { KeyboardEvent, ReactNode, RefObject } from 'react';

const ContextMenuFallback = () => <output css={styles.fallbackStyle}>Loading…</output>;

const ContextMenuSubmenu = ({ submenu }: { submenu: ContextMenuNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusOnOpen, setFocusOnOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearTimer = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };
  useEffect(() => () => clearTimer(), []);

  const open = (focus: boolean) => {
    clearTimer();
    setFocusOnOpen(focus);
    setIsOpen(true);
  };

  return (
    <div
      css={styles.submenuStyle}
      onMouseEnter={() => {
        clearTimer();
        timerRef.current = setTimeout(() => open(false), 150);
      }}
      onMouseLeave={() => {
        clearTimer();
        timerRef.current = setTimeout(() => setIsOpen(false), 250);
      }}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          clearTimer();
          setIsOpen(false);
        }
      }}
    >
      <button
        ref={triggerRef}
        css={styles.itemStyle}
        type="button"
        role="menuitem"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        disabled={!submenu.children}
        onClick={() => open(true)}
        onKeyDown={event => {
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            event.stopPropagation();
            open(true);
          }
        }}
      >
        <span css={styles.labelStyle}>{submenu.label}</span>
        <span css={styles.chevronStyle} aria-hidden="true">
          ›
        </span>
      </button>
      {submenu.children && isOpen && (
        <ContextMenuFrame
          anchorRef={triggerRef}
          label={submenu.label}
          focusOnOpen={focusOnOpen}
          onBack={() => {
            setIsOpen(false);
            triggerRef.current?.focus();
          }}
        >
          <Suspense fallback={<ContextMenuFallback />}>
            <ContextMenuRenderer token={submenu.children} />
          </Suspense>
        </ContextMenuFrame>
      )}
    </div>
  );
};

const ContextMenuSection = ({ section }: { section: ContextMenuNode }) => (
  <fieldset css={styles.sectionStyle} aria-label={section.label || undefined}>
    {section.label && <div css={styles.sectionLabelStyle}>{section.label}</div>}
    {section.children && <ContextMenuRenderer token={section.children} />}
  </fieldset>
);

const ContextMenuItem = ({ item }: { item: ContextMenuNode }) => {
  const activate = useContextMenuProvider(state => state.activate);
  return (
    <button
      css={styles.itemStyle}
      type="button"
      role="menuitem"
      disabled={item.action === null}
      onClick={() => {
        if (item.action !== null) {
          activate(item.action);
        }
      }}
    >
      <span css={styles.labelStyle}>{item.label}</span>
    </button>
  );
};

const ContextMenuRenderer = ({ token }: { token: ContextMenuToken }) => {
  const expandToken = useContextMenuProvider(state => state.expandToken);
  const menu = expandToken(token);
  if (!menu?.length) {
    return <div css={styles.fallbackStyle}>No actions available</div>;
  }

  return (
    <div css={styles.listStyle}>
      {menu.map((node, index) => {
        switch (node.kind) {
          case 'submenu':
            return <ContextMenuSubmenu key={index} submenu={node} />;
          case 'section':
            return <ContextMenuSection key={index} section={node} />;
          default:
            return <ContextMenuItem key={index} item={node} />;
        }
      })}
    </div>
  );
};

type ContextMenuFrameProps = {
  children: ReactNode;
  position?: { x: number; y: number };
  anchorRef?: RefObject<HTMLButtonElement | null>;
  label?: string;
  focusOnOpen?: boolean;
  onBack?: () => void;
};

const ContextMenuFrame = ({
  children,
  position,
  anchorRef,
  label,
  focusOnOpen = false,
  onBack,
}: ContextMenuFrameProps) => {
  const { window: ownerWindow, document: ownerDocument } = useRootProvider();
  const frameRef = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState<{ left: number; top: number } | null>(null);
  const isPositioned = placement !== null;

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) {
      return undefined;
    }

    const place = () => {
      const margin = 8;
      const { clientWidth: width, clientHeight: height } = ownerDocument.documentElement;
      const rect = frame.getBoundingClientRect();
      const anchor = anchorRef?.current?.getBoundingClientRect();

      let left = anchor ? anchor.right + 4 : (position?.x ?? margin);
      let top = anchor ? anchor.top - 5 : (position?.y ?? margin);

      if (left + rect.width > width - margin) {
        left = anchor ? anchor.left - rect.width - 4 : left - rect.width;
      }

      top = Math.max(margin, Math.min(top, height - rect.height - margin));
      left = Math.max(margin, Math.min(left, width - rect.width - margin));

      setPlacement(previous =>
        previous?.left === left && previous.top === top ? previous : { left, top },
      );
    };

    place();

    const observer = new ownerWindow.ResizeObserver(place);
    observer.observe(frame);
    if (anchorRef?.current) {
      observer.observe(anchorRef.current);
    }

    ownerWindow.addEventListener('resize', place);
    ownerDocument.addEventListener('scroll', place, true);

    return () => {
      observer.disconnect();
      ownerWindow.removeEventListener('resize', place);
      ownerDocument.removeEventListener('scroll', place, true);
    };
  }, [position, anchorRef, ownerDocument, ownerWindow]);

  useLayoutEffect(() => {
    if (focusOnOpen && isPositioned) {
      frameRef.current?.focus({ preventScroll: true });
    }
  }, [focusOnOpen, isPositioned]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
      return;
    }

    if ((event.target as HTMLElement).closest('[role="menu"]') !== event.currentTarget) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (event.key === 'ArrowLeft') {
      onBack?.();
      return;
    }

    const ancestorItems = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)'),
    );

    const items = ancestorItems.filter(
      item => item.closest('[role="menu"]') === event.currentTarget,
    );

    const index = items.indexOf(ownerDocument.activeElement as HTMLButtonElement);

    const next = match(event.key)
      .with('Home', () => 0)
      .with('End', () => items.length - 1)
      .with('ArrowDown', () => (index + 1) % items.length)
      .with('ArrowUp', () => (index - 1 + items.length) % items.length)
      .otherwise(() => index);

    items[next]?.focus();
  };

  return (
    <div
      ref={frameRef}
      css={styles.frameStyle}
      style={{ ...placement, visibility: placement ? 'visible' : 'hidden' }}
      role="menu"
      aria-label={label}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      onClick={event => event.stopPropagation()}
      onContextMenu={event => event.preventDefault()}
    >
      {children}
    </div>
  );
};

const ContextMenuRoot = () => {
  const { window: ownerWindow, document: ownerDocument } = useRootProvider();
  const root = useContextMenuProvider(state => state.root);
  const isOpen = useContextMenuProvider(state => state.isOpen);
  const session = useContextMenuProvider(state => state.session);
  const close = useContextMenuProvider(state => state.close);
  const position = useContextMenuProvider(state => state.position);
  const rootRef = useClickOutside<HTMLDivElement>({ isActive: isOpen, onClickOutside: close });

  useLayoutEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const menuRoot = rootRef.current;
    const previousFocus = ownerDocument.activeElement;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Tab') {
        if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
        }

        close();
      }
    };

    const onScroll = (event: Event) => {
      if (!(event.target instanceof ownerWindow.Node) || !menuRoot?.contains(event.target)) {
        close();
      }
    };

    ownerDocument.addEventListener('keydown', onKeyDown, true);
    ownerDocument.addEventListener('scroll', onScroll, true);
    ownerWindow.addEventListener('blur', close);
    ownerWindow.addEventListener('resize', close);

    return () => {
      const hadFocus =
        menuRoot?.contains(ownerDocument.activeElement) ||
        ownerDocument.activeElement === ownerDocument.body;
      ownerDocument.removeEventListener('keydown', onKeyDown, true);
      ownerDocument.removeEventListener('scroll', onScroll, true);
      ownerWindow.removeEventListener('blur', close);
      ownerWindow.removeEventListener('resize', close);

      if (
        hadFocus &&
        previousFocus instanceof ownerWindow.HTMLElement &&
        previousFocus.isConnected
      ) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [isOpen, session, close, ownerDocument, ownerWindow, rootRef]);

  return (
    <>
      {isOpen &&
        createPortal(
          <div ref={rootRef}>
            <ContextMenuFrame key={session} position={position} focusOnOpen>
              <Suspense fallback={<ContextMenuFallback />}>
                {root ? <ContextMenuRenderer token={root} /> : <ContextMenuFallback />}
              </Suspense>
            </ContextMenuFrame>
          </div>,
          ownerDocument.body,
        )}
    </>
  );
};

export const ContextMenu = ({ children }: { children: ReactNode }) => (
  <ContextMenuProvider>
    {children}
    <ContextMenuRoot />
  </ContextMenuProvider>
);
