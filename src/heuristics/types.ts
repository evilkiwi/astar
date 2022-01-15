import type { Vector2D } from '@/types';

export type Heuristic = (from: Vector2D, to: Vector2D) => number;
