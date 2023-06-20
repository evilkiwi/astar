import type { Vector } from '@/types';

export type Heuristic = (from: Vector, to: Vector) => number;

export * from './manhattan';
export * from './diagonal';
