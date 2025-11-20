<script lang="ts">
	import { getQuestionsForDay } from '../../days.remote';
	import { page } from '$app/stores';

	let { params } = $props();
	const day = Number(params.day);

	if (isNaN(day) || day < 1 || day > 24) {
		throw new Error('Invalid day');
	}

	const questions = await getQuestionsForDay(day);
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-3xl font-bold mb-6">Day {day}</h1>

	{#if questions.length === 0}
		<p class="text-gray-600">No questions found for day {day}.</p>
		<a href="/" class="text-blue-600 hover:underline">← Back to calendar</a>
	{:else}
		<div class="space-y-4 mb-6">
			{#each questions as question (question._id)}
				<a
					href="/question/{question._id}"
					class="block bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer"
				>
					<p class="text-lg font-medium">{question.question}</p>
				</a>
			{/each}
		</div>
		<a href="/" class="text-blue-600 hover:underline">← Back to calendar</a>
	{/if}
</div>

