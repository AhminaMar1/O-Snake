import {
	W,
	H,
	ONE_UNIT,
	INIT_SNAKE,
	DIRECTION_BY_KEY_OBJ,
	DEFAULT_DIR,
	INVALID_DIRS_WHEN_DIR,
	DIRXY_TO_NAME,
} from '../constant';
import { XYDirections, DirectionKeys, DirecitonByKey } from '../types';

class SnakeOn {
	private array: number[][]; // array as a base datastructure for the snake parts
	private hashSet;
	private direction: XYDirections;
	private intervalId: ReturnType<typeof setInterval> | undefined;
	private direcitonByKey: DirecitonByKey;
	private animationCallback: (from: number[], to: number[]) => void;
	private foodPos: number[];
	private dirName: DirectionKeys;
	readonly oneUnit = ONE_UNIT;

	constructor(animationCallback: (from: number[], to: number[]) => void) {
		this.direcitonByKey = { ...DIRECTION_BY_KEY_OBJ };
		this.array = [...INIT_SNAKE.map((el) => [...el])];
		this.foodPos = [W, H];
		this.hashSet = new Set(this.array.map((pos) => this.hashFn(pos)));
		this.direction = { ...DIRECTION_BY_KEY_OBJ[DEFAULT_DIR] }; // [x, y]
		this.dirName = DEFAULT_DIR;
		this.animationCallback = animationCallback;
	}

	private hashFn = (pos: number[]) => pos[0] + '-' + pos[1];
	private addToHashSet = (pos: number[]) => this.hashSet.add(this.hashFn(pos));
	private addArrayToHashSet = (arr: number[][]) =>
		arr.forEach((pos: number[]) => this.addToHashSet(pos));
	private hashSetHas = (pos: number[]) => this.hashSet.has(this.hashFn(pos));
	private deleteFromHashSet = (pos: number[]) => this.hashSet.delete(this.hashFn(pos));
	private clearHashSet = () => this.hashSet.clear();

	applyKey(directionKey: DirectionKeys) {
		const dir = this.direcitonByKey[directionKey];
		if (dir && this.dirName !== INVALID_DIRS_WHEN_DIR[directionKey]) {
			[this.direction[0], this.direction[1]] = [dir[0], dir[1]];
		}
	}

	private randomFood() {
		const xF = Math.floor(Math.random() * (W / ONE_UNIT)) * ONE_UNIT;
		const yF = Math.floor(Math.random() * (H / ONE_UNIT)) * ONE_UNIT;

		[this.foodPos[0], this.foodPos[1]] = [xF, yF];
		this.animationCallback([W, H], this.foodPos);
	}

	private move() {
		const len = this.array.length - 1;
		const head = this.array[len];
		const xTrans = this.direction[0] * this.oneUnit;
		const yTrans = this.direction[1] * this.oneUnit;
		const keyForName = '' + this.direction[0] + '' + this.direction[1];
		this.dirName = DIRXY_TO_NAME[keyForName];
		let nextPos = [head[0] + xTrans, head[1] + yTrans];
		let prevPointer;

		const checkEatFood = this.checkEatFood(nextPos[0], nextPos[1]);

		if (checkEatFood) {
			this.array.push(nextPos);
			this.checkLose();
			return;
		}

		for (let i = len; i >= 0; i--) {
			//O(n) time complixity depend on the length of the snake
			const currPointer = this.array[i];
			prevPointer = [...currPointer];

			currPointer[0] = nextPos[0];
			currPointer[1] = nextPos[1];
			this.animationCallback(prevPointer, currPointer);
			nextPos = prevPointer;
		}
		this.deleteFromHashSet(nextPos);
		this.checkLose();
	}

	private checkEatFood(x: number, y: number) {
		if (x === this.foodPos[0] && y === this.foodPos[1]) {
			this.randomFood();
			return true;
		} else if (this.hashSetHas(this.foodPos)) {
			setTimeout(() => {
				this.animationCallback([W, H], this.foodPos);
			}, 0);
		}
		return false;
	}

	private checkLose() {
		const len = this.array.length - 1;
		const head = this.array[len];
		const [x, y] = head;
		const AlreadyExist = this.hashSetHas(head);
		if (AlreadyExist || x > W || x < 0 || y > H || y < 0) {
			console.log('LOOSING');
			this.gameOver();
		} else {
			this.addToHashSet(head);
		}
	}

	gameOver() {
		this.stopGame();
		this.animationCallback(this.foodPos, [W, H]);
		this.array.forEach((el: number[]) => {
			this.animationCallback(el, [W, H]); // remove the old board
		});
		this.clearHashSet();
		this.direction = { ...DIRECTION_BY_KEY_OBJ[DEFAULT_DIR] };
		this.dirName = DEFAULT_DIR;
		this.array = [...INIT_SNAKE.map((el) => [...el])];
		this.addArrayToHashSet(this.array);
		this.startGame();
	}

	stopGame() {
		if (this.intervalId) clearInterval(this.intervalId);
	}

	startGame() {
		this.randomFood();
		this.intervalId = setInterval(() => {
			this.move();
		}, 80);
	}
}

export default SnakeOn;
