<script lang="ts">
	import workoutGenerator from '$lib/workoutGenerator';
	import { beep, highBeep } from '$lib/soundMaker';

	let generating = false;
	let isGenerated = false;
	let generatedWorkout: Workout = null;
	let workout = null;
	let wakeLock = null;
	let hasWakeLock = false;
	let workoutInProgress = false;
	let workoutBackground = {};
	let currentTick, currentExerciseName, nextExerciseName;

	async function getWakeLock() {
		// create an async function to request a wake lock
		try {
			wakeLock = await navigator.wakeLock.request('screen');
			hasWakeLock = true;
		} catch (err) {
			// The Wake Lock request has failed - usually system related, such as battery.
			hasWakeLock = false;
		}
	}

	async function generateWorkout() {
		if (generating) {
			return;
		}
		console.log('generating...');
		generating = true;
		generatedWorkout = await workoutGenerator();
		// flatten the arrays so we always know what exercise is next without a bunch of checks
		workout = {
			time: generatedWorkout.time,
			exercises: generatedWorkout.exercises.flat(),
		};
		generating = false;
		isGenerated = true;

		getWakeLock();
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
		workoutInProgress = true;
		nextExerciseName = workout.exercises[0].exercise.name;
		await runExercises({ time: 10, exercise: { name: 'Get Ready...', details: { aerobic: false, bodyParts: [] } } });
		for (let i = 1; i < workout.exercises.length; i++) {
			if (i < workout.exercises.length - 1) {
				nextExerciseName = workout.exercises[i + 1].exercise.name;
			}
			await runExercises(workout.exercises[i]);
		}
	}
</script>

<svelte:head>
	<title>Workout</title>
</svelte:head>

<div
	class="flex w-full justify-center items-center tracking-wide text-center py-2"
	class:hidden={!isGenerated}
	class:bg-green-600={hasWakeLock}
	class:text-green-200={hasWakeLock}
	class:bg-red-600={!hasWakeLock}
	class:text-red-200={!hasWakeLock}
	on:click|preventDefault={getWakeLock}
>
	{#if hasWakeLock} Screen will stay on {:else} Screen won't stay on, click to refresh {/if}
</div>
<div class="flex-1 flex justify-center items-center" class:hidden={isGenerated}>
	<button
		id="make-me-workout-button"
		class="flex items-center justify-center text-center"
		on:click|preventDefault={generateWorkout}
		class:animate_flip={generating}
	>
		Make Me Workout
	</button>
</div>

{#if isGenerated && !workoutInProgress}
	<div class="flex flex-col items-center justify-center">
		<h2 class="text-3xl mb-5">Here's your workout</h2>
		<div class="flex flex-col items-center justify-center">
			{#each generatedWorkout.exercises as circuit, index}
				<div class="flex flex-col items-center justify-center">
					<div class="text-lg font-bold tracking-wide">Circuit {index + 1}</div>
					{#each circuit as circ}
						<div>{circ.exercise.name}</div>
					{/each}
				</div>
			{/each}
		</div>
		<button class="mt-5 border-blue-500 bg-gradient-to-br from-blue-300 to-blue-500 text-red-600 p-3" on:click={startWorkout}>Start Workout</button>
	</div>
{/if}

{#if workoutInProgress}
	<div class="flex-1 flex flex-col">
		<div class="flex-1 flex flex-col items-center justify-center">
			<div class="text-4xl text-center">{currentExerciseName}</div>
			<div class="text-9xl text-center">{currentTick}</div>
		</div>
		<div class="text-center">Up Next: {nextExerciseName}</div>
	</div>
{/if}

<style>
	@keyframes flip {
		from {
			transform: perspective(500px) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, -360deg);
			animation-timing-function: ease-out;
		}

		40% {
			transform: perspective(500px) scale3d(1, 1, 1) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -190deg);
			animation-timing-function: ease-out;
		}

		50% {
			transform: perspective(500px) scale3d(1, 1, 1) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -170deg);
			animation-timing-function: ease-in;
		}

		80% {
			transform: perspective(500px) scale3d(0.95, 0.95, 0.95) translate3d(0, 0, 0) rotate3d(0, 1, 0, 0deg);
			animation-timing-function: ease-in;
		}

		to {
			transform: perspective(500px) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, 0deg);
			animation-timing-function: ease-in;
		}
	}

	.animate_flip {
		backface-visibility: visible;
		animation-name: flip;
		animation-duration: 2s;
		animation-iteration-count: infinite;
	}

	#make-me-workout-button {
		width: 250px;
		height: 250px;
		@apply border rounded-full border-blue-500 bg-gradient-to-br from-blue-300 to-blue-500 text-red-600 text-3xl font-semibold tracking-widest;
	}
</style>
