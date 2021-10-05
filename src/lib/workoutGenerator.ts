import { rando } from './rando';
import exercises from './exercises';
import type { Exercise, Workout, WorkoutExercise, WorkoutGeneratorOptions } from 'src/global';

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
}
function invalidExercise(params: ValidateExerciseParams) {
	const alreadyisInCircuit = circuitIncludesExercise(params.circuit, params.exercise);
	const hasNecessaryEquipment = checkEquipment(params.equipment, params.exercise);
	console.log(`validating ${params.exercise.name}: in circuit? ${alreadyisInCircuit}, has equipment? ${hasNecessaryEquipment}`);
	return alreadyisInCircuit || !hasNecessaryEquipment;
}

function circuitIncludesExercise(circuit, exercise): boolean {
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

export default async function ({
	equipment,
	numberOfCircuits,
	numberOfExercisesInCircuit,
	workoutLength,
	exerciseLength,
	restLength,
}: WorkoutGeneratorOptions): Promise<Workout> {
	const workout: Workout = {
		time: workoutLength * 60,
		exercises: [],
	};

	for (let currentCircuitNumber = 1; currentCircuitNumber <= numberOfCircuits; currentCircuitNumber++) {
		const circuitExercises: WorkoutExercise[] = [];
		while (circuitExercises.length < numberOfExercisesInCircuit) {
			let exer = getRandomExercise();
			while (invalidExercise({ circuit: circuitExercises, exercise: exer, equipment })) {
				exer = getRandomExercise();
			}
			circuitExercises.push({
				time: exerciseLength,
				exercise: exer,
			});
		}

		if (currentCircuitNumber === numberOfCircuits) {
			let exer = getRandomExercise();
			while (invalidExercise({ circuit: circuitExercises, exercise: exer, equipment })) {
				exer = getRandomExercise();
			}
			circuitExercises.push({
				time: exerciseLength,
				exercise: exer,
			});
		} else {
			circuitExercises.push({
				time: restLength,
				exercise: { name: 'Rest' },
			});
		}
		workout.exercises.push(circuitExercises);
	}

	return workout;
}
