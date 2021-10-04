import { rando } from './rando';
import exercises from './exercises';

function getRandomExercise() {
	const keys = Object.keys(exercises);
	const randomNum = rando(keys.length - 1);
	return {
		name: keys[randomNum],
		details: exercises[keys[randomNum]],
	};
}

function circuitIncludesExercise(circuit, exercise) {
	return (
		circuit.findIndex((e) => {
			return e.exercise.name === exercise.name;
		}) > -1
	);
}

export default async function (): Promise<Workout> {
	const workout = {
		time: 1800, // 30 minutes in seconds
		exercises: [],
	};

	for (let currentCircuitNumber = 1; currentCircuitNumber < 7; currentCircuitNumber++) {
		const circuitExercises = [];
		while (circuitExercises.length < 4) {
			let exer = getRandomExercise();
			while (circuitIncludesExercise(circuitExercises, exer)) {
				exer = getRandomExercise();
			}
			circuitExercises.push({
				time: 60,
				exercise: exer,
			});
		}

		if (currentCircuitNumber === 6) {
			let exer = getRandomExercise();
			while (circuitIncludesExercise(circuitExercises, exer)) {
				exer = getRandomExercise();
			}
			circuitExercises.push({
				time: 60,
				exercise: exer,
			});
		} else {
			circuitExercises.push({
				time: 60,
				exercise: { name: 'Rest' },
			});
		}
		workout.exercises.push(circuitExercises);
	}

	return workout;
}
