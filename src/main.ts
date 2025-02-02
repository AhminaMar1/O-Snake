import './main.scss';
import { FORMAT_KEY_CODE } from './constant';
import { playOn } from './O-n';
// import { playO1 } from './O-1';

const applyKeyOn = playOn();

window.addEventListener('keydown', (e) => {
	const { code } = e;
	const validCode = code in FORMAT_KEY_CODE ? FORMAT_KEY_CODE[code] : null;

	if (validCode) {
		applyKeyOn(validCode);
	}
});
