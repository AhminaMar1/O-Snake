import { v4 as uuidv4 } from 'uuid';
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

type QueueSnake = {
	[key: string]: {
		position: number[];
		next: string;
	};
};

// head <- nodeA <- nodeB <- nodeC <- tail

class SnakeO1 {
	private queue: QueueSnake; // array as a base datastructure for the snake parts
	private head: string;
	private tail: string;
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
		this.head = this.randomKey();
		this.tail = this.randomKey();
		this.queue = {};
		this.foodPos = [W, H];
		this.hashSet = new Set(INIT_SNAKE.map((pos) => this.hashFn(pos)));
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

	private randomKey() {
		return uuidv4();
	}

	private randomFood() {
		const xF = Math.floor(Math.random() * (W / ONE_UNIT)) * ONE_UNIT;
		const yF = Math.floor(Math.random() * (H / ONE_UNIT)) * ONE_UNIT;

		[this.foodPos[0], this.foodPos[1]] = [xF, yF];
		this.animationCallback([W, H], this.foodPos);
	}

	private initQueue() {
		const array = [...INIT_SNAKE.map((el) => [...el])];
		this.addArrayToHashSet(array);
		let curr = this.randomKey(),
			next = this.randomKey(),
			prev = '';
		this.queue = {};
		this.tail = curr;
		array.forEach((position) => {
			prev = next;
			next = this.randomKey();
			this.queue[curr] = {
				next,
				position,
			};
			curr = next;
		});
		this.head = prev;
		this.queue[this.head].next = '';
	}

	private initSnakeDRAW() {
		let curr = this.tail;
		while (curr) {
			const node = this.queue[curr];
			const pos = node?.position || [0, 0];
			this.animationCallback([W, H], pos);
			curr = node.next;
		}
	}

	private move() {
		const headNode = this.queue[this.head];
		const headPos = headNode.position;
		const xTrans = this.direction[0] * this.oneUnit;
		const yTrans = this.direction[1] * this.oneUnit;
		const keyForName = '' + this.direction[0] + '' + this.direction[1];
		this.dirName = DIRXY_TO_NAME[keyForName];
		const nextPos = [headPos[0] + xTrans, headPos[1] + yTrans];

		const checkEatFood = this.checkEatFood(nextPos[0], nextPos[1]);

		if (checkEatFood) {
			// the tail will still tail
			// the new head will be a new node
			const newNodeKey = this.randomKey();
			this.queue[newNodeKey] = { position: nextPos, next: '' };
			headNode.next = newNodeKey;
			this.head = newNodeKey;
			this.checkLose();
			return;
		}

		//move logic: O(1) time complixitiy
		// tail => the new head
		const tailNode = this.queue[this.tail];
		const prevTailPos = [...tailNode.position];
		headNode.next = this.tail;
		this.head = this.tail;
		this.tail = tailNode.next;
		const theNewHead = tailNode;
		theNewHead.position[0] = nextPos[0];
		theNewHead.position[1] = nextPos[1];
		theNewHead.next = '';
		this.animationCallback(prevTailPos, nextPos);
		this.deleteFromHashSet(prevTailPos);
		this.checkLose();
	}

	private checkEatFood(x: number, y: number) {
		console.log(this.hashSetHas(this.foodPos));
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
		const headNode = this.queue[this.head];
		const headPos = headNode.position;
		const [x, y] = headPos;
		const AlreadyExist = this.hashSetHas(headPos);
		if (AlreadyExist || x > W || x < 0 || y > H || y < 0) {
			console.log('LOOSING');
			this.gameOver();
		} else {
			this.addToHashSet(headPos);
		}
	}

	gameOver() {
		this.stopGame();
		this.animationCallback(this.foodPos, [W, H]);
		let curr = this.tail;
		while (curr) {
			const el = this.queue[curr];
			const elPos = el.position;
			this.animationCallback(elPos, [W, H]); // remove the old board
			curr = this.queue[curr].next;
		}

		this.clearHashSet();
		this.direction = { ...DIRECTION_BY_KEY_OBJ[DEFAULT_DIR] };
		this.dirName = DEFAULT_DIR;
		this.startGame();
	}

	stopGame() {
		if (this.intervalId) clearInterval(this.intervalId);
	}

	startGame() {
		this.randomFood();
		this.initQueue();
		this.initSnakeDRAW();
		this.intervalId = setInterval(() => {
			this.move();
		}, 70);
	}
}

export default SnakeO1;
