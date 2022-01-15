import type * as heuristics from '@/heuristics';

export type Grid = number[][];
export type Vector2D = [number, number];

export interface Score {
    g: number;
    h: number;
    f: number;
}

export type OpenTile = [Vector2D, Score, OpenTile|null];

export interface ScoreOptions {
    current: Vector2D;
    parent: OpenTile;
    goal: Vector2D;
    heuristic: keyof typeof heuristics;
}

export interface SearchOptions {
    from: Vector2D;
    to: Vector2D;
    grid: Grid;
    heuristic?: keyof typeof heuristics;
    diagonal?: boolean;
    cutCorners?: boolean;
}

/**
 * A Neighbor result consists of the neighbor cell itself (`0` index)
 * and, if a diagonal movement, the two cells around the origin cell
 * and the neighbor cell.
 *
 * Removes the need to calculate this later on if `cutCorners` is
 * disabled.
 */
export type Neighbor = [Vector2D, [Vector2D, Vector2D]|null];
