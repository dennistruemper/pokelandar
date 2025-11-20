<script lang="ts">
	import { onMount } from 'svelte';
	import type { Question } from '$lib/types/question';

	let questions: Question[] = [];
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			const response = await fetch('/api/questions');
			if (!response.ok) {
				throw new Error('Failed to fetch questions');
			}
			questions = await response.json();
		} catch (e) {
			error = e instanceof Error ? e.message : 'An error occurred';
			console.error('Error loading questions:', e);
		} finally {
			loading = false;
		}
	});
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-3xl font-bold mb-6">All Questions</h1>

	{#if loading}
		<p class="text-gray-600">Loading questions...</p>
	{:else if error}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
			<p>Error: {error}</p>
		</div>
	{:else if questions.length === 0}
		<p class="text-gray-600">No questions found. Please seed the database first.</p>
	{:else}
		<div class="space-y-4">
			{#each questions as question (question._id)}
				<details class="bg-white border border-gray-200 rounded-lg shadow-sm">
					<summary class="px-6 py-4 cursor-pointer hover:bg-gray-50 font-medium text-lg">
						{question.question}
					</summary>
					<div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
						<div class="space-y-3">
							<div>
								<p class="text-sm font-semibold text-gray-700 mb-1">Answer:</p>
								<p class="text-gray-900">{question.answer}</p>
							</div>
							<div>
								<p class="text-sm font-semibold text-gray-700 mb-1">Reward:</p>
								<p class="text-gray-900 italic">{question.reward}</p>
							</div>
						</div>
					</div>
				</details>
			{/each}
		</div>
	{/if}
</div>

