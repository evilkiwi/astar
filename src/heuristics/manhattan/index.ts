import type { Heuristic } from '../types';

export const manhattan: Heuristic = (from, to) => {
  return Math.abs(to[0] - from[0]) + Math.abs(to[1] - from[1]);
};
