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
	<div class="flex flex-col p-5">
		<h2 class="text-center text-3xl mb-5">Here's your workout</h2>
		<div class="flex flex-col">
			{#each generatedWorkout.exercises as circuit, index}
				<div class="flex">
					<div class="flex-1 text-xl tracking-widest">CIRCUIT {index + 1}</div>
					<div class="flex-1 flex flex-col">
						{#each circuit as circ}
							<div>{circ.exercise.name}</div>
						{/each}
					</div>
				</div>
				<div class="my-2 bg-gray-500" style="height:1px;width:100%;" />
			{/each}
		</div>
		<div class="w-full flex justify-between items-center">
			<button class="mt-5 p-3" on:click={startOver}>Start Over</button>
			<button class="mt-5 p-3" on:click={startWorkout}>Start Workout</button>
		</div>
	</div>
{/if}
