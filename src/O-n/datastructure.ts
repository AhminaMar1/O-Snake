import {
	W,
	H,
	ONE_UNIT,
	INIT_SNAKE,
	DIRECTION_BY_KEY_OBJ,
	DEFAULT_DIR,
	INVALID_DIRS_WHEN_DIR,
} from '../constant';
import { XYDirections, DirectionKeys, DirecitonByKey } from '../types';

class SnakeOn {
	private array: number[][]; // array as a base datastructure for the snake parts
	private direction: XYDirections;
	private intervalId: ReturnType<typeof setInterval> | undefined;
	private direcitonByKey: DirecitonByKey;
	private animationCallback: (from: number[], to: number[]) => void;
	private dirName: DirectionKeys;
	readonly oneUnit = ONE_UNIT;

	constructor(animationCallback: (from: number[], to: number[]) => void) {
		this.direcitonByKey = { ...DIRECTION_BY_KEY_OBJ };
		this.array = [...INIT_SNAKE.map((el) => [...el])];
		this.direction = { ...DIRECTION_BY_KEY_OBJ[DEFAULT_DIR] }; // [x, y]
		this.dirName = DEFAULT_DIR;
		this.animationCallback = animationCallback;
	}

	applyKey(directionKey: DirectionKeys) {
		const dir = this.direcitonByKey[directionKey];
		if (dir && this.dirName !== INVALID_DIRS_WHEN_DIR[directionKey]) {
			this.dirName = directionKey;
			[this.direction[0], this.direction[1]] = [dir[0], dir[1]];
		}
	}

	private move() {
		const len = this.array.length - 1;
		const head = this.array[len];
		const xTrans = this.direction[0] * this.oneUnit;
		const yTrans = this.direction[1] * this.oneUnit;
		let nextPos = [head[0] + xTrans, head[1] + yTrans];
		let prevPointer;

		for (let i = len; i >= 0; i--) {
			//O(n) time complixity depend on the length of the snake
			const currPointer = this.array[i];
			prevPointer = [...currPointer];

			currPointer[0] = nextPos[0];
			currPointer[1] = nextPos[1];
			this.animationCallback(prevPointer, currPointer);
			nextPos = prevPointer;
		}

		this.checkLose();
	}

	private checkLose() {
		const len = this.array.length - 1;
		const [x, y] = this.array[len];

		if (x > W || x < 0 || y > H || y < 0) {
			console.log('LOOSING');
			this.gameOver();
		}
	}

	gameOver() {
		this.stopGame();
		this.array.forEach((el) => {
			this.animationCallback(el, [W, H]); // remove the old board
		});
		this.array = [...INIT_SNAKE.map((el) => [...el])];
		this.startGame();
	}

	stopGame() {
		if (this.intervalId) clearInterval(this.intervalId);
	}

	startGame() {
		this.intervalId = setInterval(() => {
			this.move();
		}, 70);
	}
}

export default SnakeOn;
