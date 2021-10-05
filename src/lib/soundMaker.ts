import { browser } from '$app/env';

let beep, highBeep, resume, speak;

if (browser) {
	// @ts-ignore
	const AudioContext = window.AudioContext || window.webkitAudioContext;
	const context = new AudioContext();
	const utterance = new SpeechSynthesisUtterance();

	beep = function () {
		context.resume();
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
		context.resume();
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
	speak = function (textToSay) {
		window.speechSynthesis.resume();
		utterance.text = textToSay;
		window.speechSynthesis.speak(utterance);
	};
} else {
	beep = () => {};
	highBeep = () => {};
	resume = () => {};
	speak = () => {};
}

export default { beep, highBeep, resume, speak };
