<script lang="ts">
	import { browser } from '$app/env';
	import type { Workout } from 'src/global';
	import { goto } from '$app/navigation';

	async function requestForNotifications() {
		Notification.requestPermission().catch((err) => {
			alert('You must allow notifications for us to be friends...');
		});
	}

	let generatedWorkout: Workout = null;
	if (browser) {
		const savedWorkout = localStorage.getItem('workout');
		if (savedWorkout) {
			generatedWorkout = JSON.parse(savedWorkout);
		}
	}

	function goToSettings() {
		goto('/settings');
	}

	requestForNotifications();
</script>

<svelte:head>
	<title>Workout</title>
</svelte:head>

<div class="flex-1 flex justify-center items-center">
	<button id="make-me-workout-button" class="flex items-center justify-center text-center" on:click={goToSettings}>
		Make Me Workout
	</button>
</div>

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
		@apply border rounded-full border-blue-500 bg-gradient-to-br from-blue-300 to-blue-500 text-blue-900 text-3xl font-semibold tracking-widest;
		@apply active:from-blue-500 active:to-blue-700;
	}
</style>
