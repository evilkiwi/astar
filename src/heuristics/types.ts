import type { Vector } from '@/types';

export type Heuristic = (from: Vector, to: Vector) => number;
