import { DirecitonByKey, DirectionKeys } from './types';

export const W = 640;
export const H = 440;

export const ONE_UNIT = 10;

const LEN = 10;
export const INIT_SNAKE = new Array(LEN)
	.fill(0)
	.map((_, key) => [100 + key * ONE_UNIT, 100]);

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

export const DIRXY_TO_NAME: { [key: string]: DirectionKeys } = {
	'0-1': UP,
	'01': DOWN,
	'-10': LEFT,
	'10': RIGHT,
};

export const INVALID_DIRS_WHEN_DIR = {
	[UP]: DOWN,
	[DOWN]: UP,
	[LEFT]: RIGHT,
	[RIGHT]: LEFT,
};

export const FORMAT_KEY_CODE: { [key: string]: DirectionKeys } = {
	ArrowUp: 'up',
	ArrowDown: 'down',
	ArrowLeft: 'left',
	ArrowRight: 'right',
};
