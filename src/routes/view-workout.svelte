<script lang="ts">
	import { browser } from '$app/env';
	import type { Workout } from 'src/global';
	import { goto } from '$app/navigation';

	let generatedWorkout: Workout = null;

	if (browser) {
		const savedWorkout = localStorage.getItem('workout');
		if (savedWorkout) {
			generatedWorkout = JSON.parse(savedWorkout);
		}
	}

	function startOver() {
		localStorage.removeItem('workout');
		goto('/settings');
	}

	function startWorkout() {
		goto('/workout');
	}
</script>

{#if generatedWorkout}
	<div class="flex flex-col items-center justify-center p-5">
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
		<div class="w-full flex justify-between items-center">
			<button class="mt-5 border-blue-300 bg-gradient-to-br from-blue-300 to-blue-400 text-blue-900 font-semibold p-3" on:click={startOver}
				>Start Over</button
			>
			<button class="mt-5 border-blue-300 bg-gradient-to-br from-blue-300 to-blue-400 text-blue-900 font-semibold p-3" on:click={startWorkout}
				>Start Workout</button
			>
		</div>
	</div>
{/if}
