import * as heuristics from '@/heuristics';
import type { Neighbor, OpenTile, Score, ScoreOptions, SearchOptions, Vector2D } from './types';

export const search = (options: SearchOptions) => {
    const heuristic = options.heuristic ?? 'diagonal';
    const cutCorners = options.cutCorners ?? true;
    const diagonal = options.diagonal ?? false;

    // Store the found path and open/closed lists.
    let path: Vector2D[]|null = null;
    const end = vectorId(options.to);
    const closed: string[] = [vectorId(options.from)];
    let open: OpenTile[] = [];

    // Calculate grid limits.
    const maxX = options.grid[0].length;
    const maxY = options.grid.length;

    // Helper function to determine legality of a Vector.
    const canUse = (cell: Neighbor) => {
        return !isSolid(cell[0]) && closed.indexOf(vectorId(cell[0])) === -1 && (
            cell[1] === null || cutCorners || (!isSolid(cell[1][0]) && !isSolid(cell[1][1]))
        );
    };

    // Helper function to determine if the given Vector is walkable.
    const isSolid = (vector: Vector2D) => {
        // Make sure it is within the grid.
        return vector[0] < 0 || vector[1] < 0 ||
            vector[0] >= maxX || vector[1] >= maxY ||
            // Make sure it isn't un-walkable.
            options.grid[vector[1]][vector[0]] === -1;
    };

    // Calculates the neighbors and their scores.
    const traverse = (from: OpenTile) => {
        const { tiles, total } = neighbors(from[0], diagonal);

        for (let i = 0; i < total; i++) {
            const neighbor = tiles[i];
            const name = vectorId(neighbor[0]);

            // If the tile is usable, push it to the list.
            if (canUse(neighbor)) {
                const existing = open.find(item => vectorId(item[0]) === name);
                const currentScore = score({
                    current: neighbor[0],
                    parent: from,
                    goal: options.to,
                    heuristic,
                });

                // If it is already in the open list, but this path results in a better score.
                if (existing && currentScore.f < existing[1].f) {
                    const existingName = vectorId(existing[0]);

                    open = open.map(existingTile => {
                        if (vectorId(existingTile[0]) === existingName) {
                            existingTile[1] = currentScore;
                            existingTile[2] = from;
                        }

                        return existingTile;
                    });
                } else if (!existing) {
                    open.push([neighbor[0], currentScore, from]);
                }
            }
        }

        // Sort the new open list by F values.
        open = open.sort((a, b) => asc(a[1].f, b[1].f));
    };

    // And start traversing from the starting position.
    traverse([options.from, {
        g: 0,
        h: 0,
        f: 0,
    }, null]);

    // Traverse the open list until it is empty.
    while (open.length > 0) {
        const bestScore = open.shift();

        if (bestScore) {
            const [ vector ] = bestScore;
            const name = vectorId(vector);

            // Add this to the closed list.
            closed.push(name);

            // Check if we're at the end.
            if (name === end) {
                path = calculatePath(bestScore);
                open = [];
                continue;
            }

            // Otherwise traverse the neighbors.
            traverse(bestScore);
        }
    }

    return path;
};

const calculatePath = (result: OpenTile) => {
    const path: Vector2D[] = [];
    let current: OpenTile|null = result;

    while (current !== null) {
        path.push(current[0]);
        current = current[2];
    }

    path.reverse();

    return path;
};

const neighbors = (vector: Vector2D, diagonals = false) => {
    const tiles: Neighbor[] = [];

    tiles.push([[vector[0] - 1, vector[1]], null]);
    tiles.push([[vector[0] + 1, vector[1]], null]);
    tiles.push([[vector[0], vector[1] - 1], null]);
    tiles.push([[vector[0], vector[1] + 1], null]);

    if (diagonals) {
        tiles.push([
            [vector[0] - 1, vector[1] - 1],
            [
                [vector[0], vector[1] - 1],
                [vector[0] - 1, vector[1]],
            ],
        ]);
        tiles.push([
            [vector[0] + 1, vector[1] + 1],
            [
                [vector[0], vector[1] + 1],
                [vector[0] + 1, vector[1]],
            ],
        ]);
        tiles.push([
            [vector[0] + 1, vector[1] - 1],
            [
                [vector[0], vector[1] - 1],
                [vector[0] + 1, vector[1]],
            ],
        ]);
        tiles.push([
            [vector[0] - 1, vector[1] + 1],
            [
                [vector[0], vector[1] + 1],
                [vector[0] - 1, vector[1]],
            ],
        ]);
    }

    return { tiles, total: tiles.length };
};

const score = (options: ScoreOptions) => {
    let g = options.parent[1].g + 1;
    let h = heuristics[options.heuristic](options.current, options.goal);

    return { g, h, f: g + h } as Score;
};

const vectorId = (vector: Vector2D) => `${vector[0]},${vector[1]}`;

export const asc = (a: number, b: number) => {
    if (a > b) {
        return 1;
    } else if (a < b) {
        return -1;
    }

    return 0;
};

export * from './types';
