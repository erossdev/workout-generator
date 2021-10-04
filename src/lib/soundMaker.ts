import { browser } from '$app/env';

let beep, highBeep;

if (browser) {
	const AudioContext = window.AudioContext;
	const context = new AudioContext();

	beep = function () {
		const oscillator = context.createOscillator();
		const gain = context.createGain();
		oscillator.connect(gain);
		oscillator.frequency.value = 520;
		oscillator.type = 'square';
		gain.connect(context.destination);
		gain.gain.value = 100 * 0.01;
		oscillator.start(context.currentTime);
		oscillator.stop(context.currentTime + 200 * 0.001);
	};
	highBeep = function () {
		const oscillator = context.createOscillator();
		const gain = context.createGain();
		oscillator.connect(gain);
		oscillator.frequency.value = 800;
		oscillator.type = 'square';
		gain.connect(context.destination);
		gain.gain.value = 100 * 0.01;
		oscillator.start(context.currentTime);
		oscillator.stop(context.currentTime + 200 * 0.001);
	};
} else {
	beep = () => {};
	highBeep = () => {};
}

export { beep, highBeep };
