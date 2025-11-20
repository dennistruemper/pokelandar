<script lang="ts">
	import type { Question } from '$lib/types/question';
	import { onMount } from 'svelte';

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
	<h1 class="mb-6 text-3xl font-bold">Alle Fragen</h1>

	{#if loading}
		<p class="text-gray-600">Fragen werden geladen...</p>
	{:else if error}
		<div class="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
			<p>Fehler: {error}</p>
		</div>
	{:else if questions.length === 0}
		<p class="text-gray-600">Keine Fragen gefunden. Bitte zuerst die Datenbank befüllen.</p>
	{:else}
		<div class="space-y-4">
			{#each questions as question (question._id)}
				<details class="rounded-lg border border-gray-200 bg-white shadow-sm">
					<summary class="cursor-pointer px-6 py-4 text-lg font-medium hover:bg-gray-50">
						<div class="flex items-center justify-between">
							<span>{question.question}</span>
							{#if question.day}
								<span class="ml-4 text-sm font-normal text-gray-500">Tag {question.day}</span>
							{/if}
						</div>
					</summary>
					<div class="border-t border-gray-200 bg-gray-50 px-6 py-4">
						<div class="space-y-3">
							{#if question.day}
								<div>
									<p class="mb-1 text-sm font-semibold text-gray-700">Tag:</p>
									<p class="text-gray-900">{question.day}</p>
								</div>
							{/if}
							<div>
								<p class="mb-1 text-sm font-semibold text-gray-700">Antwort:</p>
								<p class="text-gray-900">{question.answer}</p>
							</div>
							<div>
								<p class="mb-1 text-sm font-semibold text-gray-700">Belohnung:</p>
								<p class="text-gray-900 italic">{question.reward}</p>
							</div>
						</div>
					</div>
				</details>
			{/each}
		</div>
	{/if}
</div>
