<div align="center">
    <a href="https://www.npmjs.com/package/@evilkiwi/astar" target="_blank">
        <img src="https://img.shields.io/npm/v/@evilkiwi/astar?style=flat-square" alt="NPM" />
    </a>
    <a href="https://discord.gg/3S6AKZ2GR9" target="_blank">
        <img src="https://img.shields.io/discord/1000565079789535324?color=7289DA&label=discord&logo=discord&logoColor=FFFFFF&style=flat-square" alt="Discord" />
    </a>
    <img src="https://img.shields.io/npm/l/@evilkiwi/astar?style=flat-square" alt="Apache-2.0" />
    <h3>Synchronous A* pathfinding for TypeScript</h3>
</div>

`@evilkiwi/astar` is an A* pathfinding implementation in TypeScript. That's pretty much it - it's not awfully performant, but it works.

## Installation

This package is available via NPM:

```bash
yarn add @evilkiwi/astar

# or

npm install @evilkiwi/astar
```

## Usage

```typescript
import type { Grid } from '@evilkiwi/astar';
import { search } from '@evilkiwi/astar';

/**
 * The first step is to have a Grid.
 *
 * -1 = un-walkable, like a wall or water.
 *  0 = walkable
 */
const grid: Grid = [
    [ 0,  0, -1,  0,  0, -1,  0,  0],
    [ 0,  0, -1,  0,  0, -1,  0,  0],
    [ 0,  0, -1,  0,  0, -1,  0,  0],
    [ 0,  0, -1,  0,  0,  0,  0,  0],
    [ 0,  0, -1,  0,  0, -1,  0,  0],
    [ 0,  0, -1,  0,  0, -1,  0,  0],
    [ 0,  0,  0,  0,  0, -1,  0,  0],
    [ 0,  0, -1,  0,  0, -1,  0,  0],
];

/**
 * Once you have a Grid, you can find an efficient tile-based path
 * from one vector to another.
 */
const path = search({
    grid,
    from: [0, 0],
    to: [7, 6],
    diagonal: true,
    cutCorners: false,
});

// Path is either an array of vectors or null (could not find a path)
console.log(path);
```

The library is immutable/side-effect free, and the grid reference won't be changed when search.

## To-do

- Add elevation support
