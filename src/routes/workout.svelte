<script lang="ts">
	import { browser } from '$app/env';
	import type { Workout, WorkoutExercise } from 'src/global';
	import soundMaker from '$lib/soundMaker';
	import { WorkoutStatus } from '$lib/workoutGenerator';
	import { goto } from '$app/navigation';
	import exercises from '$lib/exercises';

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
		currentExerciseIndex = 0,
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
		if (!hasWakeLock) {
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
	}

	$: getWakeLock();

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
		if (currentIndex + 1 < workout.exercises.length) {
			upcomingExercises.push({
				clazzes: `tracking-wider text-blue-700`,
				name: workout.exercises[currentIndex + 1].exercise.name,
			});
		}
		upcomingExercises = upcomingExercises;
	}

	async function startWorkout() {
		workout.status = WorkoutStatus.InProgress;
		speakExercise('Get ready');

		upcomingExercises.push({
			clazzes: `tracking-wider text-blue-700`,
			name: workout.exercises[0].exercise.name,
		});
		upcomingExercises = upcomingExercises;

		await runExercises({ time: 10, exercise: { name: 'Get Ready...', details: { aerobic: false, bodyParts: [] } } });
		for (let i = 0; i < workout.exercises.length; i++) {
			currentExerciseIndex = i;
			buildupcomingExercises(currentExerciseIndex);
			console.log(`running exercise ${i}: ${workout.exercises[i].exercise.name}`);
			await runExercises(workout.exercises[i]);
		}

		workout.status = WorkoutStatus.Complete;
		workout = workout;
	}

	function pauseWorkout() {
		workout.status = WorkoutStatus.Paused;
		workout = workout;
	}

	function resumeWorkout() {
		workout.status = WorkoutStatus.InProgress;
		workout = workout;
	}

	function completeWorkout() {
		localStorage.removeItem('workout');
		goto('/');
	}

	getWakeLock();
	startWorkout();
</script>

{#if workout}
	{#if workout.status === WorkoutStatus.InProgress}
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
			<div class="text-3xl text-gray-500 text-opacity-50">Up Next</div>
			<div class="text-3xl text-blue-700">
				{upcomingExercises[0].name}
			</div>
		</div>
		<div class="w-full px-2 py-1 flex justify-between">
			{#each workout.exercises as exer, index}
				<div class="flex-1 flex justify-center items-center" style="padding:1px;">
					<div
						class="flex-1 w-full"
						style="height:20px;"
						class:bg-green-400={currentExerciseIndex > index}
						class:bg-gray-400={currentExerciseIndex <= index}
					/>
				</div>
			{/each}
		</div>
	{/if}
	{#if workout.status === WorkoutStatus.Paused}
		<div class="flex-1 flex flex-col items-center justify-center">
			<div class="text-3xl text-center">Workout Paused</div>
			<button class="mt-5 p-3 text-xl text-center border border-blue-700 hover:bg-blue-300 active:bg-blue-500" on:click={resumeWorkout}
				>Click to Resume</button
			>
		</div>
	{/if}
	{#if workout.status === WorkoutStatus.Complete}
		<div class="text-5xl">YOU DID IT!</div>
		<button class="border border-blue-700 p-3 text-blue-900 bg-blue-300 hover:bg-blue-500 active:bg-blue-600" on:click={completeWorkout}
			>Go back home</button
		>
	{/if}
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
