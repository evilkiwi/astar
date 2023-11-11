import type { Heuristic } from './index';

export const diagonal: Heuristic = (from, to) => {
  const d1 = Math.abs(to[0] - from[0]);
  const d2 = Math.abs(to[1] - from[1]);
  const D2 = Math.sqrt(2);
  const D = 1;

  return D * (d1 + d2) + (D2 - 2 * D) * Math.min(d1, d2);
};
