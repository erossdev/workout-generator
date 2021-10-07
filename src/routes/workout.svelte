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

	let hasWakeLock = false;
	let workout: FlattenedWorkout = null;
	let generatedWorkout: Workout = null;
	let currentTick = 10,
		currentExerciseName,
		upcomingExercises: { clazzes: string; name: string }[] = [];

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
								speakExercise(`up next is ${upcomingExercises[0].name}`);
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

	function speakExercise(textToSay: string) {
		const utterance = new SpeechSynthesisUtterance(textToSay);
		window.speechSynthesis.speak(utterance);
	}

	function buildupcomingExercises(currentIndex: number) {
		upcomingExercises.shift(); // pop the next exercise
		upcomingExercises.push({
			clazzes: `tracking-wider text-opacity-${80 - upcomingExercises.length * 10} text-blue-700`,
			name: workout.exercises[currentIndex + 5].exercise.name,
		});
		upcomingExercises = upcomingExercises;
	}

	async function startWorkout() {
		workout.status = WorkoutStatus.InProgress;
		speakExercise('Get ready');

		// initially populate upcoming exercises
		while (upcomingExercises.length < 5) {
			upcomingExercises.push({
				clazzes: `tracking-wider text-opacity-${80 - upcomingExercises.length * 10} text-blue-700`,
				name: workout.exercises[upcomingExercises.length].exercise.name,
			});
		}
		upcomingExercises = upcomingExercises;

		await runExercises({ time: 10, exercise: { name: 'Get Ready...', details: { aerobic: false, bodyParts: [] } } });
		for (let i = 0; i < workout.exercises.length; i++) {
			buildupcomingExercises(i);
			await runExercises(workout.exercises[i]);
		}
	}

	function pauseWorkout() {
		workout.status = WorkoutStatus.Paused;
		workout = workout;
	}

	function resumeWorkout() {
		workout.status = WorkoutStatus.InProgress;
		workout = workout;
	}

	getWakeLock();
	startWorkout();
</script>

{#if workout && workout.status === WorkoutStatus.InProgress}
	<div class="flex items-end justify-end">
		<button class="p-3" on:click={pauseWorkout}>Pause</button>
	</div>
	<div class="flex-1 flex flex-col">
		<div class="flex-1 flex flex-col items-center justify-center">
			<div class="text-9xl text-center">{currentTick}</div>
			<div class="text-4xl text-blue-700 text-center">{currentExerciseName}</div>
		</div>
	</div>
	<div class="flex flex-col justify-center items-center">
		{#each upcomingExercises as trailingExercise, index}
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
{#if workout && workout.status === WorkoutStatus.Paused}
	<div class="flex-1 flex flex-col items-center justify-center">
		<div class="text-3xl text-center">Workout Paused</div>
		<button class="mt-5 p-3 text-xl text-center border border-blue-700 hover:bg-blue-300 active:bg-blue-500" on:click={resumeWorkout}
			>Click to Resume</button
		>
	</div>
{/if}

<style>
	.text-opacity-80 {
		--tw-text-opacity: 0.8;
	}

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
</style>
