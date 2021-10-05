<script lang="ts">
	import { browser } from '$app/env';
import { goto } from '$app/navigation';
	import equipment from '$lib/equipment';
	import workoutGenerator from '$lib/workoutGenerator';

	const defaultSettings = {
		equipment: ['All'],
		numberOfCircuits: 6,
		numberOfExercisesInCircuit: 4,
		workoutLength: 30,
		exerciseLength: 60,
		restLength: 60,
	};

	let settings = defaultSettings;
	let generating = false;

	if (browser) {
		const savedSettings = localStorage.getItem('settings');
		if (savedSettings) {
			settings = Object.assign({}, defaultSettings, JSON.parse(savedSettings));
		}
	}

	async function saveAndGenerateWorkout() {
		generating = true;
		if (browser) {
			localStorage.setItem('settings', JSON.stringify(settings));
		}

		const generatedWorkout = await workoutGenerator(settings);
		if (browser) {
			localStorage.setItem('workout', JSON.stringify(generatedWorkout));
		}

		goto('/view-workout');
	}
</script>

<div class="flex-1 flex flex-col p-5">
	<div class="grid grid-cols-2 py-2">
		<div>Equipment to Use</div>
		<div class="w-full">
			<select class="w-full h-full" multiple bind:value={settings.equipment}>
				<option value="None">None</option>
				<option value="All">All</option>
				{#each Object.entries(equipment) as e}
					<option value={e[1]}>
						{e[1]}
					</option>
				{/each}
			</select>
		</div>
	</div>
	<div class="grid grid-cols-2 py-2">
		<div>Number of Circuits</div>
		<div class="w-full">
			<select class="w-full" bind:value={settings.numberOfCircuits}>
				{#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as n}
					<option value={n}>
						{n} circuit{#if n !== 1}s{/if}
					</option>
				{/each}
			</select>
		</div>
	</div>
	<div class="grid grid-cols-2 py-2">
		<div>Workout Length</div>
		<div class="w-full">
			<select class="w-full" bind:value={settings.workoutLength}>
				{#each [15, 20, 25, 30, 35, 40, 45, 50, 55, 60] as l}
					<option value={l}>
						{l} minutes
					</option>
				{/each}
			</select>
		</div>
	</div>
	<div class="grid grid-cols-2 py-2">
		<div>Number of Exercises in Circuit</div>
		<div class="w-full">
			<select class="w-full" bind:value={settings.numberOfExercisesInCircuit}>
				{#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as n}
					<option value={n}>
						{n} exercises
					</option>
				{/each}
			</select>
		</div>
	</div>
	<div class="grid grid-cols-2 py-2">
		<div>Exercise Length</div>
		<div class="w-full">
			<select class="w-full" bind:value={settings.exerciseLength}>
				{#each [20, 30, 45, 60] as l}
					<option value={l}>
						{l} seconds
					</option>
				{/each}
			</select>
		</div>
	</div>
	<div class="grid grid-cols-2 py-2">
		<div>Rest Length</div>
		<div class="w-full">
			<select class="w-full" bind:value={settings.restLength}>
				{#each [20, 30, 45, 60] as l}
					<option value={l}>
						{l} seconds
					</option>
				{/each}
			</select>
		</div>
	</div>
	<div class="flex items-center justify-center">
		<button
			class="mt-5 border-blue-300 bg-gradient-to-br from-blue-300 to-blue-400 text-blue-900 font-semibold px-5 py-3 text-xl"
			on:click={saveAndGenerateWorkout}>Generate Workout</button
		>
	</div>
</div>
