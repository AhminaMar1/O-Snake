import SnakeOn from './datastructure';
import animation from './animation';
import { DirectionKeys } from '../types';

const formatCode: { [key: string]: DirectionKeys } = {
	ArrowUp: 'up',
	ArrowDown: 'down',
	ArrowLeft: 'left',
	ArrowRight: 'right',
};

const playOn = () => {
	const newGame = new SnakeOn(animation);

	newGame.startGame();

	window.addEventListener('keydown', (e) => {
		const { code } = e;
		const validCode = code in formatCode ? formatCode[code] : null;

		if (validCode) {
			newGame.applyKey(validCode);
		}
	});
};

export default playOn;
