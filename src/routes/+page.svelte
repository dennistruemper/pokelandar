<script lang="ts">
	import { goto } from '$app/navigation';
	import { sessionStore } from '$lib/stores/session';
	import type { PageData } from './$types';
	import {
		canAccessDay,
		createSessionWithCode,
		loadSessionByCode,
		validatePokemonCode
	} from './session.remote';

	let { data }: { data: PageData } = $props();

	const daysWithQuestions: number[] = data?.days ?? [];
	const currentDay = data?.currentDay ?? new Date().getDate();

	let sessionCode = $state<string | null>(null);
	let completedDays = $state<number[]>([]);
	let showCodeInput = $state(false);
	let codeInput = $state('');
	let codeError = $state<string | null>(null);
	let hoveredDay = $state<number | null>(null);
	let lockedDayMessage = $state<string | null>(null);
	let infoExpanded = $state(false);

	// Check if this is the first visit
	if (typeof window !== 'undefined') {
		const hasVisited = localStorage.getItem('pokelandar_has_visited');
		infoExpanded = !hasVisited;
		if (!hasVisited) {
			localStorage.setItem('pokelandar_has_visited', 'true');
		}
	}

	// Subscribe to session store
	sessionStore.subscribe((state) => {
		sessionCode = state.code;
		completedDays = state.completedDays;
	});

	async function handleCodeSubmit() {
		codeError = null;
		const trimmedCode = codeInput.trim();
		if (!trimmedCode) return;

		// First validate the code format
		const isValid = await validatePokemonCode(trimmedCode);
		if (!isValid) {
			codeError = 'Ungültiger Code. Bitte überprüfe deine Eingabe.';
			return;
		}

		// Try to load existing session
		let session = await loadSessionByCode(trimmedCode);

		// If no session exists but code is valid, create a new one
		if (!session) {
			const newSession = await createSessionWithCode(trimmedCode);
			if (newSession) {
				session = {
					sessionId: newSession.sessionId,
					code: newSession.code,
					completedDays: [],
					lastCompletedDay: 0
				};
			}
		}

		if (session) {
			sessionStore.setCode(session.code);
			sessionStore.updateProgress(session.completedDays, session.lastCompletedDay);
			showCodeInput = false;
			codeInput = '';
		} else {
			codeError = 'Fehler beim Erstellen der Session. Bitte versuche es erneut.';
		}
	}

	function hasQuestion(day: number): boolean {
		if (!Array.isArray(daysWithQuestions)) return false;
		return daysWithQuestions.includes(day);
	}

	function isFutureDay(day: number): boolean {
		return day > currentDay;
	}

	function isToday(day: number): boolean {
		return day === currentDay;
	}

	function isCompleted(day: number): boolean {
		return completedDays.includes(day);
	}

	function getRequiredDay(day: number): number | null {
		if (day === 1) return null;
		if (!sessionCode) return null;
		if (completedDays.includes(day - 1)) return null;
		return day - 1;
	}

	async function handleDayClick(day: number) {
		if (!hasQuestion(day) || isFutureDay(day)) return;

		// Check if day can be accessed
		if (sessionCode) {
			const access = await canAccessDay({ sessionCode, day });
			if (!access.canAccess) {
				lockedDayMessage = `Du musst zuerst Tag ${access.requiredDay} abschließen, bevor du Tag ${day} öffnen kannst.`;
				setTimeout(() => {
					lockedDayMessage = null;
				}, 5000);
				return;
			}
		}

		goto(`/day/${day}`);
	}

	function handleDayHover(day: number) {
		hoveredDay = day;
	}

	function handleDayLeave() {
		hoveredDay = null;
	}
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-center text-3xl font-bold">Adventskalender</h1>

	<!-- Pokemon Code Display/Input -->
	<div class="mb-6 rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
		{#if sessionCode && !showCodeInput}
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-700">Dein Pokémon-Code:</p>
					<p class="mt-1 text-2xl font-bold text-blue-700">{sessionCode}</p>
					<p class="mt-1 text-xs text-gray-600">
						Verwende diesen Code auf anderen Geräten, um deinen Fortschritt zu laden.
					</p>
				</div>
				<button
					onclick={() => {
						showCodeInput = true;
					}}
					class="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
				>
					Code ändern
				</button>
			</div>
		{:else}
			<div>
				<p class="mb-2 text-sm font-medium text-gray-700">Pokémon-Code eingeben:</p>
				<div class="flex gap-2">
					<input
						type="text"
						bind:value={codeInput}
						placeholder="z.B. Glurak-Bisasam-Pikachu"
						class="flex-1 rounded border border-gray-300 px-3 py-2"
						onkeypress={(e) => e.key === 'Enter' && handleCodeSubmit()}
					/>
					<button
						onclick={handleCodeSubmit}
						class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
					>
						Laden
					</button>
					{#if sessionCode}
						<button
							onclick={() => {
								showCodeInput = false;
								codeInput = '';
								codeError = null;
							}}
							class="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
						>
							Abbrechen
						</button>
					{/if}
				</div>
				{#if codeError}
					<p class="mt-2 text-sm text-red-600">{codeError}</p>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Info Box -->
	<details class="mb-6 rounded-lg border-2 border-gray-200 bg-gray-50" open={infoExpanded}>
		<summary class="cursor-pointer p-4">
			<div class="flex items-center gap-3">
				<div class="text-2xl">📅</div>
				<p class="font-semibold text-gray-800">Wie funktioniert der Adventskalender?</p>
			</div>
		</summary>
		<div class="border-t border-gray-200 p-4 pt-4">
			<ul class="space-y-1 text-sm text-gray-600">
				<li>• <strong>Grüne Tage</strong>: Verfügbar zum Öffnen</li>
				<li>• <strong>Lila Tage</strong>: Bereits abgeschlossen ✓</li>
				<li>
					• <strong>Gelbe Tage</strong>: Gesperrt - du musst zuerst den vorherigen Tag abschließen
				</li>
				<li>• <strong>Graue Tage</strong>: Noch keine Fragen vorhanden</li>
			</ul>
			<p class="mt-2 text-sm text-gray-700">
				<strong>Wichtig:</strong> Du musst die Tage in Reihenfolge abschließen. Tag 2 wird erst freigeschaltet,
				wenn Tag 1 abgeschlossen ist, usw.
			</p>
		</div>
	</details>

	<!-- Locked Day Message -->
	{#if lockedDayMessage}
		<div class="mb-4 rounded-lg border-2 border-yellow-400 bg-yellow-50 p-4">
			<div class="flex items-start gap-2">
				<span class="text-xl">🔒</span>
				<p class="flex-1 text-sm text-yellow-800">{lockedDayMessage}</p>
				<button
					onclick={() => {
						lockedDayMessage = null;
					}}
					class="text-yellow-600 hover:text-yellow-800"
				>
					✕
				</button>
			</div>
		</div>
	{/if}

	<div class="grid grid-cols-4 gap-4 md:grid-cols-6 lg:grid-cols-8">
		{#each Array(24) as _, i}
			{@const day = i + 1}
			{@const hasQ = hasQuestion(day)}
			{@const isFuture = isFutureDay(day)}
			{@const isCurrentDay = isToday(day)}

			{@const isCompletedDay = isCompleted(day)}
			{@const canAccess = day === 1 || isCompleted(day - 1) || !sessionCode}
			{@const requiredDay = getRequiredDay(day)}
			{@const isLocked = Boolean(hasQ && !canAccess && sessionCode)}
			<div class="relative">
				<button
					class="aspect-square w-full rounded-lg border-2 p-4 text-center transition-all
						{isCurrentDay
						? 'border-blue-500 bg-blue-50 font-bold'
						: isCompletedDay
							? 'border-purple-500 bg-purple-50'
							: hasQ && canAccess
								? 'cursor-pointer border-green-500 bg-green-50 hover:bg-green-100 hover:shadow-md'
								: isLocked
									? 'border-yellow-500 bg-yellow-50 opacity-75'
									: 'border-gray-300 bg-gray-50'}
						{isFuture ? 'cursor-not-allowed opacity-50' : ''}
						{isLocked ? 'cursor-not-allowed' : ''}"
					disabled={isFuture || !hasQ || isLocked}
					type="button"
					onclick={() => handleDayClick(day)}
					onmouseenter={() => handleDayHover(day)}
					onmouseleave={handleDayLeave}
				>
					<div class="mb-1 text-2xl font-semibold">{day}</div>
					{#if isCompletedDay}
						<div class="text-xs text-purple-600">✓</div>
					{:else if isLocked}
						<div class="text-xs text-yellow-600">🔒</div>
					{:else if hasQ}
						<div class="text-xs text-green-600">?</div>
					{:else}
						<div class="text-xs text-gray-400">—</div>
					{/if}
				</button>

				<!-- Tooltip for locked days -->
				{#if hoveredDay === day && isLocked && requiredDay}
					<div
						class="absolute top-full left-1/2 z-10 mt-2 -translate-x-1/2 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg"
						style="white-space: nowrap; pointer-events: none;"
					>
						🔒 Tag {requiredDay} zuerst abschließen
						<div
							class="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900"
						></div>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>
