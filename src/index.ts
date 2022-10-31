import * as heuristics from '@/heuristics';
import type { Neighbor, OpenTile, Score, ScoreOptions, SearchOptions, Vector } from './types';

export const search = (options: SearchOptions) => {
    const heuristic = options.heuristic ?? 'diagonal';
    const cutCorners = options.cutCorners ?? true;
    const stepHeight = options.stepHeight ?? 1;
    const diagonal = options.diagonal ?? false;

    // Store the found path and open/closed lists.
    const closed: string[] = [vectorId(options.from)];
    const end = vectorId(options.to);
    let path: Vector[]|null = null;
    let open: OpenTile[] = [];

    // Calculate grid limits.
    if (!Array.isArray(options.grid)) {
        throw new Error('non-array grid provided');
    } else if (!options.grid.length || !Array.isArray(options.grid[0])) {
        throw new Error('2 dimensional grid array required');
    }

    const maxX = options.grid[0].length;
    const maxY = options.grid.length;

    // Helper function to determine legality of a Vector.
    const canUse = (cell: Neighbor, origin: Vector) => {
        return (
            // Make sure this tile is walkable.
            !isWalkable(cell[0], origin) &&
            // Don't use closed cells.
            closed.indexOf(vectorId(cell[0])) === -1 &&
            // Check for cutting corners, if enabled.
            (
                cell[1] === null || cutCorners ||
                (!isWalkable(cell[1][0], origin) && !isWalkable(cell[1][1], origin))
            )
        );
    };

    // Helper function to determine if the given Vector is walkable.
    const isWalkable = (cell: Vector, origin: Vector) => {
        return (
            // Make sure it is within the grid.
            cell[0] < 0 || cell[1] < 0 ||
            cell[0] >= maxX || cell[1] >= maxY ||
            // Make sure it isn't un-walkable.
            options.grid[cell[1]][cell[0]] === -1 ||
            // Make sure the elevation difference is allowed.
            options.grid[cell[1]][cell[0]] - options.grid[origin[1]][origin[0]] > stepHeight ||
            options.grid[cell[1]][cell[0]] - options.grid[origin[1]][origin[0]] < -stepHeight
        );
    };

    // Calculates the neighbors and their scores.
    const traverse = (from: OpenTile) => {
        const { tiles, total } = neighbors(from[0], diagonal);

        for (let i = 0; i < total; i++) {
            const neighbor = tiles[i];
            const name = vectorId(neighbor[0]);

            // If the tile is usable, push it to the list.
            if (canUse(neighbor, from[0])) {
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
    const path: Vector[] = [];
    let current: OpenTile|null = result;

    while (current !== null) {
        path.push(current[0]);
        current = current[2];
    }

    path.reverse();

    return path;
};

const neighbors = (vector: Vector, diagonals = false) => {
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

const vectorId = (vector: Vector) => `${vector[0]},${vector[1]}`;

export const asc = (a: number, b: number) => {
    if (a > b) {
        return 1;
    } else if (a < b) {
        return -1;
    }

    return 0;
};

export * from './types';
