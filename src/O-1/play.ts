import SnakeO1 from './datastructure';
import animation from './animation';
import { DirectionKeys } from '../types';

const playO1 = () => {
	const newGame = new SnakeO1(animation);

	newGame.startGame();

	return (validCode: DirectionKeys) => newGame.applyKey(validCode);
};

export default playO1;
