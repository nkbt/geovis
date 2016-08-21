const sqr = a => a * a;

export const circle = ([x1, y1], [x2, y2], [x3, y3]) => {
  const temp = sqr(x2) + sqr(y2);
  const p1p2 = (sqr(x1) + sqr(y1) - temp) / 2.0;
  const p2p3 = (temp - sqr(x3) - sqr(y3)) / 2.0;
  const det = (x1 - x2) * (y2 - y3) - (x2 - x3) * (y1 - y2);

  if (Math.abs(det) < 1e-14) {
    return false;
  }

  return [
    (p1p2 * (y2 - y3) - p2p3 * (y1 - y2)) / det,
    ((x1 - x2) * p2p3 - (x2 - x3) * p1p2) / det
  ];
};
