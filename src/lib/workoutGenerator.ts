import { rando } from './rando';
import exercises from './exercises';
import type { Exercise, Workout, WorkoutExercise, WorkoutGeneratorOptions } from 'src/global';
import BodyParts from './bodyParts';

export const WorkoutStatus = {
	NotStarted: 'NOT_STARTED',
	InProgress: 'IN_PROGRESS',
	Paused: 'PAUSED',
	Complete: 'COMPLETE',
};

function getRandomExercise(): Exercise {
	const keys = Object.keys(exercises);
	const randomNum = rando(keys.length - 1);
	return {
		name: keys[randomNum],
		details: exercises[keys[randomNum]],
	};
}

interface ValidateExerciseParams {
	circuit: WorkoutExercise[];
	equipment: string[];
	exercise: Exercise;
	settings: WorkoutGeneratorOptions;
}
function invalidExercise(params: ValidateExerciseParams) {
	const alreadyisInCircuit = circuitIncludesExercise(params.circuit, params.exercise);
	const hasNecessaryEquipment = checkEquipment(params.equipment, params.exercise);
	const tooManyBackExercises = checkForTooManyBackExercises(params.circuit, params.exercise, params.settings);
	console.log(`validating ${params.exercise.name}: in circuit? ${alreadyisInCircuit}, has equipment? ${hasNecessaryEquipment}`);
	return alreadyisInCircuit || !hasNecessaryEquipment || tooManyBackExercises;
}

function circuitIncludesExercise(circuit: WorkoutExercise[], exercise: Exercise): boolean {
	return (
		circuit.findIndex((e) => {
			return e.exercise.name === exercise.name;
		}) > -1
	);
}

function checkEquipment(equipment: string[], exercise: Exercise): boolean {
	console.log(`checking equipment against ${equipment}`);
	if (equipment.includes('All')) {
		console.log('equipment includes All so we good');
		return true;
	} else if (equipment.includes('None') || equipment.length === 0) {
		console.log('equipment includes none or has no length');
		return exercise.details.equipment ? false : true;
	} else {
		console.log(JSON.stringify(exercise.details.equipment));
		console.log(JSON.stringify(equipment));
		return exercise.details.equipment ? exercise.details.equipment.every((e) => equipment.includes(e)) : true;
	}
}

function checkForTooManyBackExercises(circuit: WorkoutExercise[], exercise: Exercise, settings: WorkoutGeneratorOptions): boolean {
	let count = 0;
	circuit.forEach((e) => {
		if (e.exercise.details.bodyParts.includes(BodyParts.Back)) count++;
	});

	if (settings.numberOfExercisesInCircuit <= 4) {
		return count > 2;
	} else if (settings.numberOfExercisesInCircuit <= 6) {
		return count > 3;
	} else {
		return count / settings.numberOfExercisesInCircuit > 0.6;
	}
}

export default async function (settings: WorkoutGeneratorOptions): Promise<Workout> {
	const restTime = settings.restLength * (settings.numberOfCircuits - 1),
		workTime = settings.numberOfCircuits * settings.numberOfExercisesInCircuit * settings.exerciseLength;
	const workout: Workout = {
		status: WorkoutStatus.NotStarted,
		time: workTime + restTime,
		exercises: [],
	};

	for (let currentCircuitNumber = 1; currentCircuitNumber <= settings.numberOfCircuits; currentCircuitNumber++) {
		const circuitExercises: WorkoutExercise[] = [];
		while (circuitExercises.length < settings.numberOfExercisesInCircuit) {
			let exer = getRandomExercise();
			while (invalidExercise({ circuit: circuitExercises, exercise: exer, equipment: settings.equipment, settings })) {
				exer = getRandomExercise();
			}
			circuitExercises.push({
				time: settings.exerciseLength,
				exercise: exer,
			});
		}

		if (currentCircuitNumber === settings.numberOfCircuits) {
			let exer = getRandomExercise();
			while (invalidExercise({ circuit: circuitExercises, exercise: exer, equipment: settings.equipment, settings })) {
				exer = getRandomExercise();
			}
			circuitExercises.push({
				time: settings.exerciseLength,
				exercise: exer,
			});
		} else {
			circuitExercises.push({
				time: settings.restLength,
				exercise: { name: 'Rest' },
			});
		}
		workout.exercises.push(circuitExercises);
	}

	return workout;
}
