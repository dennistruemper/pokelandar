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
	<h1 class="mb-8 pr-12 text-center text-2xl font-bold sm:pr-0 sm:text-3xl">Adventskalender</h1>

	<!-- Pokemon Code Display/Input -->
	<div
		class="mb-6 rounded-lg border-2 p-4"
		style="border-color: var(--theme-primary-light); background-color: var(--theme-secondary);"
	>
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
					class="rounded px-4 py-2 text-sm text-white transition-colors"
					style="background-color: var(--theme-primary);"
					onmouseenter={(e) => {
						e.currentTarget.style.backgroundColor = 'var(--theme-primary-dark)';
					}}
					onmouseleave={(e) => {
						e.currentTarget.style.backgroundColor = 'var(--theme-primary)';
					}}
				>
					Code ändern
				</button>
			</div>
		{:else}
			<div>
				<p style="color: var(--theme-text);" class="mb-2 text-sm font-medium">
					Pokémon-Code eingeben:
				</p>
				<div class="flex gap-2">
					<input
						type="text"
						bind:value={codeInput}
						placeholder="z.B. Glurak-Bisasam-Pikachu"
						class="flex-1 rounded border px-3 py-2"
						style="border-color: var(--theme-border); background-color: var(--theme-bg); color: var(--theme-text);"
						onkeypress={(e) => e.key === 'Enter' && handleCodeSubmit()}
					/>
					<button
						onclick={handleCodeSubmit}
						class="rounded px-4 py-2 text-white transition-colors"
						style="background-color: var(--theme-primary);"
						onmouseenter={(e) => {
							e.currentTarget.style.backgroundColor = 'var(--theme-primary-dark)';
						}}
						onmouseleave={(e) => {
							e.currentTarget.style.backgroundColor = 'var(--theme-primary)';
						}}
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
							class="rounded px-4 py-2 transition-colors"
							style="background-color: var(--theme-border); color: var(--theme-text);"
							onmouseenter={(e) => {
								e.currentTarget.style.opacity = '0.8';
							}}
							onmouseleave={(e) => {
								e.currentTarget.style.opacity = '1';
							}}
						>
							Abbrechen
						</button>
					{/if}
				</div>
				{#if codeError}
					<p style="color: var(--theme-primary-dark);" class="mt-2 text-sm">{codeError}</p>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Info Box -->
	<details
		class="mb-6 rounded-lg border-2"
		style="border-color: var(--theme-border); background-color: var(--theme-card-bg);"
		open={infoExpanded}
	>
		<summary class="cursor-pointer p-4" style="background-color: var(--theme-secondary);">
			<div class="flex items-center gap-3">
				<div class="text-2xl">📅</div>
				<p style="color: var(--theme-text);" class="font-semibold">
					Wie funktioniert der Adventskalender?
				</p>
			</div>
		</summary>
		<div
			class="p-4 pt-4"
			style="border-top-color: var(--theme-border); border-top-width: 1px; border-top-style: solid; background-color: var(--theme-secondary);"
		>
			<ul class="space-y-1 text-sm" style="color: var(--theme-text);">
				<li style="color: var(--theme-text);">
					• <strong>Grüne Tage</strong>: Verfügbar zum Öffnen
				</li>
				<li style="color: var(--theme-text);">
					• <strong>Lila Tage</strong>: Bereits abgeschlossen ✓
				</li>
				<li style="color: var(--theme-text);">
					• <strong>Gelbe Tage</strong>: Gesperrt - du musst zuerst den vorherigen Tag abschließen
				</li>
				<li style="color: var(--theme-text);">
					• <strong>Graue Tage</strong>: Noch keine Fragen vorhanden
				</li>
			</ul>
			<p style="color: var(--theme-text);" class="mt-2 text-sm">
				<strong>Wichtig:</strong> Du musst die Tage in Reihenfolge abschließen. Tag 2 wird erst freigeschaltet,
				wenn Tag 1 abgeschlossen ist, usw.
			</p>
		</div>
	</details>

	<!-- Locked Day Message -->
	{#if lockedDayMessage}
		<div
			class="mb-4 rounded-lg border-2 p-4"
			style="border-color: var(--theme-warning); background-color: rgba(247, 127, 0, 0.1);"
		>
			<div class="flex items-start gap-2">
				<span class="text-xl">🔒</span>
				<p style="color: var(--theme-warning);" class="flex-1 text-sm">{lockedDayMessage}</p>
				<button
					onclick={() => {
						lockedDayMessage = null;
					}}
					style="color: var(--theme-warning);"
					class="hover:opacity-80"
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
						{isCurrentDay ? 'font-bold' : ''}
						{hasQ && canAccess ? 'cursor-pointer hover:shadow-md' : ''}
						{isFuture ? 'cursor-not-allowed opacity-50' : ''}
						{isLocked ? 'cursor-not-allowed opacity-75' : ''}"
					style="
						{isCurrentDay
						? `border-color: var(--theme-primary); background-color: var(--theme-secondary); color: var(--theme-primary);`
						: isCompletedDay
							? `border-color: var(--theme-completed); background-color: rgba(114, 9, 183, 0.1); color: var(--theme-completed);`
							: hasQ && canAccess
								? `border-color: var(--theme-success); background-color: rgba(6, 167, 125, 0.1); color: var(--theme-success);`
								: isLocked
									? `border-color: var(--theme-warning); background-color: rgba(247, 127, 0, 0.1); color: var(--theme-warning);`
									: `border-color: var(--theme-border); background-color: var(--theme-card-bg); color: var(--theme-text-light);`}
					"
					onmouseenter={(e) => {
						handleDayHover(day);
						if (hasQ && canAccess && !isFuture && !isLocked) {
							e.currentTarget.style.backgroundColor = 'rgba(6, 167, 125, 0.2)';
						}
					}}
					onmouseleave={(e) => {
						handleDayLeave();
						if (hasQ && canAccess && !isFuture && !isLocked) {
							e.currentTarget.style.backgroundColor = 'rgba(6, 167, 125, 0.1)';
						}
					}}
					disabled={isFuture || !hasQ || isLocked}
					type="button"
					onclick={() => handleDayClick(day)}
				>
					<div class="mb-1 text-2xl font-semibold">{day}</div>
					{#if isCompletedDay}
						<div style="color: var(--theme-completed);" class="text-xs">✓</div>
					{:else if isLocked}
						<div style="color: var(--theme-warning);" class="text-xs">🔒</div>
					{:else if hasQ}
						<div style="color: var(--theme-success);" class="text-xs">?</div>
					{:else}
						<div style="color: var(--theme-text-light);" class="text-xs">—</div>
					{/if}
				</button>

				<!-- Tooltip for locked days -->
				{#if hoveredDay === day && isLocked && requiredDay}
					<div
						class="absolute top-full left-1/2 z-10 mt-2 -translate-x-1/2 rounded-lg px-3 py-2 text-xs text-white shadow-lg"
						style="white-space: nowrap; pointer-events: none; background-color: var(--theme-text);"
					>
						🔒 Tag {requiredDay} zuerst abschließen
						<div
							class="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent"
							style="border-bottom-color: var(--theme-text);"
						></div>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>
