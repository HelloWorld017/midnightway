import Cairo from 'cairo';

export const createInputRegion = (...rectangles: Cairo.RectangleInt[]) => {
  const region = new Cairo.Region();
  rectangles.forEach(rectangle => region.unionRectangle(rectangle));
  return region;
};
