import { expect, test } from 'vitest';
import { asc } from '../src';

test.concurrent('should rearrange in ascending order', () => {
    const arr: number[] = [5, 2, 3, 0, 1, 4];

    expect(arr.sort((a, b) => asc(a, b))).toEqual([0, 1, 2, 3, 4, 5]);
});
