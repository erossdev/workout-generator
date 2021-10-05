<script lang="ts">
	import { browser } from '$app/env';
	import type { Workout, WorkoutExercise } from 'src/global';
	import { beep, highBeep } from '$lib/soundMaker';

	const WorkoutStatus = {
		NotStarted: 'NOT_STARTED',
		InProgress: 'IN_PROGRESS',
		Paused: 'PAUSED',
	};

	let hasWakeLock = false;
	let workoutStatus = WorkoutStatus.NotStarted;
	let workout = null;
	let generatedWorkout: Workout = null;
	let currentTick, currentExerciseName, nextExerciseName;

	if (browser) {
		const savedWorkout = localStorage.getItem('workout');
		if (savedWorkout) {
			generatedWorkout = JSON.parse(savedWorkout);
			workout = {
				time: generatedWorkout.time,
				exercises: generatedWorkout.exercises.flat(),
			};
		} else {
			// go back because we aint gots a workout
		}
	}

	async function getWakeLock() {
		// create an async function to request a wake lock
		try {
			// @ts-ignore
			await navigator.wakeLock.request('screen');
			hasWakeLock = true;
		} catch (err) {
			// The Wake Lock request has failed - usually system related, such as battery.
			hasWakeLock = false;
		}
	}

	async function runExercises(circuitExercise: WorkoutExercise): Promise<void> {
		let timeLength = circuitExercise.time,
			interv;
		currentTick = timeLength;
		currentExerciseName = circuitExercise.exercise.name;
		return new Promise((resolve, reject) => {
			interv = setInterval(() => {
				timeLength--;
				currentTick = timeLength;

				if (timeLength <= 5) {
					if (timeLength === 0) {
						highBeep();
					} else {
						beep();
					}
				}

				if (timeLength === 0) {
					clearInterval(interv);
					resolve();
				}
			}, 1000);
		});
	}

	// async function runCircuit(circuit: [WorkoutExercise]): Promise<void> {
	// 	return new Promise(async (resolve, reject) => {
	// 		for (let i = 0; i < circuit.length; i++) {
	// 			await runExercises(circuit[i]);
	// 		}
	// 		resolve();
	// 	});
	// }

	async function startWorkout() {
		workoutStatus = WorkoutStatus.InProgress;
		nextExerciseName = workout.exercises[0].exercise.name;
		await runExercises({ time: 10, exercise: { name: 'Get Ready...', details: { aerobic: false, bodyParts: [] } } });
		for (let i = 1; i < workout.exercises.length; i++) {
			if (i < workout.exercises.length - 1) {
				nextExerciseName = workout.exercises[i + 1].exercise.name;
			}
			await runExercises(workout.exercises[i]);
		}
	}

	getWakeLock();
</script>

<div class="flex-1 flex flex-col">
	<div class="flex-1 flex flex-col items-center justify-center">
		<div class="text-4xl text-center">{currentExerciseName}</div>
		<div class="text-9xl text-center">{currentTick}</div>
	</div>
	<div class="text-center">Up Next: {nextExerciseName}</div>
</div>
