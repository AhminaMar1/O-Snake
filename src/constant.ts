import { DirecitonByKey } from './types';

export const W = 640;
export const H = 440;

export const ONE_UNIT = 10;

export const INIT_SNAKE = [
	[100, 100],
	[100 + ONE_UNIT, 100],
	[100 + 2 * ONE_UNIT, 100],
	[100 + 3 * ONE_UNIT, 100],
];

const UP = 'up',
	DOWN = 'down',
	LEFT = 'left',
	RIGHT = 'right';

export const DEFAULT_DIR = RIGHT;

export const DIRECTION_BY_KEY_OBJ: DirecitonByKey = {
	[UP]: [0, -1],
	[DOWN]: [0, 1],
	[LEFT]: [-1, 0],
	[RIGHT]: [1, 0],
};

export const INVALID_DIRS_WHEN_DIR = {
	[UP]: DOWN,
	[DOWN]: UP,
	[LEFT]: RIGHT,
	[RIGHT]: LEFT,
};
