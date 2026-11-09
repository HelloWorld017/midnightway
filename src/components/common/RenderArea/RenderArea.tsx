import { bridgeRenderer } from '@/bridge/renderer';
import { useRootProvider } from '@/components/common/RootProvider';
import { createContext, useContext, useLayoutEffect, useMemo, useRef } from 'react';
import type { RenderArea as RenderAreaBounds } from '@/bridge/types';
import type { CSSProperties, HTMLAttributes, ReactNode, Ref, RefObject } from 'react';

type RenderAreaKind = 'clip' | 'input' | 'default';
type AreaEntry = {
  element: RefObject<HTMLDivElement | null>;
  parent: AreaEntry | null;
  kind: RenderAreaKind;
};
type AreaRegistry = Set<AreaEntry>;

const RegistryContext = createContext<AreaRegistry | null>(null);
const ClipContext = createContext<AreaEntry | null>(null);

// Cairo regions use integers; include pixels whose centers fall inside the area.
const pixelBoundary = (coordinate: number) => Math.ceil(coordinate - 0.5);

const measure = (entry: AreaEntry, ownerWindow: Window): RenderAreaBounds | null => {
  const element = entry.element.current;
  if (!element || entry.kind === 'clip') {
    return null;
  }

  const rect = element.getBoundingClientRect();
  if (
    rect.width <= 0 ||
    rect.height <= 0 ||
    ownerWindow.getComputedStyle(element).visibility === 'hidden'
  ) {
    return null;
  }

  let left = Math.max(0, rect.left);
  let top = Math.max(0, rect.top);
  let right = Math.min(ownerWindow.innerWidth, rect.right);
  let bottom = Math.min(ownerWindow.innerHeight, rect.bottom);

  for (let parent = entry.parent; parent; parent = parent.parent) {
    const clipElement = parent.element.current;
    if (!clipElement) {
      return null;
    }

    const clip = clipElement.getBoundingClientRect();
    left = Math.max(left, clip.left);
    top = Math.max(top, clip.top);
    right = Math.min(right, clip.right);
    bottom = Math.min(bottom, clip.bottom);
  }

  const x = pixelBoundary(left);
  const y = pixelBoundary(top);
  const width = pixelBoundary(right) - x;
  const height = pixelBoundary(bottom) - y;
  if (width <= 0 || height <= 0) {
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
    x: rect.left,
    y: rect.top,
    width: rect.width,
    height: rect.height,
    radiusX,
    radiusY,
    clipBounds: { x, y, width, height },
    input: true,
    blur: entry.kind === 'default',
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

  return (
    <RegistryContext value={registry}>
      <ClipContext value={null}>{children}</ClipContext>
    </RegistryContext>
  );
};

type RenderAreaProps = HTMLAttributes<HTMLDivElement> & {
  kind?: RenderAreaKind;
  root?: boolean;
  radius?: CSSProperties['borderRadius'];
  ref?: Ref<HTMLDivElement>;
};

export const RenderArea = ({
  kind = 'default',
  root = false,
  radius,
  style,
  ref,
  children,
  ...props
}: RenderAreaProps) => {
  const registry = useContext(RegistryContext);
  const parent = useContext(ClipContext);
  const element = useRef<HTMLDivElement>(null);
  const entry = useMemo<AreaEntry>(
    () => ({ element, parent: root ? null : parent, kind }),
    [parent, root, kind],
  );

  useLayoutEffect(() => {
    if (!registry) {
      return undefined;
    }

    registry.add(entry);
    return () => {
      registry.delete(entry);
    };
  }, [registry, entry]);

  if (!registry) {
    throw new Error('RenderArea requires RenderAreaProvider');
  }

  return (
    <div
      {...props}
      ref={node => {
        element.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      style={{ ...style, ...(radius !== undefined ? { borderRadius: radius } : {}) }}
    >
      <ClipContext value={entry}>{children}</ClipContext>
    </div>
  );
};
