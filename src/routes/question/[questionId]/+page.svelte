<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { sessionStore } from '$lib/stores/session';
	import { completeDay } from '../../session.remote';

	let { data }: { data: PageData } = $props();

	const question = data.question;
	let answerInput = $state('');
	let wrongAttempts = $state(0);
	let revealedLetters = $state<Set<number>>(new Set());
	let isCorrect = $state(false);
	let showReward = $state(false);
	let sessionCode = $state<string | null>(null);

	// Subscribe to session store
	sessionStore.subscribe((state) => {
		sessionCode = state.code;
	});

	function formatAnswerHint(answer: string, revealed: Set<number>): string {
		return answer
			.split('')
			.map((char, index) => {
				if (char === ' ') return ' ';
				if (revealed.has(index)) return char;
				return '_';
			})
			.join('');
	}

	function revealNextLetter(answer: string): void {
		// Find the first unrevealed letter (skip spaces)
		for (let i = 0; i < answer.length; i++) {
			if (answer[i] !== ' ' && !revealedLetters.has(i)) {
				// Also reveal all occurrences of this letter (case-insensitive)
				const letter = answer[i].toLowerCase();
				for (let j = 0; j < answer.length; j++) {
					if (answer[j].toLowerCase() === letter) {
						revealedLetters.add(j);
					}
				}
				// Create a new Set to trigger reactivity
				revealedLetters = new Set(revealedLetters);
				break;
			}
		}
	}

	async function checkAnswer() {
		if (!answerInput.trim()) return;

		const normalizedInput = answerInput.trim().toLowerCase();
		const normalizedAnswer = question.answer.toLowerCase();

		if (normalizedInput === normalizedAnswer) {
			isCorrect = true;
			showReward = true;

			// Mark day as completed if session exists
			if (sessionCode && question.day) {
				const result = await completeDay({ sessionCode, day: question.day });
				if (result.success) {
					sessionStore.updateProgress(result.completedDays, result.lastCompletedDay);
				}
			}
		} else {
			wrongAttempts++;
			answerInput = '';

			// After 3 wrong attempts, reveal a letter (every 3 attempts)
			if (wrongAttempts >= 3 && wrongAttempts % 3 === 0) {
				revealNextLetter(question.answer);
			}
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter' && !isCorrect) {
			checkAnswer();
		}
	}
</script>

<div class="container mx-auto px-4 py-8">
	<div class="mb-4">
		<a href="/day/{question.day}" class="text-blue-600 hover:underline">← Zurück zu Tag {question.day}</a>
	</div>

	<h1 class="text-3xl font-bold mb-6">{question.question}</h1>

	{#if isCorrect}
		<div class="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
			<p class="text-green-800 font-semibold text-lg mb-2">Richtig! 🎉</p>
			<p class="text-green-700">Die Antwort ist: <strong>{question.answer}</strong></p>
			{#if showReward}
				<p class="text-green-600 mt-2 italic">{question.reward}</p>
			{/if}
		</div>
	{:else}
		<div class="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
			{#if revealedLetters.size > 0}
				<div class="mb-4">
					<p class="text-sm text-gray-600 mb-2">Hinweis:</p>
					<p class="text-2xl font-mono tracking-wider text-gray-800">
						{formatAnswerHint(question.answer, revealedLetters)}
					</p>
				</div>
			{/if}

			<div class="space-y-4">
				<div>
					<label for="answer" class="block text-sm font-medium text-gray-700 mb-2">
						Deine Antwort:
					</label>
					<input
						id="answer"
						type="text"
						bind:value={answerInput}
						onkeypress={handleKeyPress}
						placeholder="Gib deine Antwort ein..."
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						autocomplete="off"
					/>
				</div>

				<button
					onclick={checkAnswer}
					disabled={!answerInput.trim()}
					class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
				>
					Antwort prüfen
				</button>

				{#if wrongAttempts > 0}
					<div class="text-sm text-gray-600">
						<p>Falsche Versuche: {wrongAttempts}</p>
						{#if wrongAttempts >= 3}
							<p class="text-blue-600 mt-1">
								💡 Nach jeweils 3 falschen Versuchen erhältst du einen Buchstaben-Hinweis!
							</p>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

