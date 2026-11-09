import type { RenderArea } from '@/bridge/types';

export type InputRectangle = { x: number; y: number; width: number; height: number };

type Bounds = { left: number; top: number; right: number; bottom: number };

const clippedBounds = (area: RenderArea): Bounds => ({
  left: Math.max(area.x, area.clip.x),
  top: Math.max(area.y, area.clip.y),
  right: Math.min(area.x + area.width, area.clip.x + area.clip.width),
  bottom: Math.min(area.y + area.height, area.clip.y + area.clip.height),
});

// wl_region uses integer rectangles; include pixels whose centers lie inside the bounds.
const pixelBoundary = (coordinate: number) => Math.ceil(coordinate - 0.5);

const cornerInset = (area: RenderArea, radiusX: number, radiusY: number, y: number) => {
  const centerY = y + 0.5;
  const distance = Math.max(
    0,
    area.y + radiusY - centerY,
    centerY - (area.y + area.height - radiusY),
  );
  return radiusX * (1 - Math.sqrt(Math.max(0, 1 - (distance / radiusY) ** 2)));
};

const appendRow = (rectangles: InputRectangle[], x: number, end: number, y: number) => {
  const width = end - x;
  if (width <= 0) {
    return;
  }

  const previous = rectangles.at(-1);
  if (previous && previous.x === x && previous.width === width && previous.y + previous.height === y) {
    previous.height++;
  } else {
    rectangles.push({ x, y, width, height: 1 });
  }
};

export const inputRectanglesForArea = (area: RenderArea): InputRectangle[] => {
  if (!area.input || area.width <= 0 || area.height <= 0) {
    return [];
  }

  const { left, right, top, bottom } = clippedBounds(area);
  if (left >= right || top >= bottom) {
    return [];
  }

  const radiusX = Math.max(0, Math.min(area.radiusX, area.width / 2));
  const radiusY = Math.max(0, Math.min(area.radiusY, area.height / 2));
  const startY = pixelBoundary(top);
  const endY = pixelBoundary(bottom);

  if (radiusX === 0 || radiusY === 0) {
    const x = pixelBoundary(left);
    const width = pixelBoundary(right) - x;
    const height = endY - startY;
    return width > 0 && height > 0 ? [{ x, y: startY, width, height }] : [];
  }

  const rectangles: InputRectangle[] = [];
  for (let y = startY; y < endY; y++) {
    const inset = cornerInset(area, radiusX, radiusY, y);
    const x = pixelBoundary(Math.max(left, area.x + inset));
    const end = pixelBoundary(Math.min(right, area.x + area.width - inset));
    appendRow(rectangles, x, end, y);
  }
  return rectangles;
};
