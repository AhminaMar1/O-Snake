import SnakeOn from './datastructure';
import animation from './animation';
import { DirectionKeys } from '../types';

const playOn = () => {
	const newGame = new SnakeOn(animation);

	newGame.startGame();

	return (validCode: DirectionKeys) => newGame.applyKey(validCode);
};

export default playOn;
