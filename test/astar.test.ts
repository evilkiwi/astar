import { expect, test } from 'vitest';
import type { Grid } from '../src';
import { search } from '../src';

const grid: Grid = [
  [ 0,  5, -1,  0,  0, -1,  0,  0],
  [ 0,  4, -1,  0,  0, -1,  0,  0],
  [ 0,  3, -1,  0,  0, -1,  0,  0],
  [ 0,  2, -1,  0,  0,  0,  0,  0],
  [ 0,  1, -1,  0,  0, -1,  0,  0],
  [ 0,  0, -1,  0,  0, -1,  0,  0],
  [ 0,  0,  0,  0,  0, -1,  0,  0],
  [ 0,  0, -1,  0,  0, -1,  0,  0],
];

test.concurrent('should enforce array grid input', () => {
  expect(() => {
    return search({
      from: [0, 0],
      to: [0, 7],
      // @ts-expect-error
      grid: null,
    });
  }).toThrowError();
});

test.concurrent('should enforce 2 dimensional array grid input', () => {
  expect(() => {
    return search({
      from: [0, 0],
      to: [0, 7],
      grid: [],
    });
  }).toThrowError();
});

test.concurrent('should pathfind vertically', () => {
  const path = search({
    from: [0, 0],
    to: [0, 7],
    grid,
  });

  expect(path).toStrictEqual([
    [0, 0], [0, 1], [0, 2], [0, 3],
    [0, 4], [0, 5], [0, 6], [0, 7],
  ]);
});

test.concurrent('should pathfind horizontally', () => {
  const path = search({
    from: [0, 6],
    to: [4, 6],
    grid,
  });

  expect(path).toStrictEqual([
    [0, 6], [1, 6], [2, 6], [3, 6], [4, 6],
  ]);
});

test.concurrent('should pathfind diagonally', () => {
  const path = search({
    cutCorners: false,
    diagonal: true,
    from: [0, 7],
    to: [2, 6],
    grid,
  });

  expect(path).toStrictEqual([
    [0, 7], [1, 6], [2, 6],
  ]);
});

test.concurrent('should pathfind diagonally in base directions', () => {
  const path = search({
    cutCorners: false,
    diagonal: false,
    from: [0, 7],
    to: [2, 6],
    grid,
  });

  expect(path).toStrictEqual([
    [0, 7], [1, 7], [1, 6], [2, 6],
  ]);
});

test.concurrent('should pathfind diagonally without cutting corner', () => {
  const path = search({
    cutCorners: false,
    diagonal: true,
    from: [1, 7],
    to: [2, 6],
    grid,
  });

  expect(path).toStrictEqual([
    [1, 7], [1, 6], [2, 6],
  ]);
});

test.concurrent('should pathfind diagonally with cutting corner', () => {
  const path = search({
    cutCorners: true,
    diagonal: true,
    from: [1, 7],
    to: [2, 6],
    grid,
  });

  expect(path).toStrictEqual([
    [1, 7], [2, 6],
  ]);
});

test.concurrent('should consider elevation when pathfinding', () => {
  const path = search({
    cutCorners: false,
    diagonal: true,
    from: [0, 0],
    to: [1, 0],
    grid,
  });

  expect(path).toStrictEqual([
    [0, 0], [0, 1], [0, 2], [0, 3], [0, 4],
    [1, 4], [1, 3], [1, 2], [1, 1], [1, 0],
  ]);
});

test.concurrent('should allow differing step heights in elevation', () => {
  const path = search({
    cutCorners: false,
    diagonal: true,
    stepHeight: 2,
    from: [0, 0],
    to: [1, 0],
    grid,
  });

  expect(path).toStrictEqual([
    [0, 0], [0, 1], [0, 2], [0, 3],
    [1, 3], [1, 2], [1, 1], [1, 0],
  ]);
});

test.concurrent('should not cut corners over elevated tiles', () => {
  const path = search({
    cutCorners: false,
    diagonal: true,
    from: [1, 0],
    to: [0, 3],
    grid,
  });

  expect(path).toStrictEqual([
    [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [0, 4], [0, 3],
  ]);
});

test.concurrent('should produce similar results with manhattan heuristic', () => {
  const path = search({
    heuristic: 'manhattan',
    cutCorners: false,
    diagonal: true,
    stepHeight: 2,
    from: [0, 0],
    to: [1, 0],
    grid,
  });

  expect(path).toStrictEqual([
    [0, 0], [0, 1], [0, 2], [0, 3],
    [1, 3], [1, 2], [1, 1], [1, 0],
  ]);
});
