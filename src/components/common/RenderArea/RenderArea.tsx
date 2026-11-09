import { bridgeRenderer } from '@/bridge/renderer';
import { useRootProvider } from '@/components/common/RootProvider';
import { createContext, useContext, useLayoutEffect, useRef } from 'react';
import type { RenderArea as RenderAreaBounds } from '@/bridge/types';
import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';

type AreaEntry = { element: HTMLDivElement; input: boolean; blur: boolean };
type AreaRegistry = Set<AreaEntry>;
const RenderAreaContext = createContext<AreaRegistry | null>(null);

const measure = (entry: AreaEntry, ownerWindow: Window): RenderAreaBounds | null => {
  const { element, input, blur } = entry;
  const rect = element.getBoundingClientRect();
  if ((!input && !blur) || rect.width <= 0 || rect.height <= 0) {
    return null;
  }

  let left = 0;
  let top = 0;
  let right = ownerWindow.innerWidth;
  let bottom = ownerWindow.innerHeight;
  for (let node: HTMLElement | null = element; node; node = node.parentElement) {
    const style = ownerWindow.getComputedStyle(node);
    if (style.display === 'none' || style.visibility === 'hidden') {
      return null;
    }
    if (node === element) {
      continue;
    }
    const bounds = node.getBoundingClientRect();
    const scaleX = node.offsetWidth ? bounds.width / node.offsetWidth : 1;
    const scaleY = node.offsetHeight ? bounds.height / node.offsetHeight : 1;
    if (['hidden', 'clip', 'scroll', 'auto'].includes(style.overflowX)) {
      left = Math.max(left, bounds.left + node.clientLeft * scaleX);
      right = Math.min(right, bounds.left + (node.clientLeft + node.clientWidth) * scaleX);
    }
    if (['hidden', 'clip', 'scroll', 'auto'].includes(style.overflowY)) {
      top = Math.max(top, bounds.top + node.clientTop * scaleY);
      bottom = Math.min(bottom, bounds.top + (node.clientTop + node.clientHeight) * scaleY);
    }
  }
  if (
    right <= left ||
    bottom <= top ||
    rect.right <= left ||
    rect.left >= right ||
    rect.bottom <= top ||
    rect.top >= bottom
  ) {
    return null;
  }

  const radius = ownerWindow.getComputedStyle(element).borderTopLeftRadius.split(' ');
  const resolveRadius = (value: string, size: number, scale: number) =>
    value.endsWith('%') ? (parseFloat(value) / 100) * size : (parseFloat(value) || 0) * scale;
  const radiusX = Math.min(
    rect.width / 2,
    resolveRadius(
      radius[0],
      rect.width,
      element.offsetWidth ? rect.width / element.offsetWidth : 1,
    ),
  );
  const radiusY = Math.min(
    rect.height / 2,
    resolveRadius(
      radius[1] ?? radius[0],
      rect.height,
      element.offsetHeight ? rect.height / element.offsetHeight : 1,
    ),
  );

  return {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    radiusX,
    radiusY,
    clip: { x: left, y: top, width: right - left, height: bottom - top },
    input,
    blur,
  };
};

export const RenderAreaProvider = ({
  surface,
  children,
}: {
  surface: 'bar' | 'overlay';
  children: ReactNode;
}) => {
  const { window: ownerWindow } = useRootProvider();
  const registry = useRef<AreaRegistry>(new Set()).current;

  useLayoutEffect(() => {
    let frame = 0;
    let previous = '';
    const update = () => {
      const areas = Array.from(registry, entry => measure(entry, ownerWindow)).filter(
        area => area !== null,
      );
      const serialized = JSON.stringify(areas);
      if (serialized !== previous) {
        previous = serialized;
        void bridgeRenderer.setRenderAreas({ surface, areas });
      }
      frame = ownerWindow.requestAnimationFrame(update);
    };
    update();
    return () => {
      ownerWindow.cancelAnimationFrame(frame);
      void bridgeRenderer.setRenderAreas({ surface, areas: [] });
    };
  }, [ownerWindow, registry, surface]);

  return <RenderAreaContext value={registry}>{children}</RenderAreaContext>;
};

type RenderAreaProps = HTMLAttributes<HTMLDivElement> & {
  radius?: CSSProperties['borderRadius'];
  input?: boolean;
  blur?: boolean;
  ref?: Ref<HTMLDivElement>;
};

export const RenderArea = ({
  radius,
  input = true,
  blur = true,
  style,
  ref,
  ...props
}: RenderAreaProps) => {
  const registry = useContext(RenderAreaContext);
  const elementRef = useRef<HTMLDivElement>(null);
  if (!registry) {
    throw new Error('RenderArea requires RenderAreaProvider');
  }

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return undefined;
    }
    const entry = { element, input, blur };
    registry.add(entry);
    return () => {
      registry.delete(entry);
    };
  }, [registry, input, blur]);

  return (
    <div
      {...props}
      ref={element => {
        elementRef.current = element;
        if (typeof ref === 'function') {
          ref(element);
        } else if (ref) {
          ref.current = element;
        }
      }}
      style={{ ...style, ...(radius !== undefined ? { borderRadius: radius } : {}) }}
    />
  );
};
