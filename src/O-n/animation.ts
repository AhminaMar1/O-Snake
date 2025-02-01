import { ONE_UNIT } from '../constant';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let snakeBoard: any;

const getSnakeBoard = () => {
	const canvasEl = <HTMLCanvasElement>document.getElementById('snakeBoardGame');
	const contex = (canvasEl && canvasEl.getContext('2d')) || null;
	if (contex) {
		contex.fillStyle = 'rgb(199 0 0)';
	}

	return contex;
};

const animation = (from: number[], to: number[]) => {
	snakeBoard = snakeBoard || getSnakeBoard();
	if (!snakeBoard) return console.error('the snake borad not founded, try again');
	snakeBoard.clearRect(from[0], from[1], ONE_UNIT, ONE_UNIT);
	snakeBoard.fillRect(to[0], to[1], ONE_UNIT, ONE_UNIT);
};

export default animation;
