<script lang="ts">
	import { getQuestionsForDay } from '../../days.remote';
	import { goto } from '$app/navigation';

	let { params } = $props();
	const day = Number(params.day);

	if (isNaN(day) || day < 1 || day > 24) {
		throw new Error('Ungültiger Tag');
	}

	const questions = await getQuestionsForDay(day);
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-3xl font-bold mb-6">Tag {day}</h1>

	{#if questions.length === 0}
		<p class="text-gray-600">Keine Fragen für Tag {day} gefunden.</p>
		<a href="/" class="text-blue-600 hover:underline">← Zurück zum Kalender</a>
	{:else}
		<div class="space-y-4 mb-6">
			{#each questions as question (question._id)}
				<button
					type="button"
					onclick={() => goto(`/question/${question._id}`)}
					class="w-full text-left block bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer"
				>
					<p class="text-lg font-medium">{question.question}</p>
				</button>
			{/each}
		</div>
		<a href="/" class="text-blue-600 hover:underline">← Zurück zum Kalender</a>
	{/if}
</div>

