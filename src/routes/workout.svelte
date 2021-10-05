<script lang="ts">
	import { browser } from '$app/env';
	import type { Workout, WorkoutExercise } from 'src/global';
	import soundMaker from '$lib/soundMaker';
	import { WorkoutStatus } from '$lib/workoutGenerator';

	interface FlattenedWorkout {
		status: string;
		time: number;
		exercises: WorkoutExercise[];
	}

	let contextDiv;
	let hasWakeLock = false;
	let workout: FlattenedWorkout = null;
	let generatedWorkout: Workout = null;
	let currentTick = 10,
		currentExerciseName,
		trailingExercises: { clazzes: string; name: string }[] = [];

	if (browser) {
		const savedWorkout = localStorage.getItem('workout');
		if (savedWorkout) {
			generatedWorkout = JSON.parse(savedWorkout);
			workout = {
				status: generatedWorkout.status,
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

	function runExercises(circuitExercise: WorkoutExercise): Promise<void> {
		let timeLength = circuitExercise.time,
			interv;
		currentTick = timeLength;
		currentExerciseName = circuitExercise.exercise.name;
		return new Promise((resolve, reject) => {
			interv = setInterval(() => {
				if (workout.status !== WorkoutStatus.Paused) {
					timeLength--;
					currentTick = timeLength;

					if (timeLength <= 5) {
						if (timeLength === 0) {
							soundMaker.highBeep();
						} else {
							if (timeLength === 5) {
								speakExercise(`up next ${trailingExercises[0].name}`);
							}
							soundMaker.beep();
						}
					}

					if (timeLength === 0) {
						clearInterval(interv);
						resolve();
					}
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

	function speakExercise(textToSay: string) {
		const utterance = new SpeechSynthesisUtterance(textToSay);
		window.speechSynthesis.speak(utterance);
	}

	function buildTrailingExercises(currentIndex) {
		trailingExercises.shift();
		if (trailingExercises.length < 5) {
			let i = currentIndex;
			while (i < workout.exercises.length) {
				trailingExercises.push({
					clazzes: `tracking-wider text-opacity-${70 - trailingExercises.length * 10} text-blue-700`,
					name: workout.exercises[i].exercise.name,
				});
				i++;
				if (trailingExercises.length === 5) {
					break;
				}
			}
		}
		trailingExercises = trailingExercises;
	}

	async function startWorkout() {
		workout.status = WorkoutStatus.InProgress;
		buildTrailingExercises(0);
		speakExercise('Get ready');
		await runExercises({ time: 10, exercise: { name: 'Get Ready...', details: { aerobic: false, bodyParts: [] } } });
		for (let i = 0; i < workout.exercises.length; i++) {
			buildTrailingExercises(i);
			await runExercises(workout.exercises[i]);
		}
	}

	function pauseOrResumeWorkout() {
		if (workout.status === WorkoutStatus.Paused || WorkoutStatus.InProgress) {
			switch (workout.status) {
				case WorkoutStatus.Paused:
					generatedWorkout.status = WorkoutStatus.InProgress;
				case WorkoutStatus.InProgress:
					generatedWorkout.status = WorkoutStatus.Paused;
			}
		}
	}

	getWakeLock();
	startWorkout();

	setTimeout(() => {
		console.log(contextDiv);
		if (browser) {
			document.getElementById('contextDiv').click();
		}
	}, 1000);
</script>

<div id="contextDiv"><!-- Empty div to make sure we have audio context --></div>
{#if workout && workout.status === WorkoutStatus.InProgress}
	<div class="flex-1 flex flex-col">
		<div class="flex-1 flex flex-col items-center justify-center">
			<div class="text-9xl text-center">{currentTick}</div>
			<div class="text-4xl text-blue-700 text-center">{currentExerciseName}</div>
		</div>
	</div>
	<div class="flex flex-col justify-center items-center">
		{#each trailingExercises as trailingExercise, index}
			<div
				class:text-3xl={index === 0}
				class:text-xl={index === 1}
				class:text-lg={index === 2}
				class:text-md={index === 3}
				class:text-sm={index === 4}
				class={trailingExercise.clazzes}
			>
				{trailingExercise.name}
			</div>
		{/each}
	</div>
{/if}

<style>
	.text-opacity-70 {
		--tw-text-opacity: 0.7;
	}

	.text-opacity-60 {
		--tw-text-opacity: 0.6;
	}

	.text-opacity-50 {
		--tw-text-opacity: 0.5;
	}

	.text-opacity-40 {
		--tw-text-opacity: 0.4;
	}

	.text-opacity-30 {
		--tw-text-opacity: 0.3;
	}
</style>
