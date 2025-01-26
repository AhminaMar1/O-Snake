type OneDirection = 0 | -1 | 1;

export type XYDirections = [OneDirection, OneDirection];

export type DirectionKeys = 'up' | 'down' | 'left' | 'right';

export type DirecitonByKey = {
	[key in DirectionKeys]: XYDirections;
};
