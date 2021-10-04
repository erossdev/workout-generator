const AudioContext = window.AudioContext;
const context = new AudioContext();

export function beep() {
	const oscillator = context.createOscillator();
	const gain = context.createGain();
	oscillator.connect(gain);
	oscillator.frequency.value = 520;
	oscillator.type = 'square';
	gain.connect(context.destination);
	gain.gain.value = 100 * 0.01;
	oscillator.start(context.currentTime);
	oscillator.stop(context.currentTime + 200 * 0.001);
}

export function highBeep() {
	const oscillator = context.createOscillator();
	const gain = context.createGain();
	oscillator.connect(gain);
	oscillator.frequency.value = 800;
	oscillator.type = 'square';
	gain.connect(context.destination);
	gain.gain.value = 100 * 0.01;
	oscillator.start(context.currentTime);
	oscillator.stop(context.currentTime + 200 * 0.001);
}
